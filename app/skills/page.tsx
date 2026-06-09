import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical and professional skills of Chawin Phaikeaw across programming, AI, robotics, and leadership.",
};

const HARDCODED_SKILLS = [
  {
    name: "Programming",
    emoji: "💻",
    description: "Languages and technologies I've used across projects, coursework, and self-learning.",
    skills: ["Python", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    name: "AI & Engineering",
    emoji: "🧠",
    description: "Areas I've explored through projects, competitions, and hands-on experimentation.",
    skills: ["Machine Learning", "Computer Vision", "Data Analysis", "Arduino", "AI Prototyping", "Prompt Engineering"],
  },
  {
    name: "Tools & Technologies",
    emoji: "🛠️",
    description: "Technologies I've used to build, deploy, and manage projects.",
    skills: ["Git & GitHub", "Supabase", "Next.js", "Tailwind CSS", "Vercel"],
  },
  {
    name: "Professional Skills",
    emoji: "🎯",
    description: "Skills developed through real experience leading teams and organizing events.",
    skills: ["Leadership", "Public Speaking", "Teamwork", "Event Organization", "Project Management", "Problem Solving"],
  },
];

const INTERESTS = [
  "Artificial Intelligence", "Robotics", "Entrepreneurship", "Investing",
  "Piano", "Guitar", "Badminton", "Basketball"
];

export default function SkillsPage() {
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
          {HARDCODED_SKILLS.map((category, i) => (
            <Reveal key={category.name} delay={i * 0.05}>
              <div>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{category.emoji}</span>
                  <h2 className="font-serif text-h3" style={{ color: "var(--text-primary)" }}>{category.name}</h2>
                </div>
                <p className="text-body-sm mb-5 ml-9" style={{ color: "var(--text-tertiary)" }}>{category.description}</p>

                {/* Skill chips */}
                <div className="ml-9 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-chip"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {i < HARDCODED_SKILLS.length - 1 && (
                  <div className="divider mt-10" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <Reveal delay={0.3}>
            <h2 className="font-serif text-h2 mb-4" style={{ color: "var(--text-primary)" }}>Interests & Hobbies.</h2>
            <p className="text-body-sm mb-6 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Outside of academics and technology, I enjoy music, sports, investing, and exploring new ideas. These interests help me stay curious, creative, and balanced.
            </p>

            <div className="flex flex-wrap gap-3">
              {INTERESTS.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "var(--bg-surface-2)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)"
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}
