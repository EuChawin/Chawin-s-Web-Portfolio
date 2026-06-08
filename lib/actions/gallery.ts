'use server'
// lib/actions/gallery.ts

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function uploadGalleryItem(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }

  const isPublic = formData.get('is_public') === 'true'
  const subfolder = isPublic ? 'public' : 'private'
  
  // Date based folder structure: YYYY/MM/uuid.webp
  const date = new Date()
  const yearMonth = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
  const fileName = `${crypto.randomUUID()}.webp`
  const path = `${subfolder}/${yearMonth}/${fileName}`

  const result = await uploadFile('gallery-images', path, file, file.type)
  if ('error' in result) return { error: result.error }

  const fileUrl = result.url

  // TODO: Add thumbnail generation logic. For now, use the same URL.
  // In a real app, you'd resize the image before uploading or use Supabase Image Transformations.
  const thumbnailUrl = fileUrl

  const { data, error } = await supabase.from('gallery').insert({
    title:        formData.get('title') as string || undefined,
    description:  formData.get('description') as string || undefined,
    file_url:     fileUrl,
    thumbnail_url: thumbnailUrl,
    file_type:    file.type.startsWith('video/') ? 'video' : 'image',
    category:     formData.get('category') as string || undefined,
    tags:         JSON.parse(formData.get('tags') as string || '[]'),
    taken_at:     formData.get('taken_at') as string || undefined,
    location:     formData.get('location') as string || undefined,
    is_public:    isPublic,
    is_published: formData.get('is_published') === 'true',
    is_featured:  formData.get('is_featured') === 'true',
  }).select().single()

  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { data }
}

export async function updateGalleryItem(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const update: Record<string, unknown> = {
    title:        formData.get('title') as string || null,
    description:  formData.get('description') as string || null,
    category:     formData.get('category') as string || null,
    tags:         JSON.parse(formData.get('tags') as string || '[]'),
    taken_at:     formData.get('taken_at') as string || null,
    location:     formData.get('location') as string || null,
    is_public:    formData.get('is_public') === 'true',
    is_published: formData.get('is_published') === 'true',
    is_featured:  formData.get('is_featured') === 'true',
  }

  const { error } = await supabase.from('gallery').update(update).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
    await requireAuth()
    const supabase = await createClient()

    // 1. Get the item to find its storage path
    const { data: item } = await supabase.from('gallery').select('file_url').eq('id', id).single()
    
    // 2. Delete from DB
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) return { error: error.message }

    // 3. Try to clean up storage (best effort)
    if (item?.file_url) {
        try {
             // Extract path from URL (assuming it matches our expected format)
             const urlParts = item.file_url.split('/gallery-images/')
             if (urlParts.length > 1) {
                 const path = urlParts[1].split('?')[0] // remove any query params
                 await supabase.storage.from('gallery-images').remove([path])
             }
        } catch (e) {
            console.error('Failed to delete file from storage', e)
        }
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    return { success: true }
}
