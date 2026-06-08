import { NextResponse } from 'next/server';
import { getActiveResumeFile } from '@/lib/supabase/queries';

export async function GET() {
  const activeResume = await getActiveResumeFile();

  if (!activeResume || !activeResume.file_url) {
    return new NextResponse('No active resume found', { status: 404 });
  }

  // Redirect to the stored file URL with a forced download header
  return NextResponse.redirect(activeResume.file_url, {
    headers: {
      'Content-Disposition': `attachment; filename="${activeResume.file_name || 'Chawin_Phaikeaw_Resume.pdf'}"`,
    },
  });
}
