"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { Profile } from "@/lib/types/database";

export function HeroSection({ profile }: { profile: Profile | null }) {
  const firstName = profile?.full_name?.split(" ")[0] || "Chawin";
  const lastName = profile?.full_name?.split(" ").slice(1).join(" ") || "Phaikeaw";

  return (
    <section className="min-h-[90vh] flex items-center section-padding">
      <div className="container-main w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text side */}
          <div className="order-2 md:order-1">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="section-label mb-4"
            >
              Portfolio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-display leading-none mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {firstName}
              <br />
              {lastName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {profile?.headline || "Computer Engineering Student"}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg mb-10 whitespace-pre-wrap"
              style={{ color: "var(--text-tertiary)" }}
            >
              {profile?.bio_short || "Tech Enthusiast · Builder · Global Explorer"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/projects" className="btn-primary">
                View Projects
                <ArrowRight size={15} />
              </Link>
              <Link href="/resume" className="btn-ghost">
                <Download size={15} />
                Resume
              </Link>
            </motion.div>
          </div>

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 md:order-2 flex justify-center md:justify-end"
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full scale-105 opacity-20"
                style={{
                  background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
                }}
              />
              <div
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 bg-[var(--bg-surface-2)]"
                style={{ borderColor: "var(--border)" }}
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile Photo"}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center font-serif text-6xl"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {firstName[0]}{lastName[0]}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center mt-20"
        >
          <div className="flex flex-col items-center gap-2">
            <p className="section-label">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8"
              style={{ background: "var(--border)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
