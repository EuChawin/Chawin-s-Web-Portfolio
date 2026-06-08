import { Reveal } from "@/components/ui/Reveal";
import { getPublishedProjects } from "@/lib/supabase/queries";
import { ProjectsList } from "./_components/ProjectsList";

export const metadata = {
  title: "Projects | Chawin Phaikeaw",
  description: "A collection of things I've built — from robotics systems to web applications.",
};

export const revalidate = 3600; // ISR revalidate every hour

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Work</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Projects.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-12 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            A collection of projects I've worked on, from software and AI to engineering concepts and prototypes. Each one reflects a challenge, a lesson, and a step forward in my learning journey.
          </p>
        </Reveal>

        <ProjectsList initialProjects={projects} />
      </div>
    </div>
  );
}
