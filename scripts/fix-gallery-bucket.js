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
 * Fix the gallery-images bucket to be public so that getPublicUrl() works.
 * The bucket was created as private which caused 404 "Bucket not found" errors
 * when trying to load uploaded images via the public URL.
 */
async function main() {
  console.log("Fixing gallery-images bucket visibility...");

  const { data, error } = await supabase.storage.updateBucket('gallery-images', {
    public: true,
    fileSizeLimit: 20971520, // 20MB
    allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
  });

  if (error) {
    console.error("❌ Failed to update gallery-images bucket:", error.message);
    process.exit(1);
  }

  console.log("✅ gallery-images bucket is now PUBLIC. Uploaded images will be accessible via public URLs.");
  console.log("\nNote: Existing gallery items with saved URLs should now load correctly.");
  console.log("If any existing items still show 404, you may need to re-upload them.\n");
}

main();
