// ============================================================
// app/auth/callback/route.ts
// This route is no longer used for email/password auth.
// Kept as a stub in case future OAuth or magic-link flows are added.
// ============================================================
import { NextResponse } from 'next/server'

export async function GET() {
  // No OAuth callback needed for email/password auth.
  return NextResponse.redirect('/admin/login')
}
