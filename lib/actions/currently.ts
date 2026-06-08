'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile } from '@/lib/supabase/storage'
import { adminGetCurrently } from '@/lib/supabase/admin-queries'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function addCurrently(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('currently').insert({
    title:         formData.get('title') as string,
    url:           formData.get('url') as string || undefined,
    emoji:         formData.get('emoji') as string || undefined,
    is_active:     formData.get('is_active') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/currently')
  revalidatePath('/')
  return { success: true }
}

export async function updateCurrently(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('currently').update({
    title:         formData.get('title') as string,
    url:           formData.get('url') as string || null,
    emoji:         formData.get('emoji') as string || null,
    is_active:     formData.get('is_active') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/currently')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCurrently(id: string) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('currently').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/currently')
  revalidatePath('/')
  return { success: true }
}

export async function reorderCurrently(items: { id: string, display_order: number }[]) {
  await requireAuth()
  const supabase = await createClient()
  
  // Supabase doesn't have a bulk update RPC by default, so we do it in parallel
  await Promise.all(
    items.map(item => 
      supabase.from('currently').update({ display_order: item.display_order }).eq('id', item.id)
    )
  )
  
  revalidatePath('/admin/currently')
  revalidatePath('/')
  return { success: true }
}
