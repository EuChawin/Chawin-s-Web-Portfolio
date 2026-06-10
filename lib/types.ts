// ─── Profile & Currently ───────────────────────────────────────────
export interface Profile {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  instagram_url: string;
  profile_image_url: string | null;
  gpa: string | null;
  ielts_score: string | null;
  intl_experiences: number;
  certifications_count: number;
  projects_count: number;
  leadership_count: number;
}

export interface Currently {
  id: string;
  location: string;
  studies: string;
  interests: string;
  current_project: string;
  learning_focus: string;
  updated_at: string;
}

// ─── Timeline ──────────────────────────────────────────────────────
export type TimelineType = "academic" | "project" | "international" | "certification" | "goal";

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TimelineType;
  order: number;
}

// ─── Projects ──────────────────────────────────────────────────────
export type ProjectStatus = "completed" | "in-progress" | "archived";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string | null;
  gallery: string[];
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  date: string;
  status: ProjectStatus;
  featured: boolean;
  lessons: string | null;
  tags: string[];
  published: boolean;
}

// ─── Activities ────────────────────────────────────────────────────
export type ActivityCategory =
  | "leadership"
  | "camp"
  | "competition"
  | "workshop"
  | "event"
  | "volunteering";

export interface Activity {
  id: string;
  slug: string;
  title: string;
  category: ActivityCategory;
  description: string;
  image: string | null;
  date: string;
  published: boolean;
}

// ─── Certifications ────────────────────────────────────────────────
export interface Certification {
  id: string;
  title: string;
  organization: string;
  image: string | null;
  date: string;
  credential_id: string | null;
  verify_url: string | null;
  published: boolean;
}

// ─── Achievements ──────────────────────────────────────────────────
export type AchievementType = "award" | "academic" | "scholarship" | "recognition";

export interface Achievement {
  id: string;
  title: string;
  type: AchievementType;
  description: string;
  date: string;
  image: string | null;
  published: boolean;
}

// ─── Skills ────────────────────────────────────────────────────────
export type SkillCategory =
  | "Programming"
  | "AI & Machine Learning"
  | "Robotics"
  | "Engineering"
  | "Leadership"
  | "Communication"
  | "Project Management";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string | null;
  order: number;
}

// ─── Blog ──────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  reading_time: number;
  category: string;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string | null;
}

// ─── Gallery ───────────────────────────────────────────────────────
export interface GalleryCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  file_url: string;
  thumbnail_url: string | null;
  file_type: "image" | "video";
  alt_text: string | null;
  tags: string[];
  category: string | null; // Legacy
  category_id: string | null;
  category_data?: GalleryCategory | null; // Joined
  taken_at: string | null;
  location: string | null;
  is_featured: boolean;
  is_public: boolean;
  is_published: boolean;
  display_order: number;
}

// ─── Resume ────────────────────────────────────────────────────────
export interface Resume {
  id: string;
  file_url: string;
  updated_at: string;
}
