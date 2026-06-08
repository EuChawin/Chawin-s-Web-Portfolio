import { adminGetTimeline } from '@/lib/supabase/admin-queries'
import { TimelineManager } from './_components/TimelineManager'

export const metadata = { title: 'Timeline | Admin CMS' }

export default async function AdminTimelinePage() {
  const items = await adminGetTimeline()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Timeline</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage your career and education history.</p>
      </div>

      <div className="max-w-4xl">
        <TimelineManager items={items} />
      </div>
    </div>
  )
}
