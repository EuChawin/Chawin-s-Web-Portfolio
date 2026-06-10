'use server'

import { getPublicGallery } from '@/lib/supabase/queries'

export async function fetchGalleryPage(page: number, categoryId?: string) {
  return getPublicGallery({ page, limit: 20, categoryId })
}
