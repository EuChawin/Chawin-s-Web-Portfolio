import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedActivities } from "@/lib/supabase/queries";
import { ActivitiesList } from "./_components/ActivitiesList";

export const metadata: Metadata = {
  title: "Activities | Chawin Phaikeaw",
  description: "Leadership, competition, international programs, and community — the experiences that shaped who I am beyond the classroom.",
};

export const revalidate = 3600;

export default async function ActivitiesPage() {
  const activities = await getPublishedActivities();

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Involvement</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Activities.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-12 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Experiences beyond the classroom that helped me develop leadership, teamwork, communication, and a broader view of the world.
          </p>
        </Reveal>

        <ActivitiesList initialActivities={activities} />
      </div>
    </div>
  );
}
