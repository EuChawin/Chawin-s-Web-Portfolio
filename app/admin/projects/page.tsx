import Link from 'next/link'
import { adminGetProjects } from '@/lib/supabase/admin-queries'
import { PlusCircle, Edit, ExternalLink, Archive, CheckCircle2, XCircle } from 'lucide-react'

export const metadata = { title: 'Projects | Admin CMS' }

export default async function AdminProjectsPage() {
  const projects = await adminGetProjects()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-h2 mb-1">Projects</h1>
          <p className="text-body-sm text-[var(--text-secondary)]">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary py-2 text-sm">
          <PlusCircle size={16} />
          New Project
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-surface-2)] text-[var(--text-secondary)] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Visibility</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No projects found. Create your first one!
                  </td>
                </tr>
              )}
              {projects.map((project) => (
                <tr key={project.id} className={`hover:bg-[var(--bg-surface-2)] transition-colors ${project.archived_at ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--text-primary)]">{project.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)] truncate max-w-[250px]">{project.tagline}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${project.status === 'completed' ? 'badge-success' : project.status === 'archived' ? 'badge-default' : 'badge-warning'}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.is_published ? (
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
                    {project.is_featured ? (
                      <span className="badge badge-accent">Featured</span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {project.is_published && (
                        <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors" title="View live">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link href={`/admin/projects/${project.id}`} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors" title="Edit">
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
