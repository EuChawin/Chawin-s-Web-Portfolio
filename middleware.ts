// ============================================================
// middleware.ts — Next.js Middleware
// Protects all /admin/** routes with Supabase session check.
// Uses email/password auth — no OAuth.
// ============================================================
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pass pathname as a header so server layouts can read it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — must happen before any conditional logic
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Protect /admin/** (except the login page itself) ────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      // Not logged in → send to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Optional: restrict to a single admin email
    if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
      // Wrong account — sign out server-side and reject
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }
  }

  // NOTE: We intentionally do NOT auto-redirect logged-in users away from /admin/login.
  // If you are already logged in, just navigate directly to /admin.
  // This prevents redirect loops during development and session edge cases.

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
