// ============================================================
// lib/supabase/admin.ts
// Admin Supabase client — BYPASSES ALL RLS
//
// ⚠️  SECURITY CRITICAL ⚠️
// This client uses the SERVICE ROLE KEY which has superadmin access.
// It MUST ONLY be used in:
//   - Next.js Route Handlers (/app/api/**)
//   - Server Actions ('use server' files)
//
// NEVER import this file in:
//   - Components with 'use client'
//   - Any file that might be bundled for the browser
//   - lib/supabase/client.ts
// ============================================================
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// This will throw at build time if the env var is missing server-side
// which is exactly what we want — fast failure, not silent security holes
if (typeof window !== 'undefined') {
  throw new Error(
    'lib/supabase/admin.ts was imported in a browser context. ' +
    'This is a critical security violation. Only use this in Server Actions or Route Handlers.'
  )
}

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. ' +
      'Add it to your .env.local file (server-side only).'
    )
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
