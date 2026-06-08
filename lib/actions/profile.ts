'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { adminGetProfile } from '@/lib/supabase/admin-queries'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function updateProfile(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const currentProfile = await adminGetProfile()
  if (!currentProfile) throw new Error('Profile not found. Is the handle_new_user trigger working?')

  const avatarFile = formData.get('avatar') as File | null
  let avatar_url: string | undefined

  if (avatarFile && avatarFile.size > 0) {
    const result = await uploadFile('profile-images', `${user.id}/avatar.webp`, avatarFile, 'image/webp')
    if ('url' in result) avatar_url = result.url
  }

  const update: Record<string, unknown> = {
    full_name:    formData.get('full_name') as string,
    headline:     formData.get('headline') as string,
    bio_short:    formData.get('bio_short') as string,
    bio_long:     formData.get('bio_long') as string,
    location:     formData.get('location') as string,
    email:        formData.get('email') as string || null,
    github_url:   formData.get('github_url') as string || null,
    linkedin_url: formData.get('linkedin_url') as string || null,
    twitter_url:  formData.get('twitter_url') as string || null,
    gpa:          formData.get('gpa') as string || null,
    // Merge metrics into the existing metadata JSON
    metadata: {
      ...(currentProfile.metadata as Record<string, unknown> ?? {}),
      ielts_score:          formData.get('ielts_score')          ? parseFloat(formData.get('ielts_score') as string)          : undefined,
      countries_count:      formData.get('countries_count')      ? parseFloat(formData.get('countries_count') as string)      : undefined,
      certifications_count: formData.get('certifications_count') ? parseFloat(formData.get('certifications_count') as string) : undefined,
      projects_count:       formData.get('projects_count')       ? parseFloat(formData.get('projects_count') as string)       : undefined,
    },
  }
  if (avatar_url) update.avatar_url = avatar_url

  const { error } = await supabase.from('profiles').update(update).eq('id', currentProfile.id)
  if (error) return { error: error.message }

  revalidatePath('/admin/profile')
  revalidatePath('/')
  revalidatePath('/about')
  return { success: true }
}
