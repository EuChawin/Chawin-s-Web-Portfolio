import Link from "next/link";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export function RecommendationsPreviewSection() {
  return (
    <section className="section-padding bg-[var(--bg-surface)] border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-main">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label mb-3">Testimonials</p>
              <h2 className="font-serif text-h2 leading-tight" style={{ color: "var(--text-primary)" }}>
                Words From Mentors.
              </h2>
            </div>
            <Link href="/recommendations" className="btn-ghost shrink-0">
              View All Recommendations <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StaggerItem>
            <div className="card p-8 border border-[var(--border)] rounded-2xl bg-[var(--bg)] h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="relative mb-6 flex-1">
                <span className="absolute -top-4 -left-4 text-5xl opacity-10 font-serif" style={{ color: "var(--text-primary)" }}>"</span>
                <p className="text-body-sm leading-relaxed relative z-10 italic" style={{ color: "var(--text-primary)" }}>
                  "Chawin has been one of the most influential students in our English Program. Throughout his years with us, he consistently led by example, not only through academic excellence but also through his willingness to support others. He often took initiative, contributed new ideas to improve the program, and helped create opportunities for his classmates to succeed alongside him. As a member of our first senior high school batch, he played an important role in shaping a positive culture and setting a strong standard for future students. Beyond his achievements, I am most grateful for his character, reliability, and genuine desire to help others. He has been a role model, a leader, and a student I could always count on."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center font-serif text-[var(--text-secondary)] border border-[var(--border)]">
                  D
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Miss Natgamon Boonsak</h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Head of English Program, Assumption College Nakhonratchasima</p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="card p-8 border border-[var(--border)] rounded-2xl bg-[var(--bg)] h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="relative mb-6 flex-1">
                <span className="absolute -top-4 -left-4 text-5xl opacity-10 font-serif" style={{ color: "var(--text-primary)" }}>"</span>
                <p className="text-body-sm leading-relaxed relative z-10 italic" style={{ color: "var(--text-primary)" }}>
                  "
                  Teaching Chawin over several years has been a privilege. He is a highly motivated student who combines academic excellence with genuine curiosity and a strong work ethic. Whether inside or outside the classroom, he consistently seeks opportunities to learn, challenge himself, and help those around him. His leadership is evident in the way he supports classmates, takes responsibility, and contributes to both academic and extracurricular activities. Beyond his accomplishments in mathematics, English, technology, and AI-related projects, what stands out most is his integrity, humility, and willingness to serve others. He is among the finest students I have taught, and I am confident he will continue to make meaningful contributions wherever he goes."
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center font-serif text-[var(--text-secondary)] border border-[var(--border)]">
                  M
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Miss Ruth B. Tarnate</h4>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Head of English Program (Academic Affairs), Assumption College Nakhonratchasima</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </section>
  );
}
