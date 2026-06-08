import { adminGetGallery } from '@/lib/supabase/admin-queries'
import { GalleryUpload } from './_components/GalleryUpload'

export const metadata = { title: 'Gallery | Admin CMS' }

export default async function AdminGalleryPage() {
  const items = await adminGetGallery()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Gallery Manager</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Upload images and videos. Get public URLs to use in blog posts or projects.</p>
      </div>

      <GalleryUpload items={items} />
    </div>
  )
}
