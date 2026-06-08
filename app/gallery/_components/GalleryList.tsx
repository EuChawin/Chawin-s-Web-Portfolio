"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "@/lib/types/database";

// Fallback aspects if undefined
const getAspectClass = (url: string) => {
  // Simple heuristic or just return square if no metadata is available
  // In a real app we'd save aspect ratio in DB
  return "col-span-1 row-span-1";
};

export function GalleryList({ initialItems }: { initialItems: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categoriesSet = new Set<string>();
  initialItems.forEach(i => { if (i.category) categoriesSet.add(i.category) });
  const categories = ["All", ...Array.from(categoriesSet).sort()];

  const filtered = activeCategory === "All"
    ? initialItems
    : initialItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Category filter */}
      <Reveal delay={0.2}>
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-body-sm font-medium border transition-all duration-200",
                activeCategory === cat
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid */}
      <Reveal delay={0.25}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className={cn(
                "group relative rounded-xl overflow-hidden cursor-zoom-in transition-all duration-300 hover:-translate-y-1 col-span-1 row-span-1"
              )}
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
            >
              <Image src={item.file_url} alt={item.title || item.alt_text || "Gallery image"} fill className="object-cover" />
              {/* Caption overlay */}
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
              >
                <p className="text-white text-body-sm font-medium text-left line-clamp-2">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 && (
        <div className="text-center py-24 border border-dashed rounded-xl border-[var(--border)]">
          <p style={{ color: "var(--text-tertiary)" }}>No images in this category yet.</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full rounded-xl flex items-center justify-center overflow-hidden"
                style={{ height: "60vh", background: "var(--bg-surface-2)" }}
              >
                <Image src={lightboxItem.file_url} alt={lightboxItem.title || lightboxItem.alt_text || "Image"} fill className="object-contain" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-body-lg">{lightboxItem.title}</p>
                {lightboxItem.category && <p className="text-white/50 text-body-sm mt-1">{lightboxItem.category}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
