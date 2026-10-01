export type SkillGroup = {
  label: string;
  items: string[];
};

// Merged and deduplicated from both source projects' skill lists.
// No proficiency percentages — neither source project had a legitimate
// basis for them (Project B used Math.random() for its skill bars, which
// this rewrite deliberately does not reproduce).
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["JavaScript", "Java", "SQL", "Embedded C", "Python"],
  },
  {
    label: "Frontend",
    items: ["React", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "Spring Boot", ".NET", "REST APIs", "JWT Authentication"],
  },
  {
    label: "Database",
    items: ["MongoDB", "MySQL", "SQL"],
  },
  {
    label: "Cloud & Tools",
    items: ["AWS", "AWS S3", "AWS Lambda", "Git", "GitHub", "Postman", "OpenCV"],
  },
];

// Flat list, derived from the groups above — used where a single list is
// more useful (e.g. the AI assistant's context, meta tags).
export const skills: string[] = Array.from(new Set(skillGroups.flatMap((g) => g.items)));

export const capabilities = [
  {
    title: "Full-Stack Engineering",
    body: "Building end-to-end features across React front ends and Node.js/Java back ends.",
  },
  {
    title: "Frontend Development",
    body: "Responsive, accessible interfaces with React, Tailwind CSS and vanilla CSS.",
  },
  {
    title: "REST API Design",
    body: "Designing documented APIs with proper validation, error handling and JWT auth.",
  },
  {
    title: "Databases",
    body: "Modeling relational (MySQL/SQL) and document (MongoDB) data for real workloads.",
  },
  {
    title: "Cloud & Deployment",
    body: "Shipping to AWS (S3, Lambda) and Vercel with CI/CD and free-tier-conscious infrastructure.",
  },
  {
    title: "Systems Thinking",
    body: "Balancing correctness, cost and maintainability instead of over-engineering.",
  },
];
