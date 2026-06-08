import { adminGetCurrently } from '@/lib/supabase/admin-queries'
import { CurrentlyManager } from './_components/CurrentlyManager'

export const metadata = { title: 'Currently | Admin CMS' }

export default async function AdminCurrentlyPage() {
  const items = await adminGetCurrently()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Currently</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage the &quot;What I&apos;m doing right now&quot; list on the homepage.</p>
      </div>

      <div className="max-w-2xl">
        <CurrentlyManager items={items} />
      </div>
    </div>
  )
}
