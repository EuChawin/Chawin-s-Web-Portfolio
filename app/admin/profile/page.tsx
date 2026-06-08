import { adminGetProfile } from '@/lib/supabase/admin-queries'
import { ProfileForm } from './_components/ProfileForm'

export const metadata = { title: 'Profile | Admin CMS' }

export default async function AdminProfilePage() {
  const profile = await adminGetProfile()

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Profile not initialized</h2>
        <p className="text-[var(--text-secondary)]">Please sign in to the live app once to trigger profile creation.</p>
      </div>
    )
  }

  return <ProfileForm profile={profile} />
}
