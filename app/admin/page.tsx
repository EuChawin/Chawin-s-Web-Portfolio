import { getDashboardStats } from '@/lib/supabase/admin-queries'
import Link from 'next/link'
import { 
  FolderKanban, Activity, Award, Trophy, PenTool, ImageIcon, FileText, LayoutTemplate,
  ArrowRight, PlusCircle, CheckCircle2, Clock, UserCircle, BarChart2
} from 'lucide-react'

export const metadata = { title: 'Dashboard | Admin CMS' }

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: 'Projects', total: stats.projects.total, meta: `${stats.projects.published} published`, icon: FolderKanban, href: '/admin/projects', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Activities', total: stats.activities.total, meta: `${stats.activities.published} published`, icon: LayoutTemplate, href: '/admin/activities', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Blog Posts', total: stats.blog.total, meta: `${stats.blog.drafts} drafts`, icon: PenTool, href: '/admin/blog', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Gallery', total: stats.gallery.total, meta: `${stats.gallery.published} published`, icon: ImageIcon, href: '/admin/gallery', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Certifications', total: stats.certifications.total, meta: `${stats.certifications.published} published`, icon: Award, href: '/admin/certifications', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Achievements', total: stats.achievements.total, meta: `${stats.achievements.published} published`, icon: Trophy, href: '/admin/achievements', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ]

  const quickActions = [
    { label: 'Edit Profile & Metrics', href: '/admin/profile', icon: UserCircle },
    { label: 'New Project', href: '/admin/projects/new', icon: PlusCircle },
    { label: 'New Blog Post', href: '/admin/blog/new', icon: PenTool },
    { label: 'Update Currently', href: '/admin/currently', icon: Activity },
    { label: 'Upload to Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Update Resume', href: '/admin/resume', icon: FileText },
  ]

  return (
    <div>
      <h1 className="font-serif text-h2 mb-2">Dashboard</h1>
      <p className="text-body text-[var(--text-secondary)] mb-8">
        Welcome back. Here's an overview of your portfolio content.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link 
              key={stat.label} 
              href={stat.href}
              className="card p-5 group flex items-start justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-semibold tracking-tight">{stat.total}</span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stat.meta.includes('draft') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  {stat.meta}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
           <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Quick Actions</h2>
           <div className="card divide-y divide-[var(--border)] overflow-hidden">
             {quickActions.map((action) => {
               const Icon = action.icon
               return (
                 <Link 
                   key={action.label} 
                   href={action.href}
                   className="flex items-center justify-between p-4 hover:bg-[var(--bg-surface-2)] transition-colors group"
                 >
                   <div className="flex items-center gap-3 text-sm font-medium">
                     <Icon size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                     {action.label}
                   </div>
                   <ArrowRight size={14} className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                 </Link>
               )
             })}
           </div>
        </div>

        {/* System Status / AI readiness (Placeholder for future features) */}
        <div className="lg:col-span-2">
           <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">System Status</h2>
           <div className="card p-6">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">All Systems Operational</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Database, Auth, and Storage are connected and functioning normally.
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock size={14} className="text-[var(--text-tertiary)]" />
                  AI Readiness Checklist
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Structured schema deployed
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    AI metadata columns initialized
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--border)]"></div>
                    Content population (Pending)
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--border)]"></div>
                    OpenAI API Integration (Pending)
                  </li>
                </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
