// lib/supabase/anon.ts
// ─────────────────────────────────────────────────────────────────────────────
// A cookie-FREE Supabase client for public, read-only queries.
//
// Use this in:
//   • lib/supabase/queries.ts  (all public data fetching)
//   • generateStaticParams()  (runs at build time, no request scope)
//   • ISR / SSG server components that don't need auth
//
// Do NOT use this for admin pages or server actions — those must use
// lib/supabase/server.ts which reads/writes the session cookie.
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

export function createAnonClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // No-op cookie handlers — this client never touches next/headers.
        // Safe to call outside a request scope (build time, generateStaticParams).
        getAll() { return [] },
        setAll() {},
      },
    }
  )
}
