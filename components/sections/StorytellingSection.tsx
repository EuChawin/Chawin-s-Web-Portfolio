"use client";

import { Reveal } from "@/components/ui/Reveal";

const panels = [
  {
    label: "Origin",
    headline: "Curiosity came first.",
    body: "Growing up in Thailand, I was always interested in understanding how things worked, whether it was technology, systems, or the ideas behind them. That curiosity eventually led me toward engineering and a desire to keep exploring beyond what was taught in the classroom.",
  },
  {
    label: "Learning",
    headline: "Learning beyond the classroom.",
    body: "My education in Computer Engineering is only one part of the journey. Through courses, competitions, independent projects, and experiences both at home and abroad, I've learned that some of the most valuable lessons happen when you step outside your comfort zone and keep asking questions.",
  },
  {
    label: "Building",
    headline: "Learning by creating.",
    body: "For me, projects are more than assignments. They are opportunities to turn ideas into something tangible. From software applications to engineering projects, each build teaches me new ways to solve problems, think critically, and bridge the gap between concept and reality.",
  },
  {
    label: "Leadership",
    headline: "Growing with others.",
    body: "Some of my most meaningful experiences have come from working with teams, organizing initiatives, and contributing to communities. Leadership, to me, is not about position or recognition. It's about taking ownership, supporting others, and helping a group move toward a shared goal.",
  },
  {
    label: "Future",
    headline: "Always exploring what's next.",
    body: "My interests span technology, innovation, and entrepreneurship. As I continue my journey in Computer Engineering, I hope to keep learning, building meaningful projects, and discovering new ways to create value through technology.",
  },
];

export function StorytellingSection() {
  return (
    <section className="section-padding" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-main">
        {panels.map((panel, i) => (
          <div
            key={panel.label}
            className={`grid grid-cols-1 md:grid-cols-12 gap-8 py-16 md:py-24 ${i < panels.length - 1 ? "border-b" : ""
              }`}
            style={{ borderColor: "var(--border)" }}
          >
            {/* Label column */}
            <div className="md:col-span-3">
              <Reveal delay={0}>
                <p className="section-label">{String(i + 1).padStart(2, "0")} — {panel.label}</p>
              </Reveal>
            </div>

            {/* Content column */}
            <div className="md:col-span-9 md:col-start-4">
              <Reveal delay={0.1}>
                <h2
                  className="font-serif text-h1 mb-6 leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {panel.headline}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p
                  className="text-body-lg max-w-prose"
                  style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}
                >
                  {panel.body}
                </p>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
