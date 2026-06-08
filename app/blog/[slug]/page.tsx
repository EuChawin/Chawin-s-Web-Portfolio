import { ArrowLeft, Clock, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { Metadata } from "next";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/supabase/queries";
import { ViewCounter } from "../_components/ViewCounter";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return { 
    title: post ? `${post.title} | Blog` : "Blog Post", 
    description: post?.excerpt ?? "" 
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="section-padding container-main text-center py-32">
        <h1 className="font-serif text-h1 mb-4" style={{ color: "var(--text-primary)" }}>Post not found</h1>
        <Link href="/blog" className="btn-ghost">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <ViewCounter slug={slug} />
      <div className="container-main max-w-[720px]">
        <Reveal>
          <Link href="/blog" className="inline-flex items-center gap-2 text-body-sm mb-10 transition-colors hover:text-[var(--accent)]" style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </Reveal>

        {/* Meta */}
        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.category && <span className="badge badge-default">{post.category}</span>}
            <span className="flex items-center gap-1.5 text-caption" style={{ color: "var(--text-tertiary)" }}>
              <Clock size={11} /> {post.reading_time_minutes} min read
            </span>
            <span className="flex items-center gap-1.5 text-caption" style={{ color: "var(--text-tertiary)" }}>
              <Calendar size={11} /> {post.published_at ? formatDate(post.published_at) : ""}
            </span>
            {post.view_count !== undefined && post.view_count > 0 && (
               <span className="flex items-center gap-1.5 text-caption" style={{ color: "var(--text-tertiary)" }}>
                 <Eye size={11} /> {post.view_count} views
               </span>
            )}
          </div>
        </Reveal>

        {/* Title */}
        <Reveal delay={0.1}>
          <h1 className="font-serif text-h1 mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>{post.title}</h1>
        </Reveal>

        {/* Featured image */}
        <Reveal delay={0.15}>
          <div className="relative w-full rounded-xl mb-10 flex items-center justify-center overflow-hidden" style={{ height: "320px", background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
            {post.cover_image_url ? (
               <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
            ) : (
               <span className="text-6xl opacity-20">✍</span>
            )}
          </div>
        </Reveal>

        {/* Content */}
        <Reveal delay={0.2}>
          <div 
             className="prose-portfolio max-w-none" 
             dangerouslySetInnerHTML={{ __html: post.content || "" }} 
          />
        </Reveal>

        {/* Tags */}
        <Reveal delay={0.25}>
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
            {post.tags?.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </Reveal>

        {/* Back link */}
        <Reveal delay={0.3}>
          <div className="mt-12">
            <Link href="/blog" className="btn-ghost">← Back to Blog</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
