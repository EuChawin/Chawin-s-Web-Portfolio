// lib/supabase/admin-queries.ts
// Admin-only queries — used in Server Actions and Route Handlers only.
// These use the standard server client (anon key + cookie auth).
// The admin client (service role) is only needed for bypassing RLS — not needed here
// since the authenticated admin already has full access via RLS policies.

import { createClient } from '@/lib/supabase/server'
import type {
  Profile, Currently, Skill, TimelineItem, Project,
  Activity, Certification, Achievement, BlogPost,
  GalleryCategoryDB, ResumeSection, ResumeFile,
  ProfileUpdate, CurrentlyInsert, CurrentlyUpdate,
  SkillInsert, SkillUpdate, TimelineItemInsert, TimelineItemUpdate,
  ProjectInsert, ProjectUpdate, ActivityInsert, ActivityUpdate,
  CertificationInsert, CertificationUpdate, AchievementInsert, AchievementUpdate,
  BlogPostInsert, BlogPostUpdate, GalleryItemInsert, GalleryItemUpdate,
  GalleryCategoryInsert, GalleryCategoryUpdate,
  ResumeSectionInsert, ResumeSectionUpdate, ResumeFileInsert
} from '@/lib/types/database'
import type { GalleryItem } from '@/lib/types'

// ─── Dashboard Stats ──────────────────────────────────────────
export async function getDashboardStats() {
  const supabase = await createClient()
  const [projects, activities, certifications, achievements, blog, gallery, skills] = await Promise.all([
    supabase.from('projects').select('id, is_published, status', { count: 'exact' }),
    supabase.from('activities').select('id, is_published', { count: 'exact' }),
    supabase.from('certifications').select('id, is_published', { count: 'exact' }),
    supabase.from('achievements').select('id, is_published', { count: 'exact' }),
    supabase.from('blog_posts').select('id, status', { count: 'exact' }),
    supabase.from('gallery').select('id, is_published', { count: 'exact' }),
    supabase.from('skills').select('id', { count: 'exact' }),
  ])
  return {
    projects:       { total: projects.count ?? 0,       published: projects.data?.filter(r => r.is_published).length ?? 0 },
    activities:     { total: activities.count ?? 0,     published: activities.data?.filter(r => r.is_published).length ?? 0 },
    certifications: { total: certifications.count ?? 0, published: certifications.data?.filter(r => r.is_published).length ?? 0 },
    achievements:   { total: achievements.count ?? 0,   published: achievements.data?.filter(r => r.is_published).length ?? 0 },
    blog:           { total: blog.count ?? 0,           drafts: blog.data?.filter(r => r.status === 'draft').length ?? 0 },
    gallery:        { total: gallery.count ?? 0,        published: gallery.data?.filter(r => r.is_published).length ?? 0 },
    skills:         { total: skills.count ?? 0 },
  }
}

// ─── Profile ─────────────────────────────────────────────────
export async function adminGetProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').limit(1).single()
  return data
}

export async function adminUpdateProfile(id: string, update: ProfileUpdate) {
  const supabase = await createClient()
  return supabase.from('profiles').update(update).eq('id', id)
}

// ─── Currently ───────────────────────────────────────────────
export async function adminGetCurrently(): Promise<Currently[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('currently').select('*').order('display_order')
  return data ?? []
}

export async function adminCreateCurrently(item: CurrentlyInsert) {
  const supabase = await createClient()
  return supabase.from('currently').insert(item).select().single()
}

export async function adminUpdateCurrently(id: string, update: CurrentlyUpdate) {
  const supabase = await createClient()
  return supabase.from('currently').update(update).eq('id', id)
}

export async function adminDeleteCurrently(id: string) {
  const supabase = await createClient()
  return supabase.from('currently').delete().eq('id', id)
}

// ─── Skills ──────────────────────────────────────────────────
export async function adminGetSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('skills').select('*').order('category').order('display_order')
  return data ?? []
}

export async function adminCreateSkill(skill: SkillInsert) {
  const supabase = await createClient()
  return supabase.from('skills').insert(skill).select().single()
}

export async function adminUpdateSkill(id: string, update: SkillUpdate) {
  const supabase = await createClient()
  return supabase.from('skills').update(update).eq('id', id)
}

export async function adminDeleteSkill(id: string) {
  const supabase = await createClient()
  return supabase.from('skills').delete().eq('id', id)
}

// ─── Timeline ────────────────────────────────────────────────
export async function adminGetTimeline(): Promise<TimelineItem[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('timeline').select('*').order('start_date', { ascending: false })
  return data ?? []
}

export async function adminCreateTimelineItem(item: TimelineItemInsert) {
  const supabase = await createClient()
  return supabase.from('timeline').insert(item).select().single()
}

export async function adminUpdateTimelineItem(id: string, update: TimelineItemUpdate) {
  const supabase = await createClient()
  return supabase.from('timeline').update(update).eq('id', id)
}

export async function adminDeleteTimelineItem(id: string) {
  const supabase = await createClient()
  return supabase.from('timeline').delete().eq('id', id)
}

// ─── Projects ────────────────────────────────────────────────
export async function adminGetProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').order('display_order').order('created_at', { ascending: false })
  return data ?? []
}

export async function adminGetProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).single()
  return data
}

export async function adminCreateProject(project: ProjectInsert) {
  const supabase = await createClient()
  return supabase.from('projects').insert(project).select().single()
}

export async function adminUpdateProject(id: string, update: ProjectUpdate) {
  const supabase = await createClient()
  return supabase.from('projects').update(update).eq('id', id)
}

