import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Download, FileText } from "lucide-react";
import { getActiveResumeFile } from "@/lib/supabase/queries";
import { formatDateShort } from "@/lib/utils/slug";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download or view the resume of Chawin Phaikeaw, Computer Engineering student.",
};

export const revalidate = 3600;

export default async function ResumePage() {
  const activeResume = await getActiveResumeFile();

  return (
    <div className="section-padding">
      <div className="container-main max-w-4xl">
        <Reveal><p className="section-label mb-3">CV</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-4" style={{ color: "var(--text-primary)" }}>Resume.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-3" style={{ color: "var(--text-secondary)" }}>
            My full curriculum vitae — available to view and download.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-body-sm mb-10" style={{ color: "var(--text-tertiary)" }}>
            {activeResume ? `Last updated: ${formatDateShort(activeResume.created_at)}` : "Last updated: will be shown here after upload via CMS."}
          </p>
        </Reveal>

        {/* Action buttons */}
        <Reveal delay={0.25}>
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={activeResume ? "/api/resume/download" : "#"}
              className={`btn-primary ${!activeResume ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              <Download size={15} />
              Download PDF
            </a>
            <a
              href={activeResume ? "/api/resume/view" : "#"}
              target={activeResume ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`btn-ghost ${!activeResume ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              <FileText size={15} />
              Open in new tab
            </a>
          </div>
        </Reveal>

        {/* PDF embed / placeholder */}
        <Reveal delay={0.3}>
          <div
            className="w-full rounded-xl border overflow-hidden bg-[var(--bg-surface)]"
            style={{ borderColor: "var(--border)", minHeight: "700px" }}
          >
            {activeResume ? (
              <iframe src="/api/resume/view" className="w-full" style={{ height: "700px" }} title="Resume PDF" />
            ) : (
              <div
                className="w-full flex flex-col items-center justify-center gap-4"
                style={{
                  height: "700px",
                  background: "var(--bg-surface)",
                }}
              >
                <FileText size={48} style={{ color: "var(--text-tertiary)" }} />
                <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  Resume PDF will appear here
                </p>
                <p className="text-body-sm text-center max-w-xs" style={{ color: "var(--text-tertiary)" }}>
                  Upload your resume through the admin CMS to display it here. The PDF will be embedded and available for download.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
