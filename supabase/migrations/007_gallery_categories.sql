-- =========================================================
-- Migration 007: Gallery Categories (Album System)
-- Run in Supabase SQL Editor
-- =========================================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS gallery_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  cover_image_url TEXT,
  sort_order      INT NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Auto-update trigger for categories
CREATE TRIGGER set_updated_at_gallery_categories
  BEFORE UPDATE ON gallery_categories
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 3. Add category_id FK to gallery table
ALTER TABLE gallery
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES gallery_categories(id) ON DELETE SET NULL;

-- 4. Index for fast filtering
CREATE INDEX IF NOT EXISTS gallery_category_id_idx ON gallery(category_id);

-- 5. RLS: enable for gallery_categories
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

-- 6. Public read policy (published categories only)
CREATE POLICY "gallery_categories_public_read"
  ON gallery_categories FOR SELECT
  USING (is_published = TRUE);

-- 7. Admin full access (matches your existing RLS pattern)
CREATE POLICY "gallery_categories_admin_all"
  ON gallery_categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
