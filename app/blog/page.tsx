import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, reflections, and technical writing by Chawin Phaikeaw on AI, engineering, and international experiences.",
};

export const revalidate = 3600;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  const featured = posts.find((p) => p.is_featured);
  const rest = posts.filter((p) => p.id !== featured?.id);

  const categoriesSet = new Set<string>();
  posts.forEach(p => { if (p.category) categoriesSet.add(p.category); });
  const categories = ["All", ...Array.from(categoriesSet).sort()];

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Writing</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Blog.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-16 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Thoughts, experiences, and lessons from projects, technology, education, and the experiences that continue to shape my perspective.
          </p>
        </Reveal>

        {/* Featured post */}
        {featured && (
          <Reveal delay={0.2} className="mb-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="relative h-56 md:h-auto flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-surface-2)", minHeight: "280px" }}>
                  {featured.cover_image_url ? (
                    <Image src={featured.cover_image_url} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-6xl opacity-20">✍</span>
                  )}
                </div>
                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge badge-accent">Featured</span>
                    {featured.category && <span className="badge badge-default">{featured.category}</span>}
                  </div>
                  <h2 className="font-serif text-h2 mb-3 group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-primary)" }}>
                    {featured.title}
                  </h2>
                  <p className="text-body mb-5 line-clamp-3" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-caption" style={{ color: "var(--text-tertiary)" }}>
                      <Clock size={12} /> {featured.reading_time_minutes} min read
                    </span>
                    <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>{featured.published_at ? formatDate(featured.published_at) : ""}</span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Category filter (Visual only in server component, full interactivity would require client component, but let's keep it simple for now) */}
        <Reveal delay={0.25}>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <span key={cat} className="px-4 py-1.5 rounded-full text-body-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] cursor-default">
                {cat}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Post grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((post) => (
            <StaggerItem key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full hover:shadow-md hover:shadow-black/5 flex flex-col"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
              >
                {/* Image */}
                <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
                  {post.cover_image_url ? (
                    <Image src={post.cover_image_url} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-4xl opacity-20">✍</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && <span className="badge badge-default">{post.category}</span>}
                    <span className="flex items-center gap-1 text-caption" style={{ color: "var(--text-tertiary)" }}>
                      <Clock size={11} /> {post.reading_time_minutes} min
                    </span>
                  </div>
                  <h3 className="font-serif text-h3 mb-2 group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-primary)" }}>
                    {post.title}
                  </h3>
                  <p className="text-body-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                    <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>{post.published_at ? formatDate(post.published_at) : ""}</span>
                    <span className="btn-text text-[13px]">Read <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-16 text-center text-[var(--text-tertiary)] italic border border-dashed border-[var(--border)] rounded-xl">
              No blog posts published yet.
            </div>
          )}
        </StaggerChildren>
      </div>
    </div>
  );
}
