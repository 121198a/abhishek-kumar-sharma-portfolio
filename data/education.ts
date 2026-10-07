export type EducationEntry = {
  year: string;
  degree: string;
  field?: string;
  institute: string;
  location?: string;
  score: string;
  scoreType?: "CGPA" | "Percentage";
  description?: string;
  highlights?: string[];
};

// Sourced from verified academic qualifications — structured and enriched.
export const education: EducationEntry[] = [
  {
    year: "2022 – 2025",
    degree: "B.Tech in Computer Science & Information Technology",
    field: "Computer Science & Information Technology (CSIT)",
    institute: "C.V. Raman Global University",
    location: "Bhubaneswar, Odisha",
    score: "CGPA: 8.06 / 10",
    scoreType: "CGPA",
    description:
      "Core engineering degree focused on software architecture, algorithms, database management systems, and modern full-stack web technologies.",
    highlights: [
      "Data Structures & Algorithms",
      "Full-Stack Development (React, Node.js)",
      "Database Systems (SQL & NoSQL)",
      "REST API Architecture",
      "Computer Networks & Cloud Basics",
    ],
  },
  {
    year: "2019 – 2022",
    degree: "Diploma in Computer Science & Engineering",
    field: "Computer Science & Engineering (CSE)",
    institute: "Arka Jain University",
    location: "Jamshedpur, Jharkhand",
    score: "CGPA: 8.95 / 10",
    scoreType: "CGPA",
    description:
      "Three-year technical polytechnic curriculum building deep foundations in structured programming, data structures, and software engineering.",
    highlights: [
      "Core Computing & Logic Design",
      "C, C++ & Java Foundations",
      "Relational Database Management",
      "Web Application Fundamentals",
      "Software Engineering Lifecycle",
    ],
  },
  {
    year: "2017 – 2018",
    degree: "Matriculation (10th Standard)",
    field: "Secondary School Certificate",
    institute: "Ramakrishna Mission English School",
    location: "Jamshedpur, Jharkhand",
    score: "Percentage: 56%",
    scoreType: "Percentage",
    description:
      "Foundational secondary schooling with strong focus on science, mathematics, analytical reasoning, and disciplined academic performance.",
    highlights: [
      "Mathematics & Science",
      "Analytical Problem Solving",
      "English Communication",
      "Academic Discipline",
    ],
  },
];
