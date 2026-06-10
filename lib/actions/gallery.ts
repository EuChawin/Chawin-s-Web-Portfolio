'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import type { GalleryCategoryInsert, GalleryCategoryUpdate } from '@/lib/types/database'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

// ─── Categories ─────────────────────────────────────────────────────────────

export async function createGalleryCategory(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const insert: GalleryCategoryInsert = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string || '0', 10),
    is_published: formData.get('is_published') === 'true',
  }

  const { error } = await supabase.from('gallery_categories').insert(insert)
  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function updateGalleryCategory(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const update: GalleryCategoryUpdate = {
    title: formData.get('title') as string || undefined,
    slug: formData.get('slug') as string || undefined,
    description: formData.get('description') as string || null,
    cover_image_url: formData.get('cover_image_url') as string || null,
  }

  if (formData.has('sort_order')) update.sort_order = parseInt(formData.get('sort_order') as string, 10)
  if (formData.has('is_published')) update.is_published = formData.get('is_published') === 'true'

  const { error } = await supabase.from('gallery_categories').update(update).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function deleteGalleryCategory(id: string) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('gallery_categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function reorderGalleryCategories(orderedIds: string[]) {
  await requireAuth()
  const supabase = await createClient()

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('gallery_categories').update({ sort_order: i }).eq('id', orderedIds[i])
  }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

// ─── Gallery Items ──────────────────────────────────────────────────────────

export async function uploadGalleryItem(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }

  const isPublic = formData.get('is_public') === 'true'
  const subfolder = isPublic ? 'public' : 'private'
  
  const date = new Date()
  const yearMonth = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
  const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`
  const path = `${subfolder}/${yearMonth}/${fileName}`

  const result = await uploadFile('gallery-images', path, file, file.type)
  if ('error' in result) return { error: result.error }

  const fileUrl = result.url
  const thumbnailUrl = fileUrl

  const { data, error } = await supabase.from('gallery').insert({
    title:        formData.get('title') as string || undefined,
    description:  formData.get('description') as string || undefined,
    file_url:     fileUrl,
    thumbnail_url: thumbnailUrl,
    file_type:    file.type.startsWith('video/') ? 'video' : 'image',
    category:     formData.get('category') as string || undefined,
    category_id:  formData.get('category_id') as string || null,
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
    category_id:  formData.get('category_id') as string || null,
    tags:         JSON.parse(formData.get('tags') as string || '[]'),
    taken_at:     formData.get('taken_at') as string || null,
    location:     formData.get('location') as string || null,
  }

  if (formData.has('is_public')) update.is_public = formData.get('is_public') === 'true'
  if (formData.has('is_published')) update.is_published = formData.get('is_published') === 'true'
  if (formData.has('is_featured')) update.is_featured = formData.get('is_featured') === 'true'

  const { error } = await supabase.from('gallery').update(update).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
    await requireAuth()
    const supabase = await createClient()

    const { data: item } = await supabase.from('gallery').select('file_url').eq('id', id).single()
    
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) return { error: error.message }

    if (item?.file_url) {
        try {
             const urlParts = item.file_url.split('/gallery-images/')
             if (urlParts.length > 1) {
                 const path = urlParts[1].split('?')[0] 
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

// ─── Bulk Operations ────────────────────────────────────────────────────────

export async function bulkDeleteGalleryItems(ids: string[]) {
  await requireAuth()
  const supabase = await createClient()

  const { data: items } = await supabase.from('gallery').select('file_url').in('id', ids)

  const { error } = await supabase.from('gallery').delete().in('id', ids)
  if (error) return { error: error.message }

  if (items && items.length > 0) {
      try {
           const pathsToRemove = items.map(item => {
               const urlParts = item.file_url.split('/gallery-images/')
               if (urlParts.length > 1) {
                   return urlParts[1].split('?')[0]
               }
               return null
           }).filter(Boolean) as string[]
           
           if (pathsToRemove.length > 0) {
               await supabase.storage.from('gallery-images').remove(pathsToRemove)
           }
      } catch (e) {
          console.error('Failed to bulk delete files from storage', e)
      }
  }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function bulkMoveGalleryItems(ids: string[], categoryId: string | null) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('gallery').update({ category_id: categoryId }).in('id', ids)
  if (error) return { error: error.message }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function bulkTogglePublished(ids: string[], is_published: boolean) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('gallery').update({ is_published }).in('id', ids)
  if (error) return { error: error.message }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function bulkToggleFeatured(ids: string[], is_featured: boolean) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('gallery').update({ is_featured }).in('id', ids)
  if (error) return { error: error.message }

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function reorderGalleryItems(orderedIds: string[]) {
  await requireAuth()
  const supabase = await createClient()

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('gallery').update({ display_order: i }).eq('id', orderedIds[i])
  }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}
