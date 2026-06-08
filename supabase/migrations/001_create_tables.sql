-- ============================================================
-- Migration 001: Create all tables
-- Portfolio CMS — Production Schema
-- Run in: Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- TABLE: profiles
-- Single-row table for site owner identity
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name             TEXT NOT NULL DEFAULT '',
  display_name          TEXT,
  email                 TEXT,
  headline              TEXT,                         -- Hero one-liner
  bio_short             TEXT,                         -- ~150 char summary
  bio_long              TEXT,                         -- Full about-me
  avatar_url            TEXT,                         -- Storage URL
  location              TEXT,
  website_url           TEXT,
  github_url            TEXT,
  linkedin_url          TEXT,
  twitter_url           TEXT,
  instagram_url         TEXT,
  resume_url            TEXT,                         -- Points to active resume file
  gpa                   TEXT,                         -- Optional academic display
  metadata              JSONB NOT NULL DEFAULT '{}',  -- AI context, tone prefs, etc.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: currently
-- "What I'm doing right now" — multiple concurrent items
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS currently (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category       TEXT NOT NULL,                      -- 'reading','learning','building','watching','listening','exploring'
  title          TEXT NOT NULL,
  description    TEXT,
  url            TEXT,
  emoji          TEXT,
  display_order  INT NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  started_at     DATE,
  metadata       JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT currently_category_check CHECK (
    category IN ('reading', 'learning', 'building', 'watching', 'listening', 'exploring', 'working_on')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: skills
-- Master skill registry — referenced by projects and activities
-- Created early because projects/activities FK into this
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT UNIQUE NOT NULL,             -- e.g. 'TypeScript'
  slug              TEXT UNIQUE NOT NULL,             -- e.g. 'typescript'
  category          TEXT NOT NULL,                   -- 'language','framework','tool','platform','concept','soft'
  icon_url          TEXT,                            -- SVG from storage
  proficiency       SMALLINT CHECK (proficiency BETWEEN 1 AND 5),
  description       TEXT,
  years_experience  NUMERIC(4,1),
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  is_published      BOOLEAN NOT NULL DEFAULT TRUE,
  display_order     INT NOT NULL DEFAULT 0,
  metadata          JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT skills_category_check CHECK (
    category IN ('language', 'framework', 'tool', 'platform', 'concept', 'soft', 'ai_ml', 'robotics', 'engineering')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: timeline
-- Chronological life milestones (education, work, life events)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type           TEXT NOT NULL,                      -- 'education','work','project','life','award','travel'
  title          TEXT NOT NULL,
  organization   TEXT,
  location       TEXT,
  description    TEXT,
  start_date     DATE NOT NULL,
  end_date       DATE,                               -- NULL = present/ongoing
  is_current     BOOLEAN NOT NULL DEFAULT FALSE,
  logo_url       TEXT,
  tags           TEXT[] NOT NULL DEFAULT '{}',
  display_order  INT NOT NULL DEFAULT 0,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  metadata       JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT timeline_type_check CHECK (
    type IN ('education', 'work', 'project', 'life', 'award', 'travel', 'certification')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: projects
-- Portfolio projects — core showcase content
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT UNIQUE NOT NULL,
  title              TEXT NOT NULL,
  tagline            TEXT,
  description        TEXT,
  cover_image_url    TEXT,
  demo_url           TEXT,
  repo_url           TEXT,
  case_study_url     TEXT,
  tech_stack         TEXT[] NOT NULL DEFAULT '{}',
  tags               TEXT[] NOT NULL DEFAULT '{}',
  status             TEXT NOT NULL DEFAULT 'completed',
  start_date         DATE,
  end_date           DATE,
  is_featured        BOOLEAN NOT NULL DEFAULT FALSE,
  is_published       BOOLEAN NOT NULL DEFAULT FALSE,
  display_order      INT NOT NULL DEFAULT 0,
  -- AI columns — populated when AI features launch (no migration needed later)
  ai_summary         TEXT,
  ai_linkedin_post   TEXT,
  ai_resume_bullets  TEXT[] NOT NULL DEFAULT '{}',
  metadata           JSONB NOT NULL DEFAULT '{}',
  archived_at        TIMESTAMPTZ,                    -- Soft delete
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT projects_status_check CHECK (
    status IN ('in_progress', 'completed', 'archived', 'concept')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: activities
-- Courses, workshops, hackathons, events, reading, research
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT UNIQUE NOT NULL,
  type               TEXT NOT NULL,                  -- 'course','workshop','hackathon','event','reading','research','volunteering','travel','competition','camp','leadership'
  title              TEXT NOT NULL,
  provider           TEXT,                           -- Platform/org
  description        TEXT,
  cover_image_url    TEXT,
  url                TEXT,
  certificate_url    TEXT,
  tags               TEXT[] NOT NULL DEFAULT '{}',
  start_date         DATE,
  end_date           DATE,
  is_completed       BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured        BOOLEAN NOT NULL DEFAULT FALSE,
  is_published       BOOLEAN NOT NULL DEFAULT FALSE,
  -- AI columns
  ai_reflection      TEXT,
  ai_resume_bullets  TEXT[] NOT NULL DEFAULT '{}',
  metadata           JSONB NOT NULL DEFAULT '{}',
  archived_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT activities_type_check CHECK (
    type IN ('course', 'workshop', 'hackathon', 'event', 'reading', 'research',
             'volunteering', 'travel', 'competition', 'camp', 'leadership', 'conference')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: certifications
-- Formal credentials with verification
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id      UUID REFERENCES activities(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  issuer           TEXT NOT NULL,
  issue_date       DATE,
  expiry_date      DATE,                             -- NULL = no expiry
  credential_id    TEXT,
  credential_url   TEXT,
  cover_image_url  TEXT,                            -- Badge image
  description      TEXT,
  skills_covered   TEXT[] NOT NULL DEFAULT '{}',
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  display_order    INT NOT NULL DEFAULT 0,
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: achievements
-- Awards, honors, recognition, competition wins
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  issuer           TEXT NOT NULL,
  description      TEXT,
  cover_image_url  TEXT,
  awarded_date     DATE,
  url              TEXT,
  category         TEXT NOT NULL DEFAULT 'award',
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  display_order    INT NOT NULL DEFAULT 0,
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT achievements_category_check CHECK (
    category IN ('award', 'recognition', 'competition', 'scholarship', 'honor', 'academic')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: blog_posts
-- Long-form writing with Tiptap content (stored as JSON string)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   TEXT UNIQUE NOT NULL,
  title                  TEXT NOT NULL,
  excerpt                TEXT,
  content                TEXT,                        -- Tiptap JSON (stringified) or HTML
  cover_image_url        TEXT,
  tags                   TEXT[] NOT NULL DEFAULT '{}',
  category               TEXT,
  reading_time_minutes   INT,
  status                 TEXT NOT NULL DEFAULT 'draft', -- 'draft','published','archived'
  published_at           TIMESTAMPTZ,                 -- NULL until published; can be future for scheduling
  is_featured            BOOLEAN NOT NULL DEFAULT FALSE,
  view_count             INT NOT NULL DEFAULT 0,
  -- AI columns
  ai_summary             TEXT,
  ai_linkedin_post       TEXT,
  metadata               JSONB NOT NULL DEFAULT '{}',
  archived_at            TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT blog_posts_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: gallery
-- Standalone image/video gallery
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT,
  description    TEXT,
  file_url       TEXT NOT NULL,
  thumbnail_url  TEXT,
  file_type      TEXT NOT NULL DEFAULT 'image',       -- 'image','video'
  alt_text       TEXT,
  tags           TEXT[] NOT NULL DEFAULT '{}',
  category       TEXT,                               -- 'photography','screenshot','event','travel','misc','finland','university'
  taken_at       TIMESTAMPTZ,
  location       TEXT,
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  is_public      BOOLEAN NOT NULL DEFAULT TRUE,       -- Private gallery support
  is_published   BOOLEAN NOT NULL DEFAULT FALSE,
  display_order  INT NOT NULL DEFAULT 0,
  metadata       JSONB NOT NULL DEFAULT '{}',         -- Future: EXIF, AI labels
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT gallery_file_type_check CHECK (file_type IN ('image', 'video'))
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: resume
-- Structured resume sections (separate from downloadable files)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section        TEXT NOT NULL,                      -- 'experience','education','skills','summary','projects','certifications'
  title          TEXT NOT NULL,
  organization   TEXT,
  location       TEXT,
  start_date     DATE,
  end_date       DATE,
  is_current     BOOLEAN NOT NULL DEFAULT FALSE,
  bullets        TEXT[] NOT NULL DEFAULT '{}',        -- Human-written bullets
  ai_bullets     TEXT[] NOT NULL DEFAULT '{}',        -- Future: AI alternatives
  display_order  INT NOT NULL DEFAULT 0,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  metadata       JSONB NOT NULL DEFAULT '{}',         -- Future: ATS scores
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT resume_section_check CHECK (
    section IN ('experience', 'education', 'skills', 'summary', 'projects', 'certifications', 'awards')
  )
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: resume_files
-- Uploaded PDF/DOCX files with version history
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_files (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label            TEXT NOT NULL,                    -- 'Software Engineer Resume - June 2026'
  file_url         TEXT NOT NULL,
  file_name        TEXT NOT NULL,
  file_size_bytes  INT,
  version          INT NOT NULL DEFAULT 1,
  is_active        BOOLEAN NOT NULL DEFAULT FALSE,    -- Only one active at a time
  notes            TEXT,
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- JUNCTION TABLE: project_skills
-- Many-to-many: projects ↔ skills
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_skills (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id    UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- ─────────────────────────────────────────────────────────────
-- JUNCTION TABLE: project_gallery
-- Many-to-many: projects ↔ gallery images
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_gallery (
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  gallery_id     UUID NOT NULL REFERENCES gallery(id) ON DELETE CASCADE,
  display_order  INT NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, gallery_id)
);

-- ─────────────────────────────────────────────────────────────
-- JUNCTION TABLE: activity_skills
-- Many-to-many: activities ↔ skills
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_skills (
  activity_id  UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  skill_id     UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, skill_id)
);

-- ─────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at TRIGGER
-- Applies to every table that has an updated_at column
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all content tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'currently', 'skills', 'timeline',
    'projects', 'activities', 'certifications', 'achievements',
    'blog_posts', 'gallery', 'resume'
  ]
  LOOP
    EXECUTE FORMAT(
      'CREATE TRIGGER set_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION handle_updated_at()',
      t
    );
  END LOOP;
END;
$$;
