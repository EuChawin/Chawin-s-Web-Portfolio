"use client";

import { useState } from "react";
import { Search, Github, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types/database";
import { formatDateShort } from "@/lib/utils/slug";

export function ProjectsList({ initialProjects }: { initialProjects: Project[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  // Extract all unique tags
  const allTagsSet = new Set<string>();
  initialProjects.forEach(p => p.tags?.forEach(tag => allTagsSet.add(tag)));
  const allTags = ["All", ...Array.from(allTagsSet).sort()];

  const filtered = initialProjects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                       (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
                       (p.tagline || "").toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "All" || (p.tags && p.tags.includes(activeTag));
    return matchSearch && matchTag;
  });

  const featured = filtered.find((p) => p.is_featured);
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <>
      {/* Search & Filter */}
      <Reveal delay={0.2}>
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-md border text-body-sm outline-none transition-all duration-200 focus:border-[var(--accent)]"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-body-sm font-medium border transition-all duration-200",
                  activeTag === tag
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Featured project */}
      {featured && (
        <Reveal delay={0.1} className="mb-8">
          <Link href={`/projects/${featured.slug}`}
            className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
                {featured.cover_image_url ? (
                  <Image src={featured.cover_image_url} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <span className="text-6xl opacity-20">⬡</span>
                )}
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge badge-accent">Featured</span>
                  <span className={cn("badge", featured.status === "completed" ? "badge-success" : "badge-warning")}>
                     {featured.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                </div>
                <h2 className="font-serif text-h2 mb-3 group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-primary)" }}>{featured.title}</h2>
                <p className="text-body mb-6" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>{featured.tagline || featured.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {featured.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <span className="btn-text">View project <ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      {/* Project grid */}
      {rest.length > 0 && (
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rest.map((p) => (
            <StaggerItem key={p.id}>
              <Link href={`/projects/${p.slug}`}
                className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full hover:shadow-md flex flex-col"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
                  {p.cover_image_url ? (
                     <Image src={p.cover_image_url} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                     <span className="text-4xl opacity-20">⬡</span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("badge", p.status === "completed" ? "badge-success" : "badge-warning")}>
                      {p.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <h3 className="font-medium text-body-lg mb-2 group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                  <p className="text-body-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{p.tagline || p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {p.tags?.slice(0, 3).map((t) => <span key={t} className="tag text-[11px] px-2 py-0.5">{t}</span>)}
                    {(p.tags?.length || 0) > 3 && <span className="tag text-[11px] px-2 py-0.5">+{(p.tags?.length || 0) - 3}</span>}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      )}

      {filtered.length === 0 && (
        <Reveal>
          <div className="text-center py-24 border border-dashed rounded-xl" style={{ borderColor: "var(--border)" }}>
            <p className="text-body-lg" style={{ color: "var(--text-tertiary)" }}>No projects match your search.</p>
          </div>
        </Reveal>
      )}
    </>
  );
}
