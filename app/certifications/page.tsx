import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedCertifications } from "@/lib/supabase/queries";
import { CertificationsList } from "./_components/CertificationsList";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Professional certifications and credentials earned by Chawin Phaikeaw.",
};

export const revalidate = 3600;

export default async function CertificationsPage() {
  const certifications = await getPublishedCertifications();

  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Credentials</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Certifications.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-16 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Courses, programs, and certifications that reflect my commitment to continuous learning and exploring new areas of knowledge.
          </p>
        </Reveal>

        <CertificationsList certifications={certifications} />
      </div>
    </div>
  );
}
