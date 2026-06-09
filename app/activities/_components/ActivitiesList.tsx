"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/types/database";
import { formatDateShort } from "@/lib/utils/slug";

const categoryLabels: Record<string, string> = {
  leadership: "Leadership", camp: "Camp", competition: "Competition",
  workshop: "Workshop", event: "Event", volunteering: "Volunteering",
};

const categoryEmoji: Record<string, string> = {
  leadership: "🎯", camp: "✈️", competition: "🏆", workshop: "🔬", event: "🎤", volunteering: "🤝",
};

export function ActivitiesList({ initialActivities }: { initialActivities: Activity[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const typesSet = new Set<string>();
  initialActivities.forEach(a => typesSet.add(a.type));
  const categories = ["All", ...Array.from(typesSet)];

  const filtered = activeCategory === "All"
    ? initialActivities
    : initialActivities.filter((a) => a.type === activeCategory);

  return (
    <>
      {/* Category filter */}
      <Reveal delay={0.2}>
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-body-sm font-medium border transition-all duration-200 flex items-center gap-2",
                activeCategory === cat
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              )}
            >
              {cat !== "All" && categoryEmoji[cat] && <span>{categoryEmoji[cat]}</span>}
              {cat === "All" ? "All" : (categoryLabels[cat] || cat)}
            </button>
          ))}
        </div>
      </Reveal>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((activity) => (
          <StaggerItem key={activity.id}>
            <div className="rounded-xl border p-6 h-full flex gap-4" style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
              {/* Image or Icon */}
              {activity.cover_image_url ? (
                <div className="w-16 h-16 rounded-md flex-shrink-0 relative overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <Image src={activity.cover_image_url} alt={activity.title} fill className="object-cover" sizes="64px" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-md flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                  {categoryEmoji[activity.type] || "📍"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="badge badge-default">{categoryLabels[activity.type] || activity.type}</span>
                  <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                    {formatDateShort(activity.start_date)} {activity.end_date ? `— ${formatDateShort(activity.end_date)}` : ""}
                  </span>
                </div>
                <h3 className="font-medium text-body-lg mb-2" style={{ color: "var(--text-primary)" }}>{activity.title}</h3>
                <p className="text-body-sm" style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}>{activity.description}</p>
                {activity.url && (
                   <a href={activity.url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-[var(--accent)] hover:underline">
                      View Activity →
                   </a>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {filtered.length === 0 && (
         <div className="text-center py-12 text-[var(--text-tertiary)] italic border border-dashed rounded-xl border-[var(--border)]">
           No activities match this category.
         </div>
      )}
    </>
  );
}