export async function adminArchiveProject(id: string) {
  const supabase = await createClient()
  return supabase.from('projects').update({ archived_at: new Date().toISOString() }).eq('id', id)
}

// ─── Activities ──────────────────────────────────────────────
export async function adminGetActivities(): Promise<Activity[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('activities').select('*').order('start_date', { ascending: false })
  return data ?? []
}

export async function adminGetActivityById(id: string): Promise<Activity | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('activities').select('*').eq('id', id).single()
  return data
}

export async function adminCreateActivity(activity: ActivityInsert) {
  const supabase = await createClient()
  return supabase.from('activities').insert(activity).select().single()
}

export async function adminUpdateActivity(id: string, update: ActivityUpdate) {
  const supabase = await createClient()
  return supabase.from('activities').update(update).eq('id', id)
}

export async function adminArchiveActivity(id: string) {
  const supabase = await createClient()
  return supabase.from('activities').update({ archived_at: new Date().toISOString() }).eq('id', id)
}

// ─── Certifications ──────────────────────────────────────────
export async function adminGetCertifications(): Promise<Certification[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('certifications').select('*').order('issue_date', { ascending: false })
  return data ?? []
}

export async function adminCreateCertification(cert: CertificationInsert) {
  const supabase = await createClient()
  return supabase.from('certifications').insert(cert).select().single()
}

export async function adminUpdateCertification(id: string, update: CertificationUpdate) {
  const supabase = await createClient()
  return supabase.from('certifications').update(update).eq('id', id)
}

export async function adminDeleteCertification(id: string) {
  const supabase = await createClient()
  return supabase.from('certifications').delete().eq('id', id)
}

// ─── Achievements ────────────────────────────────────────────
export async function adminGetAchievements(): Promise<Achievement[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('achievements').select('*').order('awarded_date', { ascending: false })
  return data ?? []
}

export async function adminCreateAchievement(ach: AchievementInsert) {
  const supabase = await createClient()
  return supabase.from('achievements').insert(ach).select().single()
}

export async function adminUpdateAchievement(id: string, update: AchievementUpdate) {
  const supabase = await createClient()
  return supabase.from('achievements').update(update).eq('id', id)
}

export async function adminDeleteAchievement(id: string) {
  const supabase = await createClient()
  return supabase.from('achievements').delete().eq('id', id)
}

// ─── Blog Posts ──────────────────────────────────────────────
export async function adminGetBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function adminGetBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  return data
}

export async function adminCreateBlogPost(post: BlogPostInsert) {
  const supabase = await createClient()
  return supabase.from('blog_posts').insert(post).select().single()
}

export async function adminUpdateBlogPost(id: string, update: BlogPostUpdate) {
  const supabase = await createClient()
  return supabase.from('blog_posts').update(update).eq('id', id)
}

// ─── Gallery Categories ──────────────────────────────────────
export async function adminGetGalleryCategories(): Promise<GalleryCategoryDB[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('gallery_categories').select('*').order('sort_order', { ascending: true })
  return data ?? []
}

export async function adminCreateGalleryCategory(category: GalleryCategoryInsert) {
  const supabase = await createClient()
  return supabase.from('gallery_categories').insert(category).select().single()
}

export async function adminUpdateGalleryCategory(id: string, update: GalleryCategoryUpdate) {
  const supabase = await createClient()
  return supabase.from('gallery_categories').update(update).eq('id', id)
}

export async function adminDeleteGalleryCategory(id: string) {
  const supabase = await createClient()
  return supabase.from('gallery_categories').delete().eq('id', id)
}

// ─── Gallery Items ───────────────────────────────────────────
export async function adminGetGallery(
  options?: { categoryId?: string }
): Promise<GalleryItem[]> {
  const supabase = await createClient()
  let query = supabase.from('gallery').select('*, category_data:gallery_categories(*)')
  
  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }
  
  const { data } = await query.order('display_order', { ascending: true }).order('created_at', { ascending: false })
  return (data as any) ?? []
}

export async function adminCreateGalleryItem(item: GalleryItemInsert) {
  const supabase = await createClient()
  return supabase.from('gallery').insert(item).select().single()
}

export async function adminUpdateGalleryItem(id: string, update: GalleryItemUpdate) {
  const supabase = await createClient()
  return supabase.from('gallery').update(update).eq('id', id)
}

export async function adminDeleteGalleryItem(id: string) {
  const supabase = await createClient()
  return supabase.from('gallery').delete().eq('id', id)
}

// ─── Resume ──────────────────────────────────────────────────
export async function adminGetResumeSections(): Promise<ResumeSection[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('resume').select('*').order('display_order')
  return data ?? []
}

export async function adminCreateResumeSection(section: ResumeSectionInsert) {
  const supabase = await createClient()
  return supabase.from('resume').insert(section).select().single()
}

export async function adminUpdateResumeSection(id: string, update: ResumeSectionUpdate) {
  const supabase = await createClient()
  return supabase.from('resume').update(update).eq('id', id)
}

export async function adminDeleteResumeSection(id: string) {
  const supabase = await createClient()
  return supabase.from('resume').delete().eq('id', id)
}

export async function adminGetResumeFiles(): Promise<ResumeFile[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('resume_files').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function adminCreateResumeFile(file: ResumeFileInsert) {
  const supabase = await createClient()
  return supabase.from('resume_files').insert(file).select().single()
}

export async function adminSetActiveResumeFile(id: string) {
  const supabase = await createClient()
  return supabase.from('resume_files').update({ is_active: true }).eq('id', id)
}
