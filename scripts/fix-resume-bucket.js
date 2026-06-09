const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Fix the resume-files bucket to be public so that getPublicUrl() works.
 * The bucket was created as private which caused 404 "Bucket not found" errors
 * when trying to load uploaded resumes via the public URL.
 */
async function main() {
  console.log("Fixing resume-files bucket visibility...");

  const { data, error } = await supabase.storage.updateBucket('resume-files', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['application/pdf'],
  });

  if (error) {
    console.error("❌ Failed to update resume-files bucket:", error.message);
    process.exit(1);
  }

  console.log("✅ resume-files bucket is now PUBLIC. Uploaded resumes will be accessible via public URLs.");
}

main();
