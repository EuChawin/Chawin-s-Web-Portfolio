export interface Recommendation {
  id: number;
  name: string;
  initials: string;
  image: string;
  position: string;
  organization: string;
  text: string;
  letterUrl: string;
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    name: "Miss Natgamon Boonsak",
    initials: "NB",
    image: "/recommendations/natgamon.jpg",
    position: "Head of English Program",
    organization: "Assumption College Nakhonratchasima",
    text: "Chawin has been one of the most influential students in our English Program. Throughout his years with us, he consistently led by example, not only through academic excellence but also through his willingness to support others. He often took initiative, contributed new ideas to improve the program, and helped create opportunities for his classmates to succeed alongside him. As a member of our first senior high school batch, he played an important role in shaping a positive culture and setting a strong standard for future students. Beyond his achievements, I am most grateful for his character, reliability, and genuine desire to help others. He has been a role model, a leader, and a student I could always count on.",
    letterUrl: "#",
  },
  {
    id: 2,
    name: "Miss Ruth B. Tarnate",
    initials: "RT",
    image: "/recommendations/ruth.jpg",
    position: "Head of English Program (Academic Affairs)",
    organization: "Assumption College Nakhonratchasima",
    text: "Teaching Chawin over several years has been a privilege. He is a highly motivated student who combines academic excellence with genuine curiosity and a strong work ethic. Whether inside or outside the classroom, he consistently seeks opportunities to learn, challenge himself, and help those around him. His leadership is evident in the way he supports classmates, takes responsibility, and contributes to both academic and extracurricular activities. Beyond his accomplishments in mathematics, English, technology, and AI-related projects, what stands out most is his integrity, humility, and willingness to serve others. He is among the finest students I have taught, and I am confident he will continue to make meaningful contributions wherever he goes.",
    letterUrl: "#",
  },
  {
    id: 3,
    name: "Mister Shubhu Awi",
    initials: "SA",
    image: "/recommendations/shubhu.jpg",
    position: "Head of English Program (Discipline)",
    organization: "Assumption College Nakhonratchasima",
    text: "Over the years, I have had the opportunity to work with many students, and Chawin is among the most exceptional. He demonstrates a rare balance of academic achievement, leadership, responsibility, and personal character. Whether participating in school activities, representing the program, pursuing technology projects, or supporting his peers, he consistently approaches every responsibility with maturity and dedication. What impresses me most is not only his ability to excel in many different areas, but also his humility and respect toward others. He possesses tremendous potential for future success, and I have no doubt that he will continue to accomplish great things while remaining a positive influence on those around him.",
    letterUrl: "#",
  },
  {
    id: 4,
    name: "Mister Alex G. Soriano",
    initials: "AS",
    image: "/recommendations/alex.jpg",
    position: "Physics Teacher",
    organization: "Assumption College Nakhonratchasima",
    text: "Chawin is one of the most outstanding students I have had the pleasure of teaching. His strong understanding of Physics, analytical thinking, and problem-solving abilities consistently placed him among the top students in the classroom. Beyond academic performance, he demonstrates genuine curiosity and a desire to explore concepts beyond what is required. He approaches challenges with determination, learns independently, and maintains a high standard in everything he does. Equally important are his personal qualities: responsibility, humility, teamwork, and respect for others. He is the kind of student who not only achieves excellence himself but also inspires those around him to do the same. I am confident that he will continue to thrive in any academic or professional environment he chooses to pursue.",
    letterUrl: "#",
  }
];
