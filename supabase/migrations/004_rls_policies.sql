-- ============================================================
-- Migration 004: Row Level Security Policies
-- Run AFTER 003_enable_rls.sql
--
-- Auth model:
--   • Public visitors  → anonymous, read published content only
--   • Admin            → any authenticated user (auth.uid() IS NOT NULL)
--
-- Security layers:
--   1. RLS policies on tables (this file)
--   2. Storage bucket policies (configured in Supabase Dashboard)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- profiles
-- Always readable publicly — it's a public identity page
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view profile"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin: manage profile"
  ON profiles FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- currently
-- Public sees only active items
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view active currently items"
  ON currently FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin: manage currently"
  ON currently FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- skills
-- Published skills are public
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published skills"
  ON skills FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin: manage skills"
  ON skills FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- timeline
-- Published entries are public
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published timeline"
  ON timeline FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin: manage timeline"
  ON timeline FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- projects
-- Published AND non-archived projects are public
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published non-archived projects"
  ON projects FOR SELECT
  USING (is_published = TRUE AND archived_at IS NULL);

CREATE POLICY "Admin: manage all projects"
  ON projects FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- activities
-- Published AND non-archived activities are public
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published non-archived activities"
  ON activities FOR SELECT
  USING (is_published = TRUE AND archived_at IS NULL);

CREATE POLICY "Admin: manage all activities"
  ON activities FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- certifications
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published certifications"
  ON certifications FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin: manage certifications"
  ON certifications FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- achievements
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published achievements"
  ON achievements FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin: manage achievements"
  ON achievements FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- blog_posts
-- KEY: ONLY 'published' status + published_at in the past or present
-- Drafts and future-scheduled posts are completely invisible to visitors
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published live blog posts"
  ON blog_posts FOR SELECT
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= NOW()
    AND archived_at IS NULL
  );

-- Admin sees ALL posts — drafts, scheduled, archived
CREATE POLICY "Admin: manage all blog posts"
  ON blog_posts FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- gallery
-- Public sees: published + is_public=true items only
-- Private items (is_public=false) are admin-only (personal archive)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view public published gallery items"
  ON gallery FOR SELECT
  USING (is_published = TRUE AND is_public = TRUE);

CREATE POLICY "Admin: manage all gallery items including private"
  ON gallery FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- resume
-- Published structured sections are public
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view published resume sections"
  ON resume FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admin: manage resume sections"
  ON resume FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- resume_files
-- Only the currently active file is publicly readable
-- (for the download button on the public resume page)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Public: view active resume file"
  ON resume_files FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin: manage all resume files"
  ON resume_files FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────────────────────
-- Junction tables
-- Public can read junction data only for published parent records
-- Admin has full control
-- ─────────────────────────────────────────────────────────────

-- project_skills: visible when the project is published
CREATE POLICY "Public: view project skills for published projects"
  ON project_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_skills.project_id
        AND p.is_published = TRUE
        AND p.archived_at IS NULL
    )
  );

CREATE POLICY "Admin: manage project skills"
  ON project_skills FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- project_gallery: visible when both project and gallery item are published
CREATE POLICY "Public: view project gallery for published content"
  ON project_gallery FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_gallery.project_id
        AND p.is_published = TRUE
        AND p.archived_at IS NULL
    )
    AND EXISTS (
      SELECT 1 FROM gallery g
      WHERE g.id = project_gallery.gallery_id
        AND g.is_published = TRUE
        AND g.is_public = TRUE
    )
  );

CREATE POLICY "Admin: manage project gallery"
  ON project_gallery FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- activity_skills: visible when the activity is published
CREATE POLICY "Public: view activity skills for published activities"
  ON activity_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities a
      WHERE a.id = activity_skills.activity_id
        AND a.is_published = TRUE
        AND a.archived_at IS NULL
    )
  );

CREATE POLICY "Admin: manage activity skills"
  ON activity_skills FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
