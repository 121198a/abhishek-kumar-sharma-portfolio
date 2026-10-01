export type ExperienceEntry = {
  year: string;
  role: string;
  org: string;
  body: string;
  current?: boolean;
};

// Sourced from the React portfolio's About/internship timeline — the only
// verified work-experience data across either source project. Project A's
// generic placeholder timeline ("2024 — Focused on full-stack product
// work...") has been replaced with this real information.
export const experience: ExperienceEntry[] = [
  {
    year: "2026",
    role: "Frontend Developer Intern",
    org: "Infopulse Technology",
    body: "Developing responsive and interactive web applications using React.js, JavaScript, HTML5 and CSS3. Building reusable UI components, integrating REST APIs, optimizing application performance, and collaborating with cross-functional teams to deliver scalable, user-focused solutions.",
    current: true,
  },
  {
    year: "2025",
    role: "Research Student",
    org: "CoCole 2025, NIT Rourkela",
    body: "Published research on coverless image steganography using Python, OpenCV, AWS S3 and AWS Lambda.",
  },
  {
    year: "2024",
    role: "Embedded Systems Intern",
    org: "C.V. Raman Global University",
    body: "Developed STM32 applications using Embedded C and HAL libraries, with oscilloscope-based testing and validation.",
  },
  {
    year: "2021",
    role: "Full-Stack MERN Developer Intern",
    org: "Ardent Computech Pvt. Ltd.",
    body: "Built responsive web applications using React.js, Node.js and MySQL, with REST APIs, JWT authentication and Git-based workflows.",
  },
];
