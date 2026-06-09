'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { adminGetAchievements } from '@/lib/supabase/admin-queries'
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

export async function addAchievement(formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  let image_url: string | undefined
  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const path = `achievements/${Date.now()}-${imageFile.name}`
    const result = await uploadFile('achievement-images', path, imageFile, imageFile.type)
    if ('url' in result) image_url = result.url
  }

  const { error } = await supabase.from('achievements').insert({
    title:         formData.get('title') as string,
    description:   formData.get('description') as string,
    awarded_date:  formData.get('awarded_date') as string,
    url:           formData.get('url') as string || undefined,
    issuer:        formData.get('issuer') as string,
    category:      formData.get('category') as any,
    cover_image_url: image_url,
    is_published:  formData.get('is_published') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/achievements')
  revalidatePath('/')
  return { success: true }
}

export async function updateAchievement(id: string, formData: FormData) {
  await requireAuth()
  const supabase = await createClient()

  const updateData: any = {
    title:         formData.get('title') as string,
    description:   formData.get('description') as string,
    awarded_date:  formData.get('awarded_date') as string,
    url:           formData.get('url') as string || null,
    issuer:        formData.get('issuer') as string,
    category:      formData.get('category') as string,
    is_published:  formData.get('is_published') === 'true',
  }

  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const path = `achievements/${Date.now()}-${imageFile.name}`
    const result = await uploadFile('achievement-images', path, imageFile, imageFile.type)
    if ('url' in result) updateData.cover_image_url = result.url
  }

  const { error } = await supabase.from('achievements').update(updateData).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/achievements')
  revalidatePath('/')
  return { success: true }
}

export async function deleteAchievement(id: string) {
  await requireAuth()
  const supabase = await createClient()

  // Find image to delete
  const { data: item } = await supabase.from('achievements').select('cover_image_url').eq('id', id).single()
  
  if (item?.cover_image_url) {
    try {
        const urlObj = new URL(item.cover_image_url)
        const pathParts = urlObj.pathname.split('/')
        const fileName = pathParts.pop()
        const folderName = pathParts.pop()
        if (folderName && fileName) {
           await supabase.storage.from('achievement-images').remove([`${folderName}/${fileName}`])
        }
    } catch (e) {
        console.error('Failed to clean up image', e)
    }
  }

  const { error } = await supabase.from('achievements').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/achievements')
  revalidatePath('/')
  return { success: true }
}

export async function reorderAchievements(items: { id: string, display_order: number }[]) {
  await requireAuth()
  const supabase = await createClient()
  
  await Promise.all(
    items.map(item => 
      supabase.from('achievements').update({ display_order: item.display_order }).eq('id', item.id)
    )
  )
  
  revalidatePath('/admin/achievements')
  revalidatePath('/')
  return { success: true }
}
