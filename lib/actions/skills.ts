'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { adminGetSkills } from '@/lib/supabase/admin-queries'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin email mismatch')
  }
  return user
}

export async function addSkill(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('skills').insert({
    name:          formData.get('name') as string,
    category:      formData.get('category') as string,
    proficiency:   parseInt(formData.get('proficiency') as string) || null,
    icon_name:     formData.get('icon_name') as string || undefined,
    is_published:  formData.get('is_published') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('skills').update({
    name:          formData.get('name') as string,
    category:      formData.get('category') as string,
    proficiency:   parseInt(formData.get('proficiency') as string) || null,
    icon_name:     formData.get('icon_name') as string || null,
    is_published:  formData.get('is_published') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return { success: true }
}

export async function deleteSkill(id: string) {
  await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return { success: true }
}

export async function reorderSkills(items: { id: string, display_order: number }[]) {
  await requireAuth()
  const supabase = await createClient()
  
  await Promise.all(
    items.map(item => 
      supabase.from('skills').update({ display_order: item.display_order }).eq('id', item.id)
    )
  )
  
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return { success: true }
}
