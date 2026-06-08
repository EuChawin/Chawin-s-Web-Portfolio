-- ============================================================
-- Migration 002: Create all indexes
-- Run AFTER 001_create_tables.sql
-- ============================================================

-- ─── profiles ────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id
  ON profiles(user_id);

-- ─── currently ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_currently_is_active
  ON currently(is_active);

CREATE INDEX IF NOT EXISTS idx_currently_display_order
  ON currently(display_order);

-- ─── skills ──────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_skills_slug
  ON skills(slug);

CREATE INDEX IF NOT EXISTS idx_skills_category
  ON skills(category);

CREATE INDEX IF NOT EXISTS idx_skills_is_published
  ON skills(is_published);

CREATE INDEX IF NOT EXISTS idx_skills_is_featured
  ON skills(is_featured);

CREATE INDEX IF NOT EXISTS idx_skills_display_order
  ON skills(display_order);

-- ─── timeline ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_timeline_start_date
  ON timeline(start_date DESC);

CREATE INDEX IF NOT EXISTS idx_timeline_type
  ON timeline(type);

CREATE INDEX IF NOT EXISTS idx_timeline_is_published
  ON timeline(is_published);

-- GIN index for tag-based filtering and future search
CREATE INDEX IF NOT EXISTS idx_timeline_tags
  ON timeline USING GIN(tags);

-- ─── projects ────────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug
  ON projects(slug);

CREATE INDEX IF NOT EXISTS idx_projects_is_published
  ON projects(is_published);

CREATE INDEX IF NOT EXISTS idx_projects_is_featured
  ON projects(is_featured);

CREATE INDEX IF NOT EXISTS idx_projects_status
  ON projects(status);

CREATE INDEX IF NOT EXISTS idx_projects_archived_at
  ON projects(archived_at)
  WHERE archived_at IS NULL;          -- Partial index — only non-archived rows

CREATE INDEX IF NOT EXISTS idx_projects_display_order
  ON projects(display_order);

-- GIN indexes for array searches
CREATE INDEX IF NOT EXISTS idx_projects_tech_stack
  ON projects USING GIN(tech_stack);

CREATE INDEX IF NOT EXISTS idx_projects_tags
  ON projects USING GIN(tags);

-- ─── activities ──────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_activities_slug
  ON activities(slug);

CREATE INDEX IF NOT EXISTS idx_activities_type
  ON activities(type);

CREATE INDEX IF NOT EXISTS idx_activities_is_published
  ON activities(is_published);

CREATE INDEX IF NOT EXISTS idx_activities_is_completed
  ON activities(is_completed);

CREATE INDEX IF NOT EXISTS idx_activities_is_featured
  ON activities(is_featured);

CREATE INDEX IF NOT EXISTS idx_activities_tags
  ON activities USING GIN(tags);

-- ─── certifications ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_certifications_is_published
  ON certifications(is_published);

CREATE INDEX IF NOT EXISTS idx_certifications_is_featured
  ON certifications(is_featured);

CREATE INDEX IF NOT EXISTS idx_certifications_issuer
  ON certifications(issuer);

CREATE INDEX IF NOT EXISTS idx_certifications_issue_date
  ON certifications(issue_date DESC);

CREATE INDEX IF NOT EXISTS idx_certifications_activity_id
  ON certifications(activity_id);

-- ─── achievements ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_achievements_is_published
  ON achievements(is_published);

CREATE INDEX IF NOT EXISTS idx_achievements_is_featured
  ON achievements(is_featured);

CREATE INDEX IF NOT EXISTS idx_achievements_awarded_date
  ON achievements(awarded_date DESC);

CREATE INDEX IF NOT EXISTS idx_achievements_category
  ON achievements(category);

-- ─── blog_posts ──────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug
  ON blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status
  ON blog_posts(status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON blog_posts(published_at DESC)
  WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured
  ON blog_posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_blog_posts_archived_at
  ON blog_posts(archived_at)
  WHERE archived_at IS NULL;

-- GIN for tag filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags
  ON blog_posts USING GIN(tags);

-- ─── gallery ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_gallery_is_published
  ON gallery(is_published);

CREATE INDEX IF NOT EXISTS idx_gallery_is_public
  ON gallery(is_public);

CREATE INDEX IF NOT EXISTS idx_gallery_is_featured
  ON gallery(is_featured);

CREATE INDEX IF NOT EXISTS idx_gallery_category
  ON gallery(category);

CREATE INDEX IF NOT EXISTS idx_gallery_taken_at
  ON gallery(taken_at DESC)
  WHERE taken_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_gallery_display_order
  ON gallery(display_order);

CREATE INDEX IF NOT EXISTS idx_gallery_tags
  ON gallery USING GIN(tags);

-- ─── resume ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resume_section
  ON resume(section);

CREATE INDEX IF NOT EXISTS idx_resume_display_order
  ON resume(display_order);

CREATE INDEX IF NOT EXISTS idx_resume_is_published
  ON resume(is_published);

-- ─── resume_files ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resume_files_is_active
  ON resume_files(is_active);

CREATE INDEX IF NOT EXISTS idx_resume_files_created_at
  ON resume_files(created_at DESC);

-- ─── junction tables ─────────────────────────────────────────
-- Additional lookup indexes for reverse queries
CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id
  ON project_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_activity_skills_skill_id
  ON activity_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_project_gallery_gallery_id
  ON project_gallery(gallery_id);
