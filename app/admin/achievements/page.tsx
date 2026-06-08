import { adminGetAchievements } from '@/lib/supabase/admin-queries'
import { AchievementsManager } from './_components/AchievementsManager'

export const metadata = { title: 'Achievements | Admin CMS' }

export default async function AdminAchievementsPage() {
  const items = await adminGetAchievements()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Achievements & Awards</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage your notable achievements, hackathon wins, or awards.</p>
      </div>

      <div className="max-w-4xl">
        <AchievementsManager items={items} />
      </div>
    </div>
  )
}
