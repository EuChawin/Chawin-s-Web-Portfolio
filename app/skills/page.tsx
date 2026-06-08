import type { Metadata } from "next";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical and professional skills of Chawin Phaikeaw across programming, AI, robotics, and leadership.",
};

const skillCategories = [
  {
    name: "Programming",
    emoji: "💻",
    description: "Languages and paradigms I work with fluently.",
    skills: ["Python", "C++", "TypeScript", "JavaScript", "SQL", "MATLAB", "Bash"],
  },
  {
    name: "AI & Machine Learning",
    emoji: "🧠",
    description: "Tools and frameworks for building intelligent systems.",
    skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "LangChain", "Hugging Face", "YOLO", "NumPy", "Pandas"],
  },
  {
    name: "Robotics",
    emoji: "🤖",
    description: "Platforms and tools for building autonomous systems.",
    skills: ["ROS", "ROS2", "Arduino", "Raspberry Pi", "Embedded C", "SLAM", "Path Planning", "Sensor Fusion"],
  },
  {
    name: "Engineering & Dev Tools",
    emoji: "⚙️",
    description: "Infrastructure, tools, and development environment.",
    skills: ["Git", "Linux", "Docker", "Next.js", "Supabase", "PostgreSQL", "REST APIs", "Vercel"],
  },
  {
    name: "Leadership",
    emoji: "🎯",
    description: "Skills developed through real experience leading teams.",
    skills: ["Team Management", "Strategic Planning", "Event Organization", "Mentoring", "Decision Making"],
  },
  {
    name: "Communication",
    emoji: "🗣️",
    description: "Conveying complex ideas clearly and confidently.",
    skills: ["Technical Writing", "Public Speaking", "Presentation", "Cross-cultural Communication", "English", "Thai"],
  },
  {
    name: "Project Management",
    emoji: "📋",
    description: "Methodologies and practices for delivering results.",
    skills: ["Agile / Scrum", "Project Planning", "Stakeholder Communication", "Documentation", "Risk Management"],
  },
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
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.05}>
              <div>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h2 className="font-serif text-h3" style={{ color: "var(--text-primary)" }}>{cat.name}</h2>
                </div>
                <p className="text-body-sm mb-5 ml-9" style={{ color: "var(--text-tertiary)" }}>{cat.description}</p>

                {/* Skill chips */}
                <div className="ml-9 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-chip"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {i < skillCategories.length - 1 && (
                  <div className="divider mt-10" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
