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

const buckets = [
  { id: 'profile-images', public: true },
  { id: 'project-images', public: true },
  { id: 'activity-images', public: true },
  { id: 'certification-images', public: true },
  { id: 'achievement-images', public: true },
  { id: 'blog-images', public: true },
  { id: 'skill-icons', public: true },
  { id: 'organization-logos', public: true },
  { id: 'gallery-images', public: false }, // Mixed access, subfolders handle auth
  { id: 'resume-files', public: false }
];

async function main() {
  console.log("Checking and creating Supabase Storage buckets...");
  
  for (const b of buckets) {
    const { data, error } = await supabase.storage.createBucket(b.id, {
      public: b.public,
    });
    
    if (error) {
      if (error.message.toLowerCase().includes('already exists') || error.message.toLowerCase().includes('duplicate')) {
        console.log(`✅ Bucket '${b.id}' already exists.`);
      } else {
        console.error(`❌ Failed to create bucket '${b.id}':`, error.message);
      }
    } else {
      console.log(`🎉 Created bucket '${b.id}' successfully.`);
    }
  }
  
  console.log("\nDone! All required buckets are available.");
  
  // Note: For RLS policies, it is still recommended to run the 006_storage.sql migration in the SQL Editor.
}

main();
