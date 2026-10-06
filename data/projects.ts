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
      "Full-stack banking system supporting customer, employee, and admin roles. Features KYC verification, funds transfers, audit logs, alerts, and PDF account statements.",
    approach:
      "Built with React, Vite, Express, and MongoDB. Uses JWT authentication with HTTP-only refresh cookies and role-based permissions. Financial operations rely on Decimal128 precision within MongoDB multi-document transactions, idempotency keys, Helmet security headers, and request validation. Includes department-scoped access controls, Docker/nginx deployment, and GitHub Actions CI.",
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
      "A Next.js platform featuring a public landing site, secure login flows, a lightweight CMS, and dedicated dashboards for founders and investors.",
    approach:
      "Next.js 15 App Router in TypeScript with Supabase database integration and Zod schema validation. Includes sanitized CMS content rendering, HMAC-signed session tokens, and role-based middleware routing. Covered by a 69-case automated test suite.",
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
      "A React administration panel with secure token authentication and protected routes. Includes searchable, paginated data tables alongside an interactive activity builder.",
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
      "A food-ordering web app featuring a 269-item digital menu, shopping cart, Razorpay payments, table reservations, and an admin order dashboard.",
    approach:
      "Built with Next.js App Router, TypeScript, and Zustand for cart state management. Features server-side price recalculation at checkout, Mongoose database models, and an offline rule-based menu assistant. Authentication is not implemented.",
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
      "Built with FastAPI, SQLAlchemy, SQLite, and a React/Vite dashboard. Features JWT and bcrypt authentication, an asynchronous 60-second polling engine for automated device status alerts, and a UDP syslog receiver. SNMP trap receiving is not yet implemented.",
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
