import type { Metadata } from "next";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { RECOMMENDATIONS } from "@/lib/data/recommendations-data";
import { RecommenderAvatar } from "@/components/ui/RecommenderAvatar";

export const metadata: Metadata = {
  title: "Recommendations",
  description: "Professional recommendations and words from mentors of Chawin Phaikeaw.",
};

export default function RecommendationsPage() {
  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Testimonials</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Recommendations.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-16 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            A few words from the people who have helped shape my academic and personal journey.
          </p>
        </Reveal>

        <StaggerChildren className="grid grid-cols-1 gap-8">
          {RECOMMENDATIONS.map((rec) => (
            <StaggerItem key={rec.id}>
              <div className="card p-8 md:p-10 border border-[var(--border)] rounded-2xl bg-[var(--bg-surface)] hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column: Author Info */}
                  <div className="md:w-1/3 shrink-0 flex flex-col md:items-start items-center text-center md:text-left gap-4">
                    <RecommenderAvatar name={rec.name} initials={rec.initials} image={rec.image} size="lg" />
                    <div>
                      <h3 className="font-medium text-lg" style={{ color: "var(--text-primary)" }}>{rec.name}</h3>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{rec.position}</p>
                      <p className="text-sm font-medium mt-1" style={{ color: "var(--text-tertiary)" }}>{rec.organization}</p>
                    </div>
                  </div>

                  {/* Right Column: Text & Action */}
                  <div className="md:w-2/3 flex flex-col">
                    <div className="relative mb-6">
                      <span className="absolute -top-4 -left-6 text-6xl opacity-10 font-serif hidden md:block" style={{ color: "var(--text-primary)" }}>"</span>
                      <p className="text-body-lg leading-relaxed relative z-10" style={{ color: "var(--text-primary)" }}>
                        {rec.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
