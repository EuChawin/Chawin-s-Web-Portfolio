// ============================================================
// lib/types/database.ts
// Auto-generated-style TypeScript types for the Supabase schema
//
// NOTE: After running migrations, regenerate this with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.ts
//
// These types are hand-written to match the schema exactly.
// They will be replaced by the generated version after connection.
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          display_name: string | null
          email: string | null
          headline: string | null
          bio_short: string | null
          bio_long: string | null
          avatar_url: string | null
          location: string | null
          website_url: string | null
          github_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          instagram_url: string | null
          resume_url: string | null
          gpa: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      currently: {
        Row: {
          id: string
          category: 'reading' | 'learning' | 'building' | 'watching' | 'listening' | 'exploring' | 'working_on'
          title: string
          description: string | null
          url: string | null
          emoji: string | null
          display_order: number
          is_active: boolean
          started_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['currently']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['currently']['Insert']>
      }
      skills: {
        Row: {
          id: string
          name: string
          slug: string
          category: 'language' | 'framework' | 'tool' | 'platform' | 'concept' | 'soft' | 'ai_ml' | 'robotics' | 'engineering'
          icon_url: string | null
          proficiency: number | null
          description: string | null
          years_experience: number | null
          is_featured: boolean
          is_published: boolean
          display_order: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['skills']['Insert']>
      }
      timeline: {
        Row: {
          id: string
          type: 'education' | 'work' | 'project' | 'life' | 'award' | 'travel' | 'certification'
          title: string
          organization: string | null
          location: string | null
          description: string | null
          start_date: string
          end_date: string | null
          is_current: boolean
          logo_url: string | null
          tags: string[]
          display_order: number
          is_published: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['timeline']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['timeline']['Insert']>
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          tagline: string | null
          description: string | null
          cover_image_url: string | null
          demo_url: string | null
          repo_url: string | null
          case_study_url: string | null
          tech_stack: string[]
          tags: string[]
          status: 'in_progress' | 'completed' | 'archived' | 'concept'
          start_date: string | null
          end_date: string | null
          is_featured: boolean
          is_published: boolean
          display_order: number
          ai_summary: string | null
          ai_linkedin_post: string | null
          ai_resume_bullets: string[]
          metadata: Json
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      activities: {
        Row: {
          id: string
          slug: string
          type: 'course' | 'workshop' | 'hackathon' | 'event' | 'reading' | 'research' | 'volunteering' | 'travel' | 'competition' | 'camp' | 'leadership' | 'conference'
          title: string
          provider: string | null
          description: string | null
          cover_image_url: string | null
          url: string | null
          certificate_url: string | null
          tags: string[]
          start_date: string | null
          end_date: string | null
          is_completed: boolean
          is_featured: boolean
          is_published: boolean
          ai_reflection: string | null
          ai_resume_bullets: string[]
          metadata: Json
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['activities']['Insert']>
      }
      certifications: {
        Row: {
          id: string
          activity_id: string | null
          name: string
          issuer: string
          issue_date: string | null
          expiry_date: string | null
          credential_id: string | null
          credential_url: string | null
          cover_image_url: string | null
          description: string | null
          skills_covered: string[]
          is_featured: boolean
          is_published: boolean
          display_order: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['certifications']['Insert']>
      }
      achievements: {
        Row: {
          id: string
          title: string
          issuer: string
          description: string | null
          cover_image_url: string | null
          awarded_date: string | null
          url: string | null
          category: 'award' | 'recognition' | 'competition' | 'scholarship' | 'honor' | 'academic'
          is_featured: boolean
          is_published: boolean
          display_order: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string | null
          cover_image_url: string | null
          tags: string[]
          category: string | null
          reading_time_minutes: number | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          is_featured: boolean
          view_count: number
          ai_summary: string | null
          ai_linkedin_post: string | null
          metadata: Json
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      gallery_categories: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          cover_image_url: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['gallery_categories']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['gallery_categories']['Insert']>
      }
      gallery: {
        Row: {
          id: string
          title: string | null
          description: string | null
          file_url: string
          thumbnail_url: string | null
          file_type: 'image' | 'video'
          alt_text: string | null
          tags: string[]
          category: string | null
          category_id: string | null
          taken_at: string | null
          location: string | null
          is_featured: boolean
          is_public: boolean
          is_published: boolean
          display_order: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>
      }
      resume: {
        Row: {
          id: string
          section: 'experience' | 'education' | 'skills' | 'summary' | 'projects' | 'certifications' | 'awards'
          title: string
          organization: string | null
          location: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          bullets: string[]
          ai_bullets: string[]
          display_order: number
          is_published: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['resume']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['resume']['Insert']>
      }
      resume_files: {
        Row: {
          id: string
          label: string
          file_url: string
          file_name: string
          file_size_bytes: number | null
          version: number
          is_active: boolean
          notes: string | null
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['resume_files']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['resume_files']['Insert']>
      }
      project_skills: {
        Row: { project_id: string; skill_id: string }
        Insert: { project_id: string; skill_id: string }
        Update: Partial<{ project_id: string; skill_id: string }>
      }
      project_gallery: {
        Row: { project_id: string; gallery_id: string; display_order: number }
        Insert: { project_id: string; gallery_id: string; display_order?: number }
        Update: Partial<{ display_order: number }>
      }
      activity_skills: {
        Row: { activity_id: string; skill_id: string }
        Insert: { activity_id: string; skill_id: string }
        Update: Partial<{ activity_id: string; skill_id: string }>
      }
    }
    Functions: {
      increment_blog_view_count: {
        Args: { post_slug: string }
        Returns: void
      }
      get_published_blog_posts: {
        Args: {
          page_number?: number
          page_size?: number
          tag_filter?: string | null
          cat_filter?: string | null
        }
        Returns: Array<{
          id: string
          slug: string
          title: string
          excerpt: string | null
          cover_image_url: string | null
          tags: string[]
          category: string | null
          reading_time_minutes: number | null
          published_at: string | null
          is_featured: boolean
          view_count: number
        }>
      }
    }
    Enums: {}
  }
}

// ─── Convenience types ────────────────────────────────────────────
// Use these throughout your app instead of Database['public']['Tables']['X']['Row']

export type Profile       = Database['public']['Tables']['profiles']['Row']
export type Currently     = Database['public']['Tables']['currently']['Row']
export type Skill         = Database['public']['Tables']['skills']['Row']
export type TimelineItem  = Database['public']['Tables']['timeline']['Row']
export type Project       = Database['public']['Tables']['projects']['Row']
export type Activity      = Database['public']['Tables']['activities']['Row']
export type Certification = Database['public']['Tables']['certifications']['Row']
export type Achievement   = Database['public']['Tables']['achievements']['Row']
export type BlogPost      = Database['public']['Tables']['blog_posts']['Row']
export type GalleryItem   = Database['public']['Tables']['gallery']['Row']
export type GalleryCategoryDB = Database['public']['Tables']['gallery_categories']['Row']
export type ResumeSection = Database['public']['Tables']['resume']['Row']
export type ResumeFile    = Database['public']['Tables']['resume_files']['Row']

// Insert types
export type ProfileInsert       = Database['public']['Tables']['profiles']['Insert']
export type CurrentlyInsert     = Database['public']['Tables']['currently']['Insert']
export type SkillInsert         = Database['public']['Tables']['skills']['Insert']
export type TimelineItemInsert  = Database['public']['Tables']['timeline']['Insert']
export type ProjectInsert       = Database['public']['Tables']['projects']['Insert']
export type ActivityInsert      = Database['public']['Tables']['activities']['Insert']
export type CertificationInsert = Database['public']['Tables']['certifications']['Insert']
export type AchievementInsert   = Database['public']['Tables']['achievements']['Insert']
export type BlogPostInsert      = Database['public']['Tables']['blog_posts']['Insert']
export type GalleryItemInsert   = Database['public']['Tables']['gallery']['Insert']
export type GalleryCategoryInsert = Database['public']['Tables']['gallery_categories']['Insert']
export type ResumeSectionInsert = Database['public']['Tables']['resume']['Insert']
export type ResumeFileInsert    = Database['public']['Tables']['resume_files']['Insert']

// Update types
export type ProfileUpdate       = Database['public']['Tables']['profiles']['Update']
export type CurrentlyUpdate     = Database['public']['Tables']['currently']['Update']
export type SkillUpdate         = Database['public']['Tables']['skills']['Update']
export type TimelineItemUpdate  = Database['public']['Tables']['timeline']['Update']
export type ProjectUpdate       = Database['public']['Tables']['projects']['Update']
export type ActivityUpdate      = Database['public']['Tables']['activities']['Update']
export type CertificationUpdate = Database['public']['Tables']['certifications']['Update']
export type AchievementUpdate   = Database['public']['Tables']['achievements']['Update']
export type BlogPostUpdate      = Database['public']['Tables']['blog_posts']['Update']
export type GalleryItemUpdate   = Database['public']['Tables']['gallery']['Update']
export type GalleryCategoryUpdate = Database['public']['Tables']['gallery_categories']['Update']
export type ResumeSectionUpdate = Database['public']['Tables']['resume']['Update']
export type ResumeFileUpdate    = Database['public']['Tables']['resume_files']['Update']
