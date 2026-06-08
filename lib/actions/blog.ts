'use server'
// lib/actions/blog.ts

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { generateSlug, estimateReadingTime } from '@/lib/utils/slug'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function createBlogPost(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const content = formData.get('content') as string || ''
  
  const coverFile = formData.get('cover_image') as File | null
  let cover_image_url: string | undefined

  if (coverFile && coverFile.size > 0) {
    const result = await uploadFile('blog-images', `${slug}/cover.webp`, coverFile, 'image/webp')
    if ('url' in result) cover_image_url = result.url
  }

  const status = formData.get('status') as string || 'draft'
  const published_at_input = formData.get('published_at') as string
  
  // Auto-set published_at if status is published and no date provided
  let published_at = published_at_input || null
  if (status === 'published' && !published_at) {
    published_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from('blog_posts').insert({
    slug,
    title,
    excerpt:              formData.get('excerpt') as string || undefined,
    content,
    tags:                 JSON.parse(formData.get('tags') as string || '[]'),
    category:             formData.get('category') as string || undefined,
    reading_time_minutes: estimateReadingTime(content),
    status,
    published_at,
    is_featured:          formData.get('is_featured') === 'true',
    cover_image_url,
  }).select().single()

  if (error) return { error: error.message }
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { data }
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const slug = formData.get('slug') as string
  const content = formData.get('content') as string || ''
  
  const coverFile = formData.get('cover_image') as File | null
  let cover_image_url: string | undefined

  if (coverFile && coverFile.size > 0) {
    const result = await uploadFile('blog-images', `${slug}/cover.webp`, coverFile, 'image/webp')
    if ('url' in result) cover_image_url = result.url
  }

  const status = formData.get('status') as string
  const published_at_input = formData.get('published_at') as string
  
  let published_at = published_at_input || null
  if (status === 'published' && !published_at) {
    published_at = new Date().toISOString()
  }

  const update: Record<string, unknown> = {
    slug,
    title:                formData.get('title') as string,
    excerpt:              formData.get('excerpt') as string || null,
    content,
    tags:                 JSON.parse(formData.get('tags') as string || '[]'),
    category:             formData.get('category') as string || null,
    reading_time_minutes: estimateReadingTime(content),
    status,
    published_at,
    is_featured:          formData.get('is_featured') === 'true',
  }
  if (cover_image_url) update.cover_image_url = cover_image_url

  const { error } = await supabase.from('blog_posts').update(update).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  return { success: true }
}

export async function archiveBlogPost(id: string) {
  await requireAuth()
  const supabase = await createClient()
  const { error } = await supabase
    .from('blog_posts')
    .update({ archived_at: new Date().toISOString(), status: 'archived' })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  return { success: true }
}
