import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getActiveResumeFile } from '@/lib/supabase/queries';

export async function GET() {
  const activeResume = await getActiveResumeFile();

  if (!activeResume || !activeResume.storage_path) {
    return new NextResponse('No active resume found', { status: 404 });
  }

  const supabase = createAdminClient();

  // Create a signed URL that expires in 60 seconds to open in browser
  const { data, error } = await supabase.storage
    .from('resume-files')
    .createSignedUrl(activeResume.storage_path, 60);

  if (error || !data) {
    return new NextResponse('Failed to generate viewing URL', { status: 500 });
  }

  // Redirect to the signed URL
  return NextResponse.redirect(data.signedUrl);
}
