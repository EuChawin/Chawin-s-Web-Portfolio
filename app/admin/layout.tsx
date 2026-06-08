import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { 
  LayoutDashboard, FolderKanban, Activity, Award, Trophy, 
  Settings, PenTool, LayoutTemplate, GraduationCap, Clock, 
  Image as ImageIcon, FileText, LogOut, ExternalLink, User 
} from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard | Chawin Phaikeaw',
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/currently', label: 'Currently', icon: Activity },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/activities', label: 'Activities', icon: LayoutTemplate },
  { href: '/admin/blog', label: 'Blog', icon: PenTool },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/skills', label: 'Skills', icon: Settings },
  { href: '/admin/timeline', label: 'Timeline', icon: Clock },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/resume', label: 'Resume', icon: FileText },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read the pathname set by middleware — skip auth for the login page
  // (the layout wraps ALL /admin/* routes including /admin/login)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  if (pathname === '/admin/login') {
    // Render the login page without the sidebar/auth check
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--bg-surface)] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/admin" className="font-serif text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Portfolio CMS
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-[var(--border)]">
           <form action="/auth/signout" method="post">
             <button type="submit" className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors">
               <LogOut size={16} />
               Sign out
             </button>
           </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--bg)] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-[var(--text-secondary)] md:hidden">Menu</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm text-[var(--text-secondary)] hidden sm:block">
               {user.email}
             </div>
             <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[var(--accent)] hover:opacity-80 transition-opacity bg-[var(--accent-muted)] px-3 py-1.5 rounded-md">
               View Live Site <ExternalLink size={14} />
             </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  )
}
