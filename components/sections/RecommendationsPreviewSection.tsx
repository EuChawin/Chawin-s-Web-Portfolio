import Link from "next/link";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export function RecommendationsPreviewSection() {
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
          <StaggerItem>
            <div className="card p-8 border border-[var(--border)] rounded-2xl bg-[var(--bg)] h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="relative mb-6 flex-1">
                <span className="absolute -top-4 -left-4 text-5xl opacity-10 font-serif" style={{ color: "var(--text-primary)" }}>"</span>
                <p className="text-body-sm leading-relaxed relative z-10 italic" style={{ color: "var(--text-primary)" }}>
                  "Chawin is one of the most dedicated and brilliant young engineers I have had the pleasure of mentoring... His ability to bridge the gap between theoretical AI concepts and practical robotics applications is truly exceptional."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center font-serif text-[var(--text-secondary)] border border-[var(--border)]">
                  D
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Dr. Emily Chen</h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Lead Robotics Researcher, TechFrontier</p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="card p-8 border border-[var(--border)] rounded-2xl bg-[var(--bg)] h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="relative mb-6 flex-1">
                <span className="absolute -top-4 -left-4 text-5xl opacity-10 font-serif" style={{ color: "var(--text-primary)" }}>"</span>
                <p className="text-body-sm leading-relaxed relative z-10 italic" style={{ color: "var(--text-primary)" }}>
                  "Working with Chawin on the autonomous navigation project was a fantastic experience. He possesses a rare combination of deep technical understanding and excellent communication skills... Any team would be lucky to have him."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center font-serif text-[var(--text-secondary)] border border-[var(--border)]">
                  M
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Michael Rodriguez</h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Senior Software Engineer, GlobalTech</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </section>
  );
}
