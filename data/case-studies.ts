// Case studies — ONLY facts verified against the actual repository source.
// No roles, dates, metrics, users or lessons are stated: add them here once
// confirmed (TODO — USER INPUT REQUIRED): role, timeline, screenshots, live demo.
// Projects with no recoverable source (steganography, STM32 ramp, WAGAN SHOP
// back end) intentionally have no case study.

export type CaseStudy = {
  slug: string; // must match a slug in data/projects.ts
  summary: string;
  stack: { label: string; items: string[] }[];
  architecture: string[];
  highlights: string[];
  /** Honest scope note: what is implemented vs scaffolded. */
  scope?: string[];
  repo: string;
  language: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "bank-management-system",
    summary:
      "A full-stack banking application for customers, employees and administrators, covering KYC, accounts, transactions, loans, cards, insurance, fraud alerts and PDF statements.",
    language: "JavaScript",
    repo: "https://github.com/121198a/bank-management-system",
    stack: [
      { label: "Front end", items: ["React", "Vite"] },
      { label: "Back end", items: ["Node.js", "Express", "JWT"] },
      { label: "Data", items: ["MongoDB", "Mongoose"] },
      { label: "Delivery", items: ["Docker", "nginx", "GitHub Actions"] },
    ],
    architecture: [
      "React/Vite single-page front end talking to an Express REST API.",
      "MongoDB data layer with 26 Mongoose models: accounts, transactions, KYC requests, loan applications, credit and debit cards, fixed deposits, insurance, collection cases, sales leads, fraud alerts, security events and incidents, notifications, documents and audit logs.",
      "Six fixed departments (Retail, Loan, Insurance, Collection, Sales, IT Security) with department-scoped access for employees.",
      "Docker and nginx deployment configuration alongside a GitHub Actions CI workflow.",
    ],
    highlights: [
      "JWT authentication with an HTTP-only refresh cookie.",
      "Role- and permission-based authorization enforced on the server.",
      "Money stored as Decimal128 and moved inside MongoDB transactions, with idempotency keys to guard against duplicate requests.",
      "Audit logging, helmet security headers, rate limiting and request validation.",
      "PDF statement generation.",
      "Unit tests and a CI pipeline that runs backend tests plus front-end lint and build.",
    ],
  },
  {
    slug: "ventureflow-web",
    summary:
      "A Next.js platform with a marketing site, authentication flows, a content management system and role-based founder and investor dashboards.",
    language: "TypeScript",
    repo: "https://github.com/121198a/ventureflow-web",
    stack: [
      { label: "Framework", items: ["Next.js 15 (App Router)", "React", "TypeScript"] },
      { label: "UI", items: ["Tailwind CSS", "Framer Motion"] },
      { label: "Data & validation", items: ["Supabase", "Zod"] },
      { label: "Delivery", items: ["Docker"] },
    ],
    architecture: [
      "Next.js App Router application of roughly 36,000 lines of TypeScript, with more than 20 API route handlers.",
      "Supabase as the data layer; request bodies validated with Zod.",
      "Middleware routes visitors to the right dashboard by role.",
      "A CMS with page versioning and a publish/archive workflow.",
    ],
    highlights: [
      "HMAC-signed session tokens and role-based routing.",
      "CMS content is sanitised before it is rendered; redirect targets are sanitised and a Content Security Policy is configured.",
      "69 automated test cases across 9 test files covering authentication, roles, rate limiting, CMS behaviour and search pagination.",
    ],
  },
  {
    slug: "unboundx-admin-dashboard",
    summary:
      "A React admin panel for managing users, CMS pages and level activities against an external backend API.",
    language: "JavaScript",
    repo: "https://github.com/121198a/unboundx-admin-dashboard",
    stack: [
      { label: "Front end", items: ["React 19", "Vite", "React Router 7"] },
      { label: "Styling", items: ["Tailwind CSS 4"] },
      { label: "API", items: ["Axios"] },
    ],
    architecture: [
      "Single-page app of about 5,000 lines with 16 routes behind protected-route guards.",
      "One central Axios client handles every API call and error response.",
      "Pages for user management, CMS pages and a level-activity builder with dynamic task lists.",
    ],
    highlights: [
      "Token-based login with protected routes and automatic logout when the API returns 401.",
      "The API client supports bearer, API-key, cookie and basic authentication strategies from configuration.",
      "A reusable paginated, searchable data-table pattern shared across admin screens.",
    ],
  },
  {
    slug: "noc-monitoring-lab",
    summary:
      "A network-operations monitoring lab: it polls devices over SNMP, ingests syslog messages, raises alerts and shows them in a React dashboard.",
    language: "Python",
    repo: "https://github.com/121198a/enterprise-it-operations-and-windows-infrastructure-management",
    stack: [
      { label: "Back end", items: ["Python", "FastAPI", "SQLAlchemy", "SQLite"] },
      { label: "Monitoring", items: ["SNMP polling", "UDP syslog"] },
      { label: "Front end", items: ["React", "Vite"] },
      { label: "Testing", items: ["pytest"] },
    ],
    architecture: [
      "FastAPI service exposing 23 REST endpoints, with JWT authentication, bcrypt password hashing and role checks.",
      "An asynchronous poller queries each device over SNMP every 60 seconds (system name and uptime).",
      "A UDP syslog receiver parses incoming messages and stores them as events.",
      "React/Vite dashboard with 9 pages and protected routes.",
    ],
    highlights: [
      "A device that stops answering raises a critical alert; the alert resolves automatically when the device recovers.",
      "Alerts are de-duplicated with a SHA-256 fingerprint so one outage produces one alert.",
      "9 pytest tests plus scripts that simulate a device going down and send test syslog messages.",
    ],
    scope: [
      "Implemented: SNMP reachability polling, alerting, syslog ingestion, REST API, authentication, dashboard.",
      "Scaffold only: the SNMP trap receiver.",
      "Not yet collected: CPU and memory metrics — health currently reflects device reachability.",
      "This is a software monitoring lab, not a network build-out: the repository contains no router or switch configurations.",
    ],
  },
  {
    slug: "fir-management-system",
    summary:
      "A Java desktop application for registering First Information Report complaints and tracking them through an admin approval workflow.",
    language: "Java",
    repo: "https://github.com/121198a/FIR_Management_System",
    stack: [
      { label: "Application", items: ["Java", "Swing (NetBeans)"] },
      { label: "Data", items: ["JDBC", "MySQL"] },
    ],
    architecture: [
      "Swing desktop interface of about 4,900 lines of Java built in NetBeans.",
      "Direct JDBC access to a MySQL database for users, complaints and status updates.",
      "Separate registration and login flows for users and administrators.",
    ],
    highlights: [
      "Complaint submission and status tracking from the user side.",
      "An admin panel to review and approve complaints.",
    ],
  },
  {
    slug: "sharma-kitchen",
    summary:
      "A Next.js food-ordering site with a 269-dish menu, table reservations and Razorpay payments.",
    language: "TypeScript",
    repo: "https://github.com/121198a/sharma-kitchen",
    stack: [
      { label: "Framework", items: ["Next.js", "React", "TypeScript"] },
      { label: "Payments", items: ["Razorpay"] },
    ],
    architecture: [
      "Next.js application of about 5,600 lines of TypeScript.",
      "Four API routes: orders, table reservations, Razorpay checkout and payment verification.",
      "A single menu data file (menu.json) with 269 dishes drives the front end.",
    ],
    highlights: [
      "Razorpay checkout with a separate server-side route that verifies the payment.",
      "A menu-validation test file checks the menu data.",
    ],
  },
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
