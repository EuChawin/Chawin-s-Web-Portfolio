-- ============================================================
-- Migration 006: Storage Bucket Setup
-- Run AFTER 005_functions.sql
--
-- NOTE: Bucket creation via SQL requires the storage schema.
-- If this fails, create buckets manually in the Supabase Dashboard
-- under Storage → New Bucket, then apply just the policies below.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Create Storage Buckets
-- ─────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  -- Public buckets (images served directly)
  ('profile-images',        'profile-images',        TRUE,  5242880,   ARRAY['image/webp','image/jpeg','image/png','image/gif']),
  ('project-images',        'project-images',        TRUE,  10485760,  ARRAY['image/webp','image/jpeg','image/png']),
  ('activity-images',       'activity-images',        TRUE,  10485760,  ARRAY['image/webp','image/jpeg','image/png']),
  ('certification-images',  'certification-images',  TRUE,  5242880,   ARRAY['image/webp','image/jpeg','image/png']),
  ('achievement-images',    'achievement-images',    TRUE,  5242880,   ARRAY['image/webp','image/jpeg','image/png']),
  ('blog-images',           'blog-images',           TRUE,  10485760,  ARRAY['image/webp','image/jpeg','image/png','image/gif']),
  ('skill-icons',           'skill-icons',           TRUE,  1048576,   ARRAY['image/svg+xml','image/webp','image/png']),
  ('organization-logos',    'organization-logos',    TRUE,  2097152,   ARRAY['image/webp','image/jpeg','image/png','image/svg+xml']),
  -- Mixed access: gallery has public + private subfolders
  ('gallery-images',        'gallery-images',        FALSE, 20971520,  ARRAY['image/webp','image/jpeg','image/png','image/gif','video/mp4','video/webm']),
  -- Private bucket: resume PDFs
  ('resume-files',          'resume-files',          FALSE, 10485760,  ARRAY['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- File size limits (bytes):
--   profile-images:       5 MB
--   project-images:      10 MB
--   activity-images:     10 MB
--   certification-images: 5 MB
--   achievement-images:   5 MB
--   blog-images:         10 MB
--   skill-icons:          1 MB
--   organization-logos:   2 MB
--   gallery-images:      20 MB (supports video)
--   resume-files:        10 MB

-- ─────────────────────────────────────────────────────────────
-- Storage RLS Policies
-- ─────────────────────────────────────────────────────────────

-- ── PUBLIC BUCKETS: anyone can read ──────────────────────────
-- (profile-images, project-images, activity-images,
--  certification-images, achievement-images, blog-images,
--  skill-icons, organization-logos)

CREATE POLICY "Public read: profile-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Public read: project-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Public read: activity-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'activity-images');

CREATE POLICY "Public read: certification-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certification-images');

CREATE POLICY "Public read: achievement-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'achievement-images');

CREATE POLICY "Public read: blog-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Public read: skill-icons"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'skill-icons');

CREATE POLICY "Public read: organization-logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'organization-logos');

-- ── Admin upload/delete for all public buckets ────────────────
CREATE POLICY "Admin write: public buckets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND bucket_id IN (
      'profile-images', 'project-images', 'activity-images',
      'certification-images', 'achievement-images', 'blog-images',
      'skill-icons', 'organization-logos'
    )
  );

CREATE POLICY "Admin update: public buckets"
  ON storage.objects FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND bucket_id IN (
      'profile-images', 'project-images', 'activity-images',
      'certification-images', 'achievement-images', 'blog-images',
      'skill-icons', 'organization-logos'
    )
  );

CREATE POLICY "Admin delete: public buckets"
  ON storage.objects FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND bucket_id IN (
      'profile-images', 'project-images', 'activity-images',
      'certification-images', 'achievement-images', 'blog-images',
      'skill-icons', 'organization-logos'
    )
  );

-- ── GALLERY: Public reads from /public/ subfolder only ────────
-- Private gallery items stored in /private/ subfolder require auth
CREATE POLICY "Public read: gallery public folder"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'gallery-images'
    AND (storage.foldername(name))[1] = 'public'
  );

CREATE POLICY "Admin read: gallery all folders"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'gallery-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin write: gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin update: gallery"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin delete: gallery"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

-- ── RESUME FILES: Fully private — admin only ──────────────────
-- Public download handled via signed URLs generated server-side
CREATE POLICY "Admin only: resume-files read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resume-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin only: resume-files write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resume-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin only: resume-files update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'resume-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin only: resume-files delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resume-files' AND auth.uid() IS NOT NULL);
