import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StorytellingSection } from "@/components/sections/StorytellingSection";
import { FinlandSection } from "@/components/sections/FinlandSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { CurrentlySection } from "@/components/sections/CurrentlySection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { MilestonesStrip } from "@/components/sections/MilestonesStrip";
import { getProfile, getCurrentlyItems, getPublishedTimeline, getFeaturedProjects } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Chawin Phaikeaw — Computer Engineering Student & Builder",
  description:
    "Computer Engineering student passionate about AI, Robotics, and Entrepreneurship. International experience across Thailand and Finland (Aalto University via ODOS).",
};

export const revalidate = 3600; // ISR revalidate every hour

export default async function HomePage() {
  const profile = await getProfile();
  const currentlyItems = await getCurrentlyItems();
  const timelineItems = await getPublishedTimeline();
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <HeroSection profile={profile} />
      <MilestonesStrip profile={profile} />
      <StorytellingSection />
      <FinlandSection />
      <TimelineSection items={timelineItems} />
      <CurrentlySection items={currentlyItems} />
      <FeaturedProjectsSection projects={featuredProjects} />
    </>
  );
}
