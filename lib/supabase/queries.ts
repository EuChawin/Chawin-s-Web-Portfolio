// lib/supabase/queries.ts
// Reusable typed query helpers for all public pages.
// All these run as the anon user — RLS filters automatically.
// Uses createAnonClient() which has NO cookie dependency, making it safe
// to call from generateStaticParams() and other build-time contexts.

import { createAnonClient } from '@/lib/supabase/anon'
import type {
  Profile, Currently, Skill, TimelineItem, Project,
  Activity, Certification, Achievement, BlogPost,
  GalleryItem, ResumeSection, ResumeFile
} from '@/lib/types/database'


// ─── Profile ─────────────────────────────────────────────────
export async function getProfile(): Promise<Profile | null> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()
  return data
}

// ─── Currently ───────────────────────────────────────────────
export async function getCurrentlyItems(): Promise<Currently[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('currently')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  return data ?? []
}

// ─── Skills ──────────────────────────────────────────────────
export async function getPublishedSkills(): Promise<Skill[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('skills')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
  return data ?? []
}

// ─── Timeline ────────────────────────────────────────────────
export async function getPublishedTimeline(): Promise<TimelineItem[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('timeline')
    .select('*')
    .eq('is_published', true)
    .order('start_date', { ascending: false })
  return data ?? []
}

// ─── Projects ────────────────────────────────────────────────
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .is('archived_at', null)
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .is('archived_at', null)
    .order('display_order', { ascending: true })
    .limit(3)
  return data ?? []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .is('archived_at', null)
    .single()
  return data
}

// ─── Activities ──────────────────────────────────────────────
export async function getPublishedActivities(): Promise<Activity[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('activities')
    .select('*')
    .eq('is_published', true)
    .is('archived_at', null)
    .order('start_date', { ascending: false })
  return data ?? []
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('activities')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

// ─── Certifications ──────────────────────────────────────────
export async function getPublishedCertifications(): Promise<Certification[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_published', true)
    .order('issue_date', { ascending: false })
  return data ?? []
}

// ─── Achievements ────────────────────────────────────────────
export async function getPublishedAchievements(): Promise<Achievement[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_published', true)
    .order('awarded_date', { ascending: false })
  return data ?? []
}

// ─── Blog Posts ──────────────────────────────────────────────
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image_url, tags, category, reading_time_minutes, published_at, is_featured, view_count, status, created_at, updated_at, ai_summary, ai_linkedin_post, metadata, archived_at, content')
    .eq('status', 'published')
    .is('archived_at', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  return data ?? []
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single()
  return data
}

// ─── Gallery ─────────────────────────────────────────────────
export async function getPublicGallery(): Promise<GalleryItem[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_published', true)
    .eq('is_public', true)
    .order('display_order', { ascending: true })
  return data ?? []
}

// ─── Resume ──────────────────────────────────────────────────
export async function getPublishedResumeSections(): Promise<ResumeSection[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('resume')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getActiveResumeFile(): Promise<ResumeFile | null> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('resume_files')
    .select('*')
    .eq('is_active', true)
    .single()
  return data
}
