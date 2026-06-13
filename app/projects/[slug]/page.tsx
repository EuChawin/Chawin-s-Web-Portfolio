import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { Metadata } from "next";
import { getProjectBySlug, getPublishedProjects } from "@/lib/supabase/queries";
import { formatDateShort } from "@/lib/utils/slug";
import type { ProjectSection } from "@/lib/types/database";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return {
    title: project ? `${project.title} | Projects` : "Project Not Found",
    description: project?.tagline || project?.description || "",
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="section-padding container-main text-center py-32">
        <h1 className="font-serif text-h1 mb-4" style={{ color: "var(--text-primary)" }}>Project not found</h1>
        <Link href="/projects" className="btn-ghost">← Back to Projects</Link>
      </div>
    );
  }

  const sections: ProjectSection[] = (project.metadata as any)?.sections || [];
  const visibleSections = sections
    .filter(s => s.visible && s.content?.trim().length > 0)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal>
          <Link href="/projects" className="inline-flex items-center gap-2 text-body-sm mb-10 transition-colors hover:text-[var(--accent)]" style={{ color: "var(--text-tertiary)" }}>
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </Reveal>

        {/* Cover image */}
        <Reveal delay={0.05}>
          <div className="relative w-full rounded-xl overflow-hidden mb-10 flex items-center justify-center" style={{ height: "420px", background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
            {project.cover_image_url ? (
               <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" priority />
            ) : (
               <span className="text-8xl opacity-10">⬡</span>
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={cn("badge", project.status === "completed" ? "badge-success" : "badge-warning")}>
                   {project.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>
              <h1 className="font-serif text-h1 mb-4" style={{ color: "var(--text-primary)" }}>{project.title}</h1>
              <p className="text-body-lg mb-12" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>{project.description}</p>
            </Reveal>

            {visibleSections.map((section, idx) => (
              <Reveal key={idx} delay={0.1 + idx * 0.05}>
                <div className="mb-12">
                  <h2 className="font-serif text-h2 mb-6" style={{ color: "var(--text-primary)" }}>{section.title}</h2>
                  <div className="prose-portfolio">
                    {section.content.split('\n\n').map((para, i) => {
                      if (para.trim().startsWith('- ')) {
                        const items = para.split('\n').filter(l => l.trim().startsWith('- ')).map(l => l.trim().substring(2));
                        return (
                          <ul key={i} className="list-disc pl-5 mb-6 text-body" style={{ color: "var(--text-secondary)" }}>
                            {items.map((item, j) => <li key={j} className="mb-2">{item}</li>)}
                          </ul>
                        );
                      }
                      return <p key={i} className="mb-6 text-body" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>{para}</p>;
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4">
            <Reveal delay={0.15}>
              <div className="rounded-xl border p-6 sticky top-24" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex flex-col gap-5 mb-6">
                  {project.start_date && (
                    <div>
                      <p className="section-label mb-1">Date</p>
                      <div className="flex items-center gap-2 text-body-sm" style={{ color: "var(--text-primary)" }}>
                        <Calendar size={13} style={{ color: "var(--text-tertiary)" }} /> 
                        {formatDateShort(project.start_date)} {project.end_date ? ` — ${formatDateShort(project.end_date)}` : (project.status === "in_progress" ? " — Present" : "")}
                      </div>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <p className="section-label mb-2">Technologies</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                
                {(project.repo_url || project.demo_url) && (
                   <>
                      <div className="divider mb-6" />
                      <div className="flex flex-col gap-3">
                        {project.repo_url && (
                          <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center">
                            <Github size={14} /> View on GitHub
                          </a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                            <ExternalLink size={14} /> Live Demo
                          </a>
                        )}
                      </div>
                   </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
