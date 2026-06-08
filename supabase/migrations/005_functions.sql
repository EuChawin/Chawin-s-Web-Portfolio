-- ============================================================
-- Migration 005: Database Functions & Triggers
-- Run AFTER 004_rls_policies.sql
--
-- Functions:
--   1. increment_blog_view_count — safe public view counter
--   2. get_active_resume_file    — returns the currently active file
--   3. ensure_single_active_resume — trigger: only one resume active
--   4. create_profile_on_signup  — trigger: auto-create profile row
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- FUNCTION: increment_blog_view_count
--
-- Why a function instead of direct UPDATE?
--   RLS only allows public SELECT on blog_posts (not UPDATE).
--   A SECURITY DEFINER function runs as the function owner (postgres),
--   bypassing RLS for this specific, safe operation.
--   No other table data is exposed.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_blog_view_count(post_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug
    AND status = 'published'
    AND published_at <= NOW();
END;
$$;

-- Grant execute to anonymous users (safe — only increments count on published posts)
GRANT EXECUTE ON FUNCTION increment_blog_view_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_blog_view_count(TEXT) TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- FUNCTION: ensure_single_active_resume
-- Trigger function: when a resume_file is set to active=TRUE,
-- automatically set all other resume_files to active=FALSE.
-- Enforces "only one active resume at a time" invariant.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ensure_single_active_resume()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_active = TRUE THEN
    UPDATE resume_files
    SET is_active = FALSE
    WHERE id != NEW.id
      AND is_active = TRUE;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER single_active_resume
  BEFORE INSERT OR UPDATE OF is_active ON resume_files
  FOR EACH ROW
  WHEN (NEW.is_active = TRUE)
  EXECUTE FUNCTION ensure_single_active_resume();

-- ─────────────────────────────────────────────────────────────
-- FUNCTION: auto-create profile row on first GitHub OAuth login
-- Triggered by Supabase Auth on user creation.
-- Creates an empty profile record linked to the new user_id.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (user_id) DO NOTHING;  -- Safe re-entry
  RETURN NEW;
END;
$$;

-- Attach to auth.users — fires on every new signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- FUNCTION: get_published_blog_posts
-- Convenience RPC for frontend — avoids complex client-side filtering.
-- Returns only truly live posts with pagination support.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_published_blog_posts(
  page_number  INT DEFAULT 1,
  page_size    INT DEFAULT 10,
  tag_filter   TEXT DEFAULT NULL,
  cat_filter   TEXT DEFAULT NULL
)
RETURNS TABLE (
  id                    UUID,
  slug                  TEXT,
  title                 TEXT,
  excerpt               TEXT,
  cover_image_url       TEXT,
  tags                  TEXT[],
  category              TEXT,
  reading_time_minutes  INT,
  published_at          TIMESTAMPTZ,
  is_featured           BOOLEAN,
  view_count            INT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      bp.id,
      bp.slug,
      bp.title,
      bp.excerpt,
      bp.cover_image_url,
      bp.tags,
      bp.category,
      bp.reading_time_minutes,
      bp.published_at,
      bp.is_featured,
      bp.view_count
    FROM blog_posts bp
    WHERE bp.status = 'published'
      AND bp.published_at <= NOW()
      AND bp.archived_at IS NULL
      AND (tag_filter IS NULL OR tag_filter = ANY(bp.tags))
      AND (cat_filter IS NULL OR bp.category = cat_filter)
    ORDER BY bp.is_featured DESC, bp.published_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;

GRANT EXECUTE ON FUNCTION get_published_blog_posts(INT, INT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_published_blog_posts(INT, INT, TEXT, TEXT) TO authenticated;
