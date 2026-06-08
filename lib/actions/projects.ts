'use server'
// lib/actions/projects.ts
// Server Actions for project CRUD — called from admin client components.
// These run server-side with the authenticated user's session.

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { generateSlug } from '@/lib/utils/slug'

// ─── Helper: verify admin is authenticated ────────────────────
async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

// ─── CREATE ───────────────────────────────────────────────────
export async function createProject(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const coverFile = formData.get('cover_image') as File | null

  let cover_image_url: string | undefined

  if (coverFile && coverFile.size > 0) {
    const result = await uploadFile(
      'project-images',
      `${slug}/cover.webp`,
      coverFile,
      'image/webp'
    )
    if ('url' in result) cover_image_url = result.url
  }

  const { data, error } = await supabase.from('projects').insert({
    slug,
    title,
    tagline:      formData.get('tagline') as string || undefined,
    description:  formData.get('description') as string || undefined,
    demo_url:     formData.get('demo_url') as string || undefined,
    repo_url:     formData.get('repo_url') as string || undefined,
    tech_stack:   JSON.parse(formData.get('tech_stack') as string || '[]'),
    tags:         JSON.parse(formData.get('tags') as string || '[]'),
    status:       (formData.get('status') as string) || 'completed',
    start_date:   formData.get('start_date') as string || undefined,
    end_date:     formData.get('end_date') as string || undefined,
    is_featured:  formData.get('is_featured') === 'true',
    is_published: formData.get('is_published') === 'true',
    cover_image_url,
  }).select().single()

  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { data }
}

// ─── UPDATE ───────────────────────────────────────────────────
export async function updateProject(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const slug = formData.get('slug') as string
  const coverFile = formData.get('cover_image') as File | null
  let cover_image_url: string | undefined

  if (coverFile && coverFile.size > 0) {
    const result = await uploadFile('project-images', `${slug}/cover.webp`, coverFile, 'image/webp')
    if ('url' in result) cover_image_url = result.url
  }

  const update: Record<string, unknown> = {
    slug,
    title:        formData.get('title') as string,
    tagline:      formData.get('tagline') as string || null,
    description:  formData.get('description') as string || null,
    demo_url:     formData.get('demo_url') as string || null,
    repo_url:     formData.get('repo_url') as string || null,
    tech_stack:   JSON.parse(formData.get('tech_stack') as string || '[]'),
    tags:         JSON.parse(formData.get('tags') as string || '[]'),
    status:       formData.get('status') as string,
    start_date:   formData.get('start_date') as string || null,
    end_date:     formData.get('end_date') as string || null,
    is_featured:  formData.get('is_featured') === 'true',
    is_published: formData.get('is_published') === 'true',
  }
  if (cover_image_url) update.cover_image_url = cover_image_url

  const { error } = await supabase.from('projects').update(update).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/projects')
  return { success: true }
}

// ─── TOGGLE PUBLISH ───────────────────────────────────────────
export async function toggleProjectPublish(id: string, is_published: boolean) {
  await requireAuth()
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update({ is_published }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { success: true }
}

// ─── ARCHIVE (soft delete) ────────────────────────────────────
export async function archiveProject(id: string) {
  await requireAuth()
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ archived_at: new Date().toISOString(), is_published: false })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { success: true }
}
