import { adminGetResumeFiles } from '@/lib/supabase/admin-queries'
import { ResumeFileManager } from './_components/ResumeFileManager'

export const metadata = { title: 'Resume | Admin CMS' }

export default async function AdminResumePage() {
  const files = await adminGetResumeFiles()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Resume Manager</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage your resume PDF files. Only the active version is shown to the public.</p>
      </div>

      <div className="max-w-3xl">
        <ResumeFileManager files={files} />
      </div>
    </div>
  )
}
