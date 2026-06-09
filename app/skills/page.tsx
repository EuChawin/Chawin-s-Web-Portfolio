import type { Metadata } from "next";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical and professional skills of Chawin Phaikeaw across programming, AI, robotics, and leadership.",
};

import { getPublishedSkills } from "@/lib/supabase/queries";

const categoryMeta: Record<string, { name: string, emoji: string, description: string }> = {
  language: { name: "Programming", emoji: "💻", description: "Languages and paradigms I work with fluently." },
  ai_ml: { name: "AI & Machine Learning", emoji: "🧠", description: "Tools and frameworks for building intelligent systems." },
  robotics: { name: "Robotics", emoji: "🤖", description: "Platforms and tools for building autonomous systems." },
  engineering: { name: "Engineering", emoji: "⚙️", description: "Infrastructure, tools, and development environment." },
  soft: { name: "Leadership", emoji: "🎯", description: "Skills developed through real experience leading teams." },
  concept: { name: "Concepts & Patterns", emoji: "🗣️", description: "Conveying complex ideas clearly and confidently." },
  platform: { name: "Platforms", emoji: "☁️", description: "Cloud platforms and operating systems." },
  framework: { name: "Frameworks", emoji: "⚛️", description: "Libraries and frameworks for building applications." },
  tool: { name: "Tools", emoji: "🛠️", description: "Development tools and utilities." },
};

const categoryOrder = ["language", "ai_ml", "robotics", "framework", "tool", "platform", "engineering", "concept", "soft"];

  export const revalidate = 3600;

export default async function SkillsPage() {
  const skills = await getPublishedSkills();

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);
  
  const activeCategories = categoryOrder.filter(cat => groupedSkills[cat]);

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Capabilities</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Skills.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-4 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Technical and professional skills I've developed through projects, coursework, competitions, leadership roles, and hands-on experience.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-body-sm mb-16 italic" style={{ color: "var(--text-tertiary)" }}>
            Skills are best demonstrated through projects, not bar charts.
          </p>
        </Reveal>

        <div className="flex flex-col gap-12">
          {activeCategories.map((catKey, i) => {
            const meta = categoryMeta[catKey] || { name: catKey, emoji: "✨", description: "" };
            const catSkills = groupedSkills[catKey];
            
            return (
              <Reveal key={catKey} delay={i * 0.05}>
                <div>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{meta.emoji}</span>
                    <h2 className="font-serif text-h3" style={{ color: "var(--text-primary)" }}>{meta.name}</h2>
                  </div>
                  <p className="text-body-sm mb-5 ml-9" style={{ color: "var(--text-tertiary)" }}>{meta.description}</p>
  
                  {/* Skill chips */}
                  <div className="ml-9 flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="skill-chip"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
  
                  {i < activeCategories.length - 1 && (
                    <div className="divider mt-10" />
                  )}
                </div>
              </Reveal>
            );
          })}
          {activeCategories.length === 0 && (
            <div className="text-center py-16 text-[var(--text-tertiary)] italic border border-dashed border-[var(--border)] rounded-xl">
               No skills found. Add some from the CMS!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
