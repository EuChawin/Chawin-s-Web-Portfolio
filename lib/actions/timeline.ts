'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { adminGetTimeline } from '@/lib/supabase/admin-queries'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function addTimelineItem(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('timeline').insert({
    title:         formData.get('title') as string,
    organization:  formData.get('organization') as string,
    type:          formData.get('type') as string,
    description:   formData.get('description') as string || undefined,
    location:      formData.get('location') as string || undefined,
    start_date:    formData.get('start_date') as string,
    end_date:      formData.get('end_date') as string || undefined,
    is_current:    formData.get('is_current') === 'on',
    is_published:  formData.get('is_published') === 'on',
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/timeline')
  revalidatePath('/')
  return { success: true }
}

export async function updateTimelineItem(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('timeline').update({
    title:         formData.get('title') as string,
    organization:  formData.get('organization') as string,
    type:          formData.get('type') as string,
    description:   formData.get('description') as string || null,
    location:      formData.get('location') as string || null,
    start_date:    formData.get('start_date') as string,
    end_date:      formData.get('end_date') as string || null,
    is_current:    formData.get('is_current') === 'on',
    is_published:  formData.get('is_published') === 'on',
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/timeline')
  revalidatePath('/')
  return { success: true }
}

export async function deleteTimelineItem(id: string) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('timeline').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/timeline')
  revalidatePath('/')
  return { success: true }
}
