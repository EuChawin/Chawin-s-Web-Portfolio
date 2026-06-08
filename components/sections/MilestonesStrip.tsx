"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { Profile } from "@/lib/types/database";

interface Milestone {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
}

function buildMilestones(profile: Profile | null): Milestone[] {
  const meta = (profile?.metadata as Record<string, unknown> | null) ?? {};
  const parseNum = (v: unknown, fallback: number) => {
    const n = parseFloat(String(v ?? ""));
    return isNaN(n) ? fallback : n;
  };

  const gpa = parseNum(profile?.gpa, 3.8);
  const ielts = parseNum(meta["ielts_score"], 7.0);
  const countries = parseNum(meta["countries_count"], 2);
  const certs = parseNum(meta["certifications_count"], 10);
  const projects = parseNum(meta["projects_count"], 5);

  return [
    { value: String(gpa), numericValue: gpa, suffix: "", label: "GPA" },
    { value: String(ielts), numericValue: ielts, suffix: "", label: "IELTS Score" },
    { value: String(countries), numericValue: countries, suffix: "+", label: "Countries" },
    { value: String(certs), numericValue: certs, suffix: "+", label: "Certifications" },
    { value: String(projects), numericValue: projects, suffix: "+", label: "Projects" },
  ];
}

function CountUp({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function MilestonesStrip({ profile }: { profile: Profile | null }) {
  const milestones = buildMilestones(profile);
  return (
    <section
      className="py-20"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container-main">
        <Reveal className="mb-12">
          <p className="section-label">By the numbers</p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {milestones.map((m, i) => {
            const decimals = m.numericValue % 1 !== 0 ? 1 : 0;
            return (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="flex flex-col">
                  <span
                    className="font-serif text-display leading-none mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <CountUp target={m.numericValue} suffix={m.suffix} decimals={decimals} />
                  </span>
                  <span className="section-label">{m.label}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
