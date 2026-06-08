import { adminGetCertifications } from '@/lib/supabase/admin-queries'
import { CertificationsManager } from './_components/CertificationsManager'

export const metadata = { title: 'Certifications | Admin CMS' }

export default async function AdminCertificationsPage() {
  const items = await adminGetCertifications()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Certifications</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage your professional certifications and licenses.</p>
      </div>

      <div className="max-w-5xl">
        <CertificationsManager items={items} />
      </div>
    </div>
  )
}
