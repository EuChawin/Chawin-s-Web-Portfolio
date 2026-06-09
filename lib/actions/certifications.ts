'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { adminGetCertifications } from '@/lib/supabase/admin-queries'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function addCertification(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  let cover_image_url: string | undefined
  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const path = `certifications/${Date.now()}-${imageFile.name}`
    const result = await uploadFile('certification-images', path, imageFile, imageFile.type)
    if ('url' in result) cover_image_url = result.url
  }

  const { error } = await supabase.from('certifications').insert({
    name:            formData.get('name') as string,
    issuer:          formData.get('issuer') as string,
    issue_date:      formData.get('issue_date') as string,
    expiry_date:     formData.get('expiry_date') as string || undefined,
    credential_id:   formData.get('credential_id') as string || undefined,
    credential_url:  formData.get('credential_url') as string || undefined,
    cover_image_url,
    is_published:    formData.get('is_published') === 'true',
    display_order:   parseInt(formData.get('display_order') as string) || 0,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/')
  return { success: true }
}

export async function updateCertification(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const updateData: any = {
    name:            formData.get('name') as string,
    issuer:          formData.get('issuer') as string,
    issue_date:      formData.get('issue_date') as string,
    expiry_date:     formData.get('expiry_date') as string || null,
    credential_id:   formData.get('credential_id') as string || null,
    credential_url:  formData.get('credential_url') as string || null,
    is_published:    formData.get('is_published') === 'true',
  }

  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const path = `certifications/${Date.now()}-${imageFile.name}`
    const result = await uploadFile('certification-images', path, imageFile, imageFile.type)
    if ('url' in result) updateData.cover_image_url = result.url
  }

  const { error } = await supabase.from('certifications').update(updateData).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCertification(id: string) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/certifications')
  revalidatePath('/')
  return { success: true }
}
