import type { Metadata } from "next";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Chawin Phaikeaw — a Computer Engineering student passionate about AI, Robotics, and building meaningful technology.",
};

const values = [
  {
    title: "Build to learn.",
    description: "Projects are how I learn best. Whether it's an AI model, an Arduino prototype, or a new piece of software, building helps me turn ideas into understanding and theory into experience.",
  },
  {
    title: "Stay Curious.",
    description: "Some of my most valuable lessons have come from places I didn't expect, from school projects and competitions to international programs and conversations with people from different backgrounds. I believe curiosity is one of the most important skills anyone can develop.",
  },
  {
    title: "Grow with Others.",
    description: "Many of my best experiences have come from working with teams. I value collaboration, sharing ideas, and learning from people who see the world differently than I do.",
  },
  {
    title: "Keep Moving Forward.",
    description: "I don't have every answer about where my future will lead, and that's part of the excitement. What matters most to me is continuing to learn, take on new challenges, and make the most of every opportunity that comes my way.",
  },
];

const interests = [
  { emoji: "🤖", label: "Robotics" },
  { emoji: "🧠", label: "Artificial Intelligence" },
  { emoji: "🚀", label: "Entrepreneurship" },
  { emoji: "📚", label: "Reading" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🌐", label: "Global Thinking" },
  { emoji: "🔬", label: "Research" },
  { emoji: "🎯", label: "Focus" },
];

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-main">
        {/* Page heading */}
        <Reveal>
          <p className="section-label mb-3">About</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display mb-16 max-w-3xl leading-none" style={{ color: "var(--text-primary)" }}>
            Building through curiosity and continuous learning.
          </h1>
        </Reveal>

        {/* Statement */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-body-lg mb-6" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                I'm Chawin Phaikeaw, a Computer Engineering student who enjoys exploring the intersection of technology, innovation, and entrepreneurship.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-body-lg mb-6" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                My interest in technology started with a simple curiosity about how things work. Over time, that curiosity led me to programming, artificial intelligence, engineering projects, and opportunities to work with people from different backgrounds. Whether I'm building a prototype, learning a new concept, or leading a team project, I see every experience as a chance to grow and understand the world a little better.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-body-lg mb-6" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                Throughout my journey, I've had the opportunity to participate in academic programs, competitions, leadership roles, and international experiences. Each one has helped shape not only my technical interests but also the way I approach problem-solving, collaboration, and lifelong learning.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-body-lg mb-6" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                Today, I'm particularly interested in artificial intelligence, robotics, software development, and the ways technology can be applied to solve real-world problems. At the same time, I'm equally fascinated by innovation, business, and how great ideas are transformed into meaningful products and experiences.</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-body-lg" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                I don't claim to have everything figured out. I'm still learning, exploring different paths, and discovering where my interests will take me. What drives me most is the excitement of building, learning, and continuously becoming better than I was yesterday.</p>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.15}>
              <div className="rounded-xl border p-6" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <p className="section-label mb-4">Quick facts</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Field", value: "Computer Engineering" },
                    { label: "Focus", value: "AI · Innovation" },
                    { label: "Based in", value: "Thailand" },
                    { label: "Experience", value: "Thailand + Finland" },
                    { label: "Language", value: "Thai · English" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                      <span className="text-caption uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>{label}</span>
                      <span className="text-body-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <Reveal>
            <p className="section-label mb-10">What I believe</p>
          </Reveal>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="rounded-xl border p-6 h-full" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <h3 className="font-serif text-h3 mb-3" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                  <p className="text-body" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* International — Finland highlight */}
        <div className="mb-24">
          <Reveal>
            <p className="section-label mb-6">International Experience</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="rounded-xl border p-8 md:p-12"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-3xl">🇫🇮</span>
                <div>
                  <h2 className="font-serif text-h2" style={{ color: "var(--text-primary)" }}>Finland · Aalto University</h2>
                  <p className="text-body-sm mt-1" style={{ color: "var(--text-tertiary)" }}>via ODOS International Program</p>
                </div>
              </div>
              <p className="text-body-lg mb-6 max-w-prose" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                Participating in the ODOS program and spending time at Aalto University gave me the opportunity to experience a different academic and cultural environment. Beyond the lectures and activities, what made the experience meaningful were the people, ideas, and perspectives I encountered along the way.
              </p>
              <p className="text-body-lg max-w-prose" style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}>
                The program encouraged me to step outside my comfort zone, collaborate with students from diverse backgrounds, and think more broadly about technology, innovation, and the future. While it was only one chapter of my journey, it remains an experience that continues to influence how I learn, communicate, and approach new challenges.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Interests */}
        <div className="mb-16">
          <Reveal>
            <p className="section-label mb-8">Interests & Curiosities</p>
          </Reveal>
          <StaggerChildren className="flex flex-wrap gap-3">
            {interests.map(({ emoji, label }) => (
              <StaggerItem key={label}>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-md border text-body-sm font-medium" style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <span>{emoji}</span>
                  <span>{label}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* CTA */}
        <Reveal>
          <div className="pt-12 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-body-lg mb-6" style={{ color: "var(--text-secondary)" }}>
              Want to see what I've built?
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="btn-primary">View Projects <ArrowRight size={14} /></Link>
              <Link href="/contact" className="btn-ghost">Get in touch</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
