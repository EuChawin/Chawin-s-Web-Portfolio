"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types/database";

export function FeaturedProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section className="section-padding" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-main">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <Reveal>
              <p className="section-label mb-3">Work</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-h1" style={{ color: "var(--text-primary)" }}>
                Featured Projects.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <Link href="/projects" className="btn-text hidden md:inline-flex">
              View all
              <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        {/* Project cards */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
          {projects.length === 0 && (
             <div className="col-span-full py-12 text-center text-[var(--text-tertiary)] italic border border-dashed border-[var(--border)] rounded-xl">
               No featured projects found.
             </div>
          )}
        </StaggerChildren>

        {/* Mobile CTA */}
        <Reveal delay={0.3}>
          <div className="mt-10 md:hidden">
            <Link href="/projects" className="btn-ghost w-full justify-center">
              View all projects
              <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Image placeholder */}
      <div
        className="relative w-full h-44 overflow-hidden"
        style={{ background: "var(--bg-surface-2)" }}
      >
        {project.cover_image_url ? (
            <Image 
              src={project.cover_image_url} 
              alt={project.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-20">⬡</span>
            </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "badge text-[10px]",
              project.status === "completed" ? "badge-success" : "badge-warning"
            )}
          >
            {project.status === "completed" ? "Completed" : "In Progress"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-medium text-body-lg mb-2 transition-colors duration-150 group-hover:text-[var(--accent)]"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>
        <p
          className="text-body-sm mb-4 line-clamp-2"
          style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}
        >
          {project.excerpt || project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {project.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-[11px] px-2 py-0.5">
              {tag}
            </span>
          ))}
          {(project.tags?.length || 0) > 3 && (
            <span className="tag text-[11px] px-2 py-0.5">
              +{(project.tags?.length || 0) - 3}
            </span>
          )}
        </div>

        {/* Links row */}
        <div className="flex items-center justify-between pt-3 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
          <span className="btn-text text-[13px]">
            View project <ArrowRight size={12} />
          </span>
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="GitHub"
                className="flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-150 hover:bg-[var(--bg-surface-2)]"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Github size={13} />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Demo"
                className="flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-150 hover:bg-[var(--bg-surface-2)]"
                style={{ color: "var(--text-tertiary)" }}
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
