"use client";

import { Reveal } from "@/components/ui/Reveal";
import * as LucideIcons from "lucide-react";
import type { Currently } from "@/lib/types/database";

export function CurrentlySection({ items }: { items: Currently[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section-padding" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-main">
        <div className="max-w-2xl">
          <Reveal>
            <div className="flex items-center gap-4 mb-3">
              <p className="section-label">Status</p>
              <div className="flex items-center gap-2">
                <div className="live-dot" />
                <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                  Live
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-serif text-h1 mb-10" style={{ color: "var(--text-primary)" }}>
              Currently.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div
              className="rounded-xl border p-8"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex flex-col gap-6">
                {items.map((item, i) => {
                  const Icon = item.icon_name && (LucideIcons as any)[item.icon_name] 
                    ? (LucideIcons as any)[item.icon_name] 
                    : LucideIcons.Activity;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 ${
                        i < items.length - 1 ? "pb-6 border-b" : ""
                      }`}
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0 mt-0.5"
                        style={{ background: "var(--bg-surface-2)" }}
                      >
                        <Icon size={14} style={{ color: "var(--text-tertiary)" }} />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center pt-1">
                        {item.url ? (
                           <a href={item.url} target="_blank" rel="noreferrer" className="text-body font-medium hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-primary)" }}>
                              {item.text}
                           </a>
                        ) : (
                           <p className="text-body font-medium" style={{ color: "var(--text-primary)" }}>
                              {item.text}
                           </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p
                className="text-caption mt-6 pt-6 border-t"
                style={{
                  color: "var(--text-tertiary)",
                  borderColor: "var(--border)",
                }}
              >
                This section is updated regularly via the CMS.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
