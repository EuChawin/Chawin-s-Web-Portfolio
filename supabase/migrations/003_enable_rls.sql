-- ============================================================
-- Migration 003: Enable Row Level Security on all tables
-- Run AFTER 002_create_indexes.sql
-- ============================================================

-- Enable RLS — this alone blocks ALL access until policies are added
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE currently         ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery           ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume            ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_files      ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills    ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_skills   ENABLE ROW LEVEL SECURITY;
