'use server'
// lib/actions/activities.ts

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { generateSlug } from '@/lib/utils/slug'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function createActivity(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const coverFile = formData.get('cover_image') as File | null
  let cover_image_url: string | undefined

  if (coverFile && coverFile.size > 0) {
    const result = await uploadFile('activity-images', `${slug}/cover.webp`, coverFile, 'image/webp')
    if ('url' in result) cover_image_url = result.url
  }

  const { data, error } = await supabase.from('activities').insert({
    slug,
    title,
    type:          formData.get('type') as string,
    provider:      formData.get('provider') as string || undefined,
    description:   formData.get('description') as string || undefined,
    url:           formData.get('url') as string || undefined,
    certificate_url: formData.get('certificate_url') as string || undefined,
    tags:          JSON.parse(formData.get('tags') as string || '[]'),
    start_date:    formData.get('start_date') as string || undefined,
    end_date:      formData.get('end_date') as string || undefined,
    is_completed:  formData.get('is_completed') === 'true',
    is_featured:   formData.get('is_featured') === 'true',
    is_published:  formData.get('is_published') === 'true',
    cover_image_url,
  }).select().single()

  if (error) return { error: error.message }
  revalidatePath('/admin/activities')
  revalidatePath('/activities')
  return { data }
}

export async function updateActivity(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const slug = formData.get('slug') as string
  const coverFile = formData.get('cover_image') as File | null
  let cover_image_url: string | undefined

  if (coverFile && coverFile.size > 0) {
    const result = await uploadFile('activity-images', `${slug}/cover.webp`, coverFile, 'image/webp')
    if ('url' in result) cover_image_url = result.url
  }

  const update: Record<string, unknown> = {
    slug,
    title:         formData.get('title') as string,
    type:          formData.get('type') as string,
    provider:      formData.get('provider') as string || null,
    description:   formData.get('description') as string || null,
    url:           formData.get('url') as string || null,
    certificate_url: formData.get('certificate_url') as string || null,
    tags:          JSON.parse(formData.get('tags') as string || '[]'),
    start_date:    formData.get('start_date') as string || null,
    end_date:      formData.get('end_date') as string || null,
    is_completed:  formData.get('is_completed') === 'true',
    is_featured:   formData.get('is_featured') === 'true',
    is_published:  formData.get('is_published') === 'true',
  }
  if (cover_image_url) update.cover_image_url = cover_image_url

  const { error } = await supabase.from('activities').update(update).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/activities')
  revalidatePath('/activities')
  return { success: true }
}

export async function toggleActivityPublish(id: string, is_published: boolean) {
  await requireAuth()
  const supabase = await createClient()
  const { error } = await supabase.from('activities').update({ is_published }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/activities')
  revalidatePath('/activities')
  return { success: true }
}

export async function archiveActivity(id: string) {
  await requireAuth()
  const supabase = await createClient()
  const { error } = await supabase
    .from('activities')
    .update({ archived_at: new Date().toISOString(), is_published: false })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/activities')
  return { success: true }
}
