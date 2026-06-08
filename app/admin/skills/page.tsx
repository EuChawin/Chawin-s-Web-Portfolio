import { adminGetSkills } from '@/lib/supabase/admin-queries'
import { SkillsManager } from './_components/SkillsManager'

export const metadata = { title: 'Skills | Admin CMS' }

export default async function AdminSkillsPage() {
  const skills = await adminGetSkills()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-h2 mb-1">Skills</h1>
        <p className="text-body-sm text-[var(--text-secondary)]">Manage your technical and soft skills, grouped by category.</p>
      </div>

      <div className="max-w-4xl">
        <SkillsManager initialSkills={skills} />
      </div>
    </div>
  )
}
