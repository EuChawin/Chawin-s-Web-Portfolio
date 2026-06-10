import { adminGetGallery, adminGetGalleryCategories } from '@/lib/supabase/admin-queries'
import { GalleryManager } from './_components/GalleryManager'

export const metadata = { title: 'Gallery Manager | Admin CMS' }

export default async function AdminGalleryPage() {
  const items = await adminGetGallery()
  const categories = await adminGetGalleryCategories()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Gallery Manager</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage albums, bulk upload media, and organize your public gallery.</p>
      </div>

      <GalleryManager initialItems={items} initialCategories={categories} />
    </div>
  )
}
