import type { Metadata } from "next";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Recommendations",
  description: "Professional recommendations and words from mentors of Chawin Phaikeaw.",
};

const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Miss Natgamon Boonsak",
    position: "Head of English Program",
    organization: "Assumption College Nakhonratchasima",
    text: "Chawin has been one of the most influential students in our English Program. Throughout his years with us, he consistently led by example, not only through academic excellence but also through his willingness to support others. He often took initiative, contributed new ideas to improve the program, and helped create opportunities for his classmates to succeed alongside him. As a member of our first senior high school batch, he played an important role in shaping a positive culture and setting a strong standard for future students. Beyond his achievements, I am most grateful for his character, reliability, and genuine desire to help others. He has been a role model, a leader, and a student I could always count on.",
    letterUrl: "#", // Mock link for now
  },
  {
    id: 2,
    name: "Miss Ruth B. Tarnate",
    position: "Head of English Program (Academic Affairs)",
    organization: "Assumption College Nakhonratchasima",
    text: "Teaching Chawin over several years has been a privilege. He is a highly motivated student who combines academic excellence with genuine curiosity and a strong work ethic. Whether inside or outside the classroom, he consistently seeks opportunities to learn, challenge himself, and help those around him. His leadership is evident in the way he supports classmates, takes responsibility, and contributes to both academic and extracurricular activities. Beyond his accomplishments in mathematics, English, technology, and AI-related projects, what stands out most is his integrity, humility, and willingness to serve others. He is among the finest students I have taught, and I am confident he will continue to make meaningful contributions wherever he goes.",
    letterUrl: "#",
  },
  {
    id: 3,
    name: "Mister Shubhu Awi",
    position: "Head of English Program (Discipline)",
    organization: "Assumption College Nakhonratchasima",
    text: "Over the years, I have had the opportunity to work with many students, and Chawin is among the most exceptional. He demonstrates a rare balance of academic achievement, leadership, responsibility, and personal character. Whether participating in school activities, representing the program, pursuing technology projects, or supporting his peers, he consistently approaches every responsibility with maturity and dedication. What impresses me most is not only his ability to excel in many different areas, but also his humility and respect toward others. He possesses tremendous potential for future success, and I have no doubt that he will continue to accomplish great things while remaining a positive influence on those around him.",
    letterUrl: "#",
  },
  {
    id: 4,
    name: "Mister Alex G. Soriano",
    position: "Physics Teacher",
    organization: "Assumption College Nakhonratchasima",
    text: "Chawin is one of the most outstanding students I have had the pleasure of teaching. His strong understanding of Physics, analytical thinking, and problem-solving abilities consistently placed him among the top students in the classroom. Beyond academic performance, he demonstrates genuine curiosity and a desire to explore concepts beyond what is required. He approaches challenges with determination, learns independently, and maintains a high standard in everything he does. Equally important are his personal qualities: responsibility, humility, teamwork, and respect for others. He is the kind of student who not only achieves excellence himself but also inspires those around him to do the same. I am confident that he will continue to thrive in any academic or professional environment he chooses to pursue.",
    letterUrl: "#",
  }
];

export default function RecommendationsPage() {
  return (
    <div className="section-padding">
      <div className="container-main">
        <Reveal><p className="section-label mb-3">Testimonials</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-display leading-none mb-6" style={{ color: "var(--text-primary)" }}>Recommendations.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-body-lg mb-16 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            A few words from the people who have helped shape my academic and personal journey.
          </p>
        </Reveal>

        <StaggerChildren className="grid grid-cols-1 gap-8">
          {RECOMMENDATIONS.map((rec) => (
            <StaggerItem key={rec.id}>
              <div className="card p-8 md:p-10 border border-[var(--border)] rounded-2xl bg-[var(--bg-surface)] hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column: Author Info */}
                  <div className="md:w-1/3 shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center text-xl font-serif text-[var(--text-secondary)] border border-[var(--border)]">
                        {rec.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg" style={{ color: "var(--text-primary)" }}>{rec.name}</h3>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{rec.position}</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>{rec.organization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Text & Action */}
                  <div className="md:w-2/3 flex flex-col">
                    <div className="relative mb-6">
                      <span className="absolute -top-4 -left-6 text-6xl opacity-10 font-serif" style={{ color: "var(--text-primary)" }}>"</span>
                      <p className="text-body-lg leading-relaxed relative z-10" style={{ color: "var(--text-primary)" }}>
                        {rec.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
