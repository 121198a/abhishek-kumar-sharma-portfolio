export type Project = {
  slug: string;
  name: string;
  category: "Full Stack" | "Frontend" | "Backend" | "Research" | "Embedded";
  year: string;
  description: string;
  problem?: string;
  approach?: string;
  tags: string[];
  href?: string;
  status: "Shipped" | "Internship project" | "Research" | "Academic";
};


export const projects: Project[] = [
  {
    slug: "unboundx-admin-dashboard",
    name: "UnBoundX Admin Dashboard",
    category: "Full Stack",
    year: "2024",
    status: "Shipped",
    description:
      "An internal admin dashboard for managing users, content and analytics with role-based access control.",
    approach:
      "React front end talking to a Node.js/Express API, with role-based permissions gating dashboard views and MongoDB as the data store.",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    slug: "bank-management-system",
    name: "Bank Management System",
    category: "Full Stack",
    year: "2023",
    status: "Academic",
    description:
      "A full-stack banking simulation covering accounts, transactions and statements, built on a Java/Spring backend.",
    approach:
      "Spring Boot service layer over a SQL schema for accounts and transactions, with a focus on correctness of the transaction/statement logic.",
    tags: ["Java", "Spring Boot", "SQL"],
  },
  {
    slug: "wagan-shop",
    name: "WAGAN SHOP",
    category: "Full Stack",
    year: "2021",
    status: "Internship project",
    description:
      "A full-stack e-commerce application built during an internship — product catalog, cart/checkout flow, user authentication and product management.",
    approach:
      "React front end, Node.js/Express REST APIs, MongoDB for the product/user data, and JWT-based authentication.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
  },
  {
    slug: "coverless-image-steganography",
    name: "Coverless Image Steganography",
    category: "Research",
    year: "2025",
    status: "Research",
    description:
      "Research on a cloud-enabled coverless image steganography system for secure data transmission, presented at CoCole 2025, NIT Rourkela.",
    approach:
      "Combines computer-vision feature mapping (OpenCV) with AWS S3 and Lambda to secure data transmission without embedding data directly into a cover image, preserving image integrity.",
    tags: ["Python", "OpenCV", "AWS S3", "AWS Lambda"],
  },
  {
    slug: "multi-waveform-generator",
    name: "Multi-Waveform Generator",
    category: "Embedded",
    year: "2024",
    status: "Academic",
    description:
      "An STM32-based embedded systems project generating and validating multiple waveform outputs, developed during an embedded systems internship.",
    approach:
      "Built with STM32CubeIDE and Embedded C using HAL libraries, with UART communication and oscilloscope-based signal testing.",
    tags: ["STM32CubeIDE", "Embedded C", "HAL", "UART", "Oscilloscope"],
  },
];

export const projectCategories: Array<Project["category"] | "All"> = [
  "All",
  "Full Stack",
  "Research",
  "Embedded",
];

/**
 * Server-side resolution for Project Deep Dive: the client sends only a
 * slug (never trusted as factual data). This is the single place that
 * resolves it against verified project data — an unknown slug returns
 * undefined, which callers must treat as "no project selected."
 */
export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Compact, verified summary of a single project — the "selected project
 * context" block for Project Deep Dive. Reuses the same fields already
 * shown in the Projects UI; no new facts are introduced here.
 */
export function projectContextSummary(p: Project): string {
  const parts = [
    `${p.name} (${p.category}, ${p.year}, ${p.status}): ${p.description}`,
  ];
  if (p.approach) parts.push(`Approach: ${p.approach}`);
  if (p.tags.length > 0) parts.push(`Technologies: ${p.tags.join(", ")}`);
  return parts.join(" ");
}
