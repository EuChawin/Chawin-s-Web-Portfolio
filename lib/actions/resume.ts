'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { adminGetResumeFiles } from '@/lib/supabase/admin-queries'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function uploadResumeFile(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }
  if (file.type !== 'application/pdf') return { error: 'Only PDF files are allowed' }

  // Generate a path: YYYY-MM-DD-filename.pdf
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `${dateStr}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const path = `versions/${fileName}`

  // Upload to secure bucket
  const result = await uploadFile('resume-files', path, file, 'application/pdf')
  if ('error' in result) return { error: result.error }

  // Record in DB
  const { data, error } = await supabase.from('resume_files').insert({
    file_name:  file.name,
    file_url:   result.url,
    label:      formData.get('label') as string || file.name,
    notes:      formData.get('version_notes') as string || null,
    file_size_bytes: file.size,
    is_active:  formData.get('is_active') === 'true',
  }).select().single()

  if (error) return { error: error.message }
  
  revalidatePath('/admin/resume')
  revalidatePath('/resume') // In case we show a download link
  return { data }
}

export async function setActiveResumeFile(id: string) {
  await requireAuth()
  const supabase = await createClient()
  
  // The trigger ensure_single_active_resume will automatically set others to inactive
  const { error } = await supabase.from('resume_files').update({ is_active: true }).eq('id', id)
  
  if (error) return { error: error.message }
  revalidatePath('/admin/resume')
  revalidatePath('/resume')
  return { success: true }
}

export async function deleteResumeFile(id: string) {
  await requireAuth()
  const supabase = await createClient()

  // 1. Get the file to find its storage path
  const { data: fileItem } = await supabase.from('resume_files').select('storage_path, is_active').eq('id', id).single()
  
  if (fileItem?.is_active) {
     return { error: 'Cannot delete the active resume. Set another file as active first.' }
  }

  // 2. Try to clean up storage
  if (fileItem?.storage_path) {
      await supabase.storage.from('resume-files').remove([fileItem.storage_path])
  }

  // 3. Delete from DB
  const { error } = await supabase.from('resume_files').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/resume')
  return { success: true }
}
