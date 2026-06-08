import Link from 'next/link'
import { adminGetBlogPosts } from '@/lib/supabase/admin-queries'
import { PlusCircle, Edit, ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react'

export const metadata = { title: 'Blog Posts | Admin CMS' }

export default async function AdminBlogPage() {
  const posts = await adminGetBlogPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-h2 mb-1">Blog Posts</h1>
          <p className="text-body-sm text-[var(--text-secondary)]">Manage your articles and essays</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary py-2 text-sm">
          <PlusCircle size={16} />
          New Post
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-surface-2)] text-[var(--text-secondary)] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Post</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Stats</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                    No blog posts found. Start writing!
                  </td>
                </tr>
              )}
              {posts.map((post) => {
                const isPublishedNow = post.status === 'published' && (!post.published_at || new Date(post.published_at) <= new Date())
                const isScheduled = post.status === 'published' && post.published_at && new Date(post.published_at) > new Date()
                
                return (
                  <tr key={post.id} className={`hover:bg-[var(--bg-surface-2)] transition-colors ${post.status === 'archived' ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        {post.is_featured && <span className="mt-1 w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" title="Featured"></span>}
                        <div>
                           <p className="font-medium text-[var(--text-primary)]">{post.title}</p>
                           <p className="text-xs text-[var(--text-tertiary)] flex gap-2 mt-0.5">
                              {post.category && <span>{post.category}</span>}
                              {post.category && <span>&bull;</span>}
                              <span>{post.reading_time_minutes} min read</span>
                           </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isPublishedNow ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <CheckCircle2 size={14} /> Published
                        </span>
                      ) : isScheduled ? (
                         <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-medium">
                          <Clock size={14} /> Scheduled
                        </span>
                      ) : post.status === 'archived' ? (
                         <span className="badge badge-default">Archived</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium">
                          <XCircle size={14} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-[var(--text-secondary)]">
                         <span className="font-medium text-[var(--text-primary)]">{post.view_count.toLocaleString()}</span> views
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPublishedNow && (
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors" title="View live">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link href={`/admin/blog/${post.id}`} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors" title="Edit">
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
