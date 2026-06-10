import Link from "next/link";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";
import { RECOMMENDATIONS } from "@/lib/data/recommendations-data";
import { RecommenderAvatar } from "@/components/ui/RecommenderAvatar";

export function RecommendationsPreviewSection() {
  const previewRecs = RECOMMENDATIONS.slice(0, 2);

  return (
    <section className="section-padding bg-[var(--bg-surface)] border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-main">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label mb-3">Testimonials</p>
              <h2 className="font-serif text-h2 leading-tight" style={{ color: "var(--text-primary)" }}>
                Words From Mentors.
              </h2>
            </div>
            <Link href="/recommendations" className="btn-ghost shrink-0">
              View All Recommendations <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewRecs.map((rec) => (
            <StaggerItem key={rec.id}>
              <div className="card p-8 border border-[var(--border)] rounded-2xl bg-[var(--bg)] h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="relative mb-8 flex-1">
                  <span className="absolute -top-4 -left-4 text-5xl opacity-10 font-serif" style={{ color: "var(--text-primary)" }}>"</span>
                  <p className="text-body-sm leading-relaxed relative z-10 italic" style={{ color: "var(--text-primary)" }}>
                    "{rec.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <RecommenderAvatar name={rec.name} initials={rec.initials} image={rec.image} size="sm" />
                  <div>
                    <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{rec.name}</h4>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{rec.position}, {rec.organization}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
