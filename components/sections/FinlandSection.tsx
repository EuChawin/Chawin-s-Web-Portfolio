"use client";

import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";

export function FinlandSection() {

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Subtle gradient orb */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="container-main relative">
        {/* Label */}
        <Reveal>
          <p className="section-label mb-4">Featured Journey</p>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.1}>
          <h2
            className="font-serif text-h1 mb-6 max-w-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            Some moments change your perspective forever.
          </h2>
        </Reveal>

        {/* Body */}
        <Reveal delay={0.2}>
          <p
            className="text-body-lg max-w-prose mb-16"
            style={{ color: "var(--text-secondary)", lineHeight: "1.75" }}
          >
            Through the ODOS program, I had the opportunity to spend time in Finland and experience a different approach to learning, innovation, and collaboration at Aalto University. Beyond the places I visited, what stayed with me most were the conversations, ideas, and perspectives I encountered along the way.

            The experience challenged me to think bigger, step outside familiar environments, and see how technology, design, and people can come together to create meaningful impact. It remains an important chapter in my journey and continues to influence how I approach learning and building today.
          </p>
        </Reveal>

        {/* Finland Image */}
        <Reveal delay={0.3}>
          <div
            className="relative w-full rounded-xl overflow-hidden"
            style={{
              height: "420px",
              border: "1px solid var(--border)",
            }}
          >
            <Image
              src="/images/finland/aalto-finland.jpg"
              alt="ODOS Program at Aalto University, Finland"
              fill
              priority
              className="object-cover"
            />

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 40%, transparent 100%)",
              }}
            />

            {/* Caption */}
            <div className="absolute bottom-8 left-8 z-10">
              <p
                className="section-label mb-2"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Featured Journey
              </p>

              <h3
                className="font-serif text-3xl"
                style={{ color: "white" }}
              >
                Finland · Aalto University
              </h3>

              <p
                className="mt-2"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                ODOS Program
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
