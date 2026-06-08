import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Basic health check and connection test for Supabase
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Attempt a simple query to verify connection
    // We use a simple select with limit 0 to avoid fetching data
    const { error } = await supabase.from('profiles').select('id').limit(0)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json(
        { status: 'error', message: 'Failed to connect to Supabase', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Successfully connected to Supabase',
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    console.error('Unexpected error checking Supabase connection:', err)
    return NextResponse.json(
      { status: 'error', message: 'Unexpected error', details: err?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
