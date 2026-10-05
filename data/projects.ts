export type Project = {
  slug: string;
  name: string;
  category: "Full Stack" | "Frontend" | "Backend" | "Research" | "Embedded" | "Desktop";
  year: string;
  description: string;
  problem?: string;
  approach?: string;
  tags: string[];
  href?: string;
  status: "Shipped" | "Internship project" | "Research" | "Academic" | "Portfolio project";
};


export const projects: Project[] = [
  {
    slug: "bank-management-system",
    name: "Bank Management System",
    category: "Full Stack",
    year: "2026",
    status: "Portfolio project",
    description:
      "A full-stack banking application with customer, employee and admin roles, KYC workflows, transactions, audit logging, notifications and PDF statements.",
    approach:
      "React + Vite front end over an Express REST API and MongoDB/Mongoose. JWT auth with an HTTP-only refresh cookie, role and permission checks, Decimal128 money handling inside MongoDB transactions, idempotency keys, helmet and input validation, and a department-based organisation model (loans, insurance, collections, sales, IT security). Includes unit tests, Docker/nginx config and GitHub Actions CI.",
    tags: ["React","Vite","Node.js","Express","MongoDB","JWT","Docker","GitHub Actions"],
    href: "https://github.com/121198a/bank-management-system",
  },
  {
    slug: "ventureflow-web",
    name: "VentureFlow Web Platform",
    category: "Full Stack",
    year: "2026",
    status: "Portfolio project",
    description:
      "A Next.js web platform with a marketing site, authentication flows, a CMS and role-based founder and investor dashboards.",
    approach:
      "Next.js 15 App Router in TypeScript with Supabase, Zod validation, sanitised CMS content, HMAC-signed session tokens and role-routing middleware. Covered by a 69-case automated test suite.",
    tags: ["Next.js","TypeScript","React","Supabase","Tailwind CSS","Framer Motion"],
    href: "https://github.com/121198a/ventureflow-web",
  },
  {
    slug: "unboundx-admin-dashboard",
    name: "UnboundX Admin Dashboard",
    category: "Frontend",
    year: "2026",
    status: "Portfolio project",
    description:
      "A React admin panel with token-based login, protected routes, paginated searchable data tables and a Level Activity builder.",
    approach:
      "React 19 + Vite + Tailwind 4 + React Router 7. A single Axios client handles configurable auth strategies and centralised error handling. It consumes an external backend API, which is not part of this repository.",
    tags: ["React","Vite","Tailwind CSS","React Router","Axios"],
    href: "https://github.com/121198a/unboundx-admin-dashboard",
  },
  {
    slug: "sharma-kitchen",
    name: "Sharma Kitchen",
    category: "Full Stack",
    year: "2026",
    status: "Portfolio project",
    description:
      "A food-ordering prototype with a 269-dish data-driven menu, cart, Razorpay checkout, table reservations and an admin order view.",
    approach:
      "Next.js App Router in TypeScript with a Zustand cart, server-side price recomputation at checkout, Mongoose models for orders and reservations, and a rule-based menu assistant that needs no paid API. Authentication is not implemented.",
    tags: ["Next.js","TypeScript","MongoDB","Razorpay","Zustand","Framer Motion"],
    href: "https://github.com/121198a/sharma-kitchen",
  },
  {
    slug: "noc-monitoring-lab",
    name: "NOC Monitoring Lab",
    category: "Backend",
    year: "2026",
    status: "Portfolio project",
    description:
      "A network-operations monitoring lab with async SNMP polling, UDP syslog ingestion, deduplicated alerting and a React dashboard.",
    approach:
      "FastAPI + SQLAlchemy/SQLite with JWT/bcrypt role-based auth, a 60-second async polling loop that raises and auto-resolves device-down alerts, a UDP syslog receiver and a React/Vite dashboard. SNMP trap receiving is not yet implemented.",
    tags: ["Python","FastAPI","SQLAlchemy","SNMP","React","pytest"],
    href: "https://github.com/121198a/enterprise-it-operations-and-windows-infrastructure-management",
  },
  {
    slug: "fir-management-system",
    name: "FIR Management System",
    category: "Desktop",
    year: "2025",
    status: "Portfolio project",
    description:
      "A Java Swing desktop application for registering and tracking FIR complaints, with user and admin login and complaint approval.",
    approach:
      "NetBeans Swing GUI over JDBC and MySQL, with user and admin registration, complaint status tracking and an admin approval screen.",
    tags: ["Java","Swing","JDBC","MySQL"],
    href: "https://github.com/121198a/FIR_Management_System",
  },
  {
    slug: "wagan-shop",
    name: "WAGAN SHOP",
    category: "Full Stack",
    year: "2021",
    status: "Internship project",
    description:
      "An e-commerce application with shopper and admin interfaces: category browsing, cart, orders, a user dashboard and product, category and order management.",
    approach:
      "React front end with Context state, React Router and Axios calling a REST API (/api/product, /api/user, /api/order). The server code is not included in the public repository.",
    tags: ["React","React Router","Axios","Node.js","Express","MongoDB"],
    href: "https://github.com/121198a/E-Commerece_Website",
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
    slug: "ramp-waveform-generator",
    name: "Ramp Waveform Generator",
    category: "Embedded",
    year: "2024",
    status: "Academic",
    description:
      "A ramp waveform generator on an STM32 board, written in Embedded C with HAL during an embedded-systems internship and checked on an oscilloscope.",
    approach:
      "Built with STM32CubeIDE and Embedded C using the HAL libraries, with oscilloscope-based signal testing.",
    tags: ["STM32CubeIDE","Embedded C","HAL","Oscilloscope"],
    href: "https://github.com/121198a/ramp-waveform-generator-stm32",
  },
];

export const projectCategories: Array<Project["category"] | "All"> = [
  "All",
  "Full Stack",
  "Frontend",
  "Backend",
  "Desktop",
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
