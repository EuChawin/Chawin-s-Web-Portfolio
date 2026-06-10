import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { getPublicGallery, getPublishedGalleryCategories } from "@/lib/supabase/queries";
import { GalleryList } from "./_components/GalleryList";

export const metadata: Metadata = {
  title: "Gallery | Chawin Phaikeaw",
  description: "Snapshots from the journey — Finland, university life, projects, and places in between.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const { data: galleryItems, count } = await getPublicGallery({ page: 1, limit: 20 });
  const categories = await getPublishedGalleryCategories();

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Moments</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Gallery.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-12 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            A collection of moments, experiences, and memories from projects, events, competitions, travels, and everyday life.
          </p>
        </Reveal>

        <GalleryList initialItems={galleryItems} initialCount={count} categories={categories} />
      </div>
    </div>
  );
}
