"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import type { TimelineItem } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  education:     "Education",
  work:          "Work",
  project:       "Project",
  life:          "Life",
  award:         "Award",
  travel:        "Travel",
  certification: "Certification",
};

const typeColors: Record<string, string> = {
  education:     "#3B5BDB",
  work:          "#2D6A4F",
  project:       "#B45309",
  life:          "#0EA5E9",
  award:         "#D97706",
  travel:        "#059669",
  certification: "#6741D9",
};

const filters = [
  { label: "All",           value: "all"          },
  { label: "Education",     value: "education"    },
  { label: "Work",          value: "work"         },
  { label: "Projects",      value: "project"      },
  { label: "Life",          value: "life"         },
  { label: "Awards",        value: "award"        },
  { label: "Travel",        value: "travel"       },
  { label: "Certifications",value: "certification"},
];

function formatTimelineDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function TimelineSection({ items }: { items: TimelineItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = items.filter(
    (item) => activeFilter === "all" || item.type === activeFilter
  );

  return (
    <section className="section-padding" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-main">
        <Reveal>
          <p className="section-label mb-3">My Journey</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-h1 mb-10" style={{ color: "var(--text-primary)" }}>
            Milestones that shaped me.
          </h2>
        </Reveal>

        {/* Filter pills */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-2 mb-14">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-body-sm font-medium transition-all duration-200 border",
                  activeFilter === f.value
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-px"
            style={{ background: "var(--border)" }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-0"
            >
              {filtered.map((item, i) => {
                const isExpanded = expanded === item.id;
                const color = typeColors[item.type] || "#9E9B96";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-8 md:pl-12 pb-12"
                  >
                    {/* Dot */}
                    <div
                      className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: color,
                        background: color,
                        borderStyle: "solid",
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    {/* Content */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="w-full text-left group"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span
                          className="text-caption uppercase tracking-widest font-medium"
                          style={{ color }}
                        >
                          {typeLabels[item.type] || item.type}
                        </span>
                        <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                          {formatTimelineDate(item.start_date)} — {item.is_current ? "Present" : item.end_date ? formatTimelineDate(item.end_date) : ""}
                        </span>
                      </div>
                      <h3
                        className="font-medium text-body-lg transition-colors duration-150 group-hover:text-[var(--accent)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-body-sm font-medium mt-1" style={{ color: "var(--text-secondary)" }}>
                        {item.organization}
                      </p>
                    </button>

                    <AnimatePresence>
                      {isExpanded && item.description && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-3 overflow-hidden"
                        >
                          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
                            {item.description}
                          </p>
                          {item.logo_url && (
                             <img src={item.logo_url} alt="" className="mt-3 h-8 object-contain opacity-70" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-8 text-center text-[var(--text-tertiary)] italic">
                  No timeline events found.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
