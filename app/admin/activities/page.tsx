import Link from 'next/link'
import { adminGetActivities } from '@/lib/supabase/admin-queries'
import { PlusCircle, Edit, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'

export const metadata = { title: 'Activities | Admin CMS' }

export default async function AdminActivitiesPage() {
  const activities = await adminGetActivities()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-h2 mb-1">Activities</h1>
          <p className="text-body-sm text-[var(--text-secondary)]">Manage your courses, events, and experiences</p>
        </div>
        <Link href="/admin/activities/new" className="btn-primary py-2 text-sm">
          <PlusCircle size={16} />
          New Activity
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-surface-2)] text-[var(--text-secondary)] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Activity</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Visibility</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {activities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No activities found. Create your first one!
                  </td>
                </tr>
              )}
              {activities.map((activity) => (
                <tr key={activity.id} className={`hover:bg-[var(--bg-surface-2)] transition-colors ${activity.archived_at ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--text-primary)]">{activity.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)] truncate max-w-[250px]">{activity.provider}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge badge-default capitalize">
                      {activity.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {activity.is_published ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        <CheckCircle2 size={14} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium">
                        <XCircle size={14} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {activity.is_featured ? (
                      <span className="badge badge-accent">Featured</span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {activity.is_published && (
                        <a href={`/activities/${activity.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors" title="View live">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link href={`/admin/activities/${activity.id}`} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors" title="Edit">
                        <Edit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
