import { MetadataRoute } from 'next';
import { getPublishedProjects, getPublishedBlogPosts } from '@/lib/supabase/queries';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chawin.co';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base static routes
  const routes = [
    '',
    '/projects',
    '/activities',
    '/blog',
    '/certifications',
    '/achievements',
    '/gallery',
    '/resume',
    '/contact'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic projects
  const projects = await getPublishedProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated_at || project.created_at || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic blog posts
  const posts = await getPublishedBlogPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || post.published_at || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes, ...postRoutes];
}
