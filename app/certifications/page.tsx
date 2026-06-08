import type { Metadata } from "next";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { ExternalLink } from "lucide-react";
import { getPublishedCertifications } from "@/lib/supabase/queries";
import { formatDateShort } from "@/lib/utils/slug";

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

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {certifications.map((cert) => (
            <StaggerItem key={cert.id}>
              <div className="rounded-xl border p-6 h-full flex flex-col" style={{ background: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
                {/* Image / Icon placeholder */}
                <div className="w-12 h-12 rounded-md mb-5 flex items-center justify-center text-xl" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                  🏅
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-body-lg mb-1" style={{ color: "var(--text-primary)" }}>{cert.name}</h3>
                  <p className="text-body-sm mb-3" style={{ color: "var(--text-secondary)" }}>{cert.issuer}</p>
                  <p className="text-caption mb-2" style={{ color: "var(--text-tertiary)" }}>{formatDateShort(cert.issue_date)}</p>
                  {cert.credential_id && (
                    <p className="font-mono text-caption" style={{ color: "var(--text-tertiary)" }}>ID: {cert.credential_id}</p>
                  )}
                </div>
                {cert.credential_url && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="btn-text text-[13px]">
                      Verify credential <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
          {certifications.length === 0 && (
            <div className="col-span-full py-16 text-center text-[var(--text-tertiary)] italic border border-dashed border-[var(--border)] rounded-xl">
              No certifications found.
            </div>
          )}
        </StaggerChildren>
      </div>
    </div>
  );
}
