import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { getPublishedAchievements } from "@/lib/supabase/queries";
import { formatDateShort } from "@/lib/utils/slug";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Awards, academic achievements, scholarships, and recognition earned by Chawin Phaikeaw.",
};

export const revalidate = 3600;

export default async function AchievementsPage() {
  const achievements = await getPublishedAchievements();

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Recognition</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Achievements.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-16 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Milestones and accomplishments that mark important moments in my academic, personal, and extracurricular journey.
          </p>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-px" style={{ background: "var(--border)" }} />

          <StaggerChildren className="flex flex-col gap-0">
            {achievements.map((item) => {
              return (
                <StaggerItem key={item.id}>
                  <div className="relative pl-8 md:pl-12 pb-12">
                    {/* Dot */}
                    <div
                      className="absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: "var(--bg-surface-2)", border: "2px solid var(--border)" }}
                    >
                    </div>

                    <div
                      className="rounded-xl border p-6 flex flex-col md:flex-row gap-6 items-start"
                      style={{
                        background: "var(--bg-surface)",
                        borderColor: "var(--border)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      {item.cover_image_url && (
                        <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative border border-[var(--border)]">
                          <Image src={item.cover_image_url} alt={item.title} fill className="object-cover" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                            {formatDateShort(item.awarded_date)}
                          </span>
                        </div>
                        <h3 className="font-serif text-h3 mb-2" style={{ color: "var(--text-primary)" }}>
                          {item.title}
                        </h3>
                        <p className="text-body-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                          {item.description}
                        </p>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-[var(--accent)] hover:underline font-medium">
                            View details →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}

            {achievements.length === 0 && (
              <div className="pl-8 md:pl-12 text-[var(--text-tertiary)] italic">
                No achievements listed yet.
              </div>
            )}
          </StaggerChildren>
        </div>
      </div>
    </div>
  );
}
