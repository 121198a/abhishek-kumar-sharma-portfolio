// Verified portfolio knowledge base + lightweight deterministic retrieval.
//
// This is the single source of truth for:
// 1. The NVIDIA system-prompt context (relevance-ranked, not a blind dump)
// 2. Deterministic fallback answers (multi-entry, not first-match-only)
//
// No embeddings, no vector DB — this is a scored keyword/phrase matcher.
// Every fact traces back to data/profile.ts, data/education.ts,
// data/experience.ts, data/projects.ts or data/skills.ts.

import { findProjectBySlug, projectContextSummary } from "./projects";

export type FaqCategory =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "recruiter"
  | "contact";

export type FaqEntry = {
  id: string;
  category: FaqCategory;
  /** Exact substrings — a hit is a strong signal (multi-word, specific). */
  phrases: string[];
  /** Multi-word keyword groups — ALL words must appear in the query (order-independent). */
  keywords: string[];
  answer: string;
};

export const faq: FaqEntry[] = [
  // ---------------------------------------------------------------- ABOUT
  {
    id: "about-intro",
    category: "about",
    phrases: ["who is abhishek", "about abhishek", "tell me about abhishek", "introduce abhishek", "professional introduction", "type of developer"],
    keywords: ["who is", "introduce abhishek", "his bio", "his background", "professional introduction", "type of developer", "based"],
    answer:
      "Abhishek Kumar Sharma is a frontend and full-stack developer from Jharkhand, India, with experience across React.js, JavaScript, Node.js, Spring Boot, MySQL, MongoDB and AWS.",
  },
  {
    id: "about-current-role",
    category: "about",
    phrases: ["current role", "currently working", "current job", "where does he work now", "who does he work for", "current internship"],
    keywords: ["current role", "currently working", "current job", "present role", "current internship"],
    answer:
      "Abhishek is currently a Frontend Developer Intern at Infopulse Technology, building responsive React interfaces and integrating REST APIs.",
  },

  // --------------------------------------------------------------- SKILLS
  {
    id: "skills-frontend",
    category: "skills",
    phrases: ["frontend technologies", "front end technologies", "frontend skills", "front end skills", "frontend role", "suitable for a frontend"],
    keywords: ["frontend technologies", "frontend skills", "front end skills", "ui development skills", "suitable frontend", "frontend role", "react"],
    answer:
      "Frontend: React.js, JavaScript, HTML5, CSS3, Tailwind CSS and responsive UI design.",
  },
  {
    id: "skills-backend",
    category: "skills",
    phrases: ["backend technologies", "back end technologies", "backend skills", "server side technologies", "backend role"],
    keywords: [
      "backend technologies",
      "backend skills",
      "server side technologies",
      "api development skills",
      "backend role",
      "suitable backend",
      "backend experience",
      "node.js",
      "node",
      "express.js",
      "express",
      "spring boot",
    ],
    answer:
      "Backend: Node.js, Express.js, Spring Boot, Java, REST API design and JWT authentication.",
  },
  {
    id: "skills-database",
    category: "skills",
    phrases: ["database technologies", "database skills"],
    keywords: ["database technologies", "database skills", "sql skills", "mongodb", "sql"],
    answer: "Databases: MongoDB, MySQL and SQL.",
  },
  {
    id: "skills-cloud",
    category: "skills",
    phrases: ["aws experience", "cloud experience", "cloud technologies", "cloud exposure", "cloud platform"],
    keywords: ["aws experience", "cloud experience", "cloud technologies", "cloud exposure", "cloud platform", "aws services"],
    answer:
      "Abhishek has hands-on AWS experience (S3 and Lambda), used directly in the coverless image steganography research project for secure data transmission.",
  },
  {
    id: "skills-languages",
    category: "skills",
    phrases: ["programming languages"],
    keywords: ["programming languages", "coding languages", "python", "java"],
    answer: "Languages: JavaScript, Java, SQL, Embedded C and Python.",
  },
  {
    id: "skills-tools",
    category: "skills",
    phrases: ["development tools", "tools he uses", "computer vision"],
    keywords: ["development tools", "version control tools", "computer vision", "opencv"],
    answer: "Tools: Git, GitHub, Postman and OpenCV.",
  },
  {
    id: "skills-ai-genai",
    category: "skills",
    phrases: ["ai experience", "genai experience", "generative ai experience", "machine learning experience", "llm experience"],
    keywords: ["ai experience", "genai experience", "generative ai experience", "machine learning experience", "llm experience", "genai"],
    answer:
      "The verified portfolio does not document direct GenAI or LLM development experience. The closest related, verified work is computer-vision based (OpenCV) research on coverless image steganography.",
  },
  {
    id: "skills-overview",
    category: "skills",
    phrases: ["technologies used", "technologies did he use", "tech stack", "core technologies", "technologies does he know"],
    keywords: ["technologies used", "tech stack", "core technologies", "technologies know"],
    answer:
      "Core technologies: React, JavaScript, Java, Node.js, Express.js, Spring Boot, MongoDB, MySQL, SQL, AWS (S3, Lambda), Tailwind CSS, Git and GitHub. Project work also involved Python, OpenCV, STM32, Embedded C, HAL and UART.",
  },

  // ------------------------------------------------------------- PROJECTS
  {
    id: "project-unboundx",
    category: "projects",
    phrases: ["unboundx", "unboundx admin dashboard"],
    keywords: ["unboundx"],
    answer:
      "UnBoundX Admin Dashboard: an internal admin dashboard for managing users, content and analytics with role-based access control, built with React, Node.js/Express and MongoDB.",
  },
  {
    id: "project-bank",
    category: "projects",
    phrases: ["bank management system", "banking system project"],
    keywords: ["bank management", "banking system"],
    answer:
      "Bank Management System: a full-stack banking simulation covering accounts, transactions and statements, built with Java, Spring Boot and SQL.",
  },
  {
    id: "project-wagan",
    category: "projects",
    phrases: ["wagan shop", "wagan"],
    keywords: ["wagan"],
    answer:
      "WAGAN SHOP: a full-stack e-commerce application built during an internship — product catalog, cart/checkout, authentication and product management — using React, Node.js/Express, MongoDB and JWT.",
  },
  {
    id: "project-steganography",
    category: "projects",
    phrases: ["coverless image steganography", "image steganography", "steganography project", "his research", "computer vision"],
    keywords: ["steganography", "research project", "aws services", "opencv", "computer vision"],
    answer:
      "Coverless Image Steganography: research on a cloud-enabled system for secure data transmission using Python, OpenCV, AWS S3 and AWS Lambda, presented at CoCole 2025, NIT Rourkela.",
  },
  {
    id: "project-waveform",
    category: "projects",
    phrases: ["multi waveform generator", "waveform generator", "stm32 project", "embedded systems", "embedded technologies", "hardware used"],
    keywords: ["waveform generator", "stm32 project", "embedded systems", "embedded technologies", "hardware used"],
    answer:
      "Multi-Waveform Generator: an STM32-based embedded systems project generating and validating multiple waveform outputs, built with STM32CubeIDE, Embedded C, HAL, UART and oscilloscope-based testing.",
  },
  {
    id: "projects-overview",
    category: "projects",
    phrases: ["projects has abhishek built", "his projects", "list of projects", "portfolio projects"],
    keywords: ["projects built", "his projects", "project list"],
    answer:
      "Abhishek has built the UnBoundX Admin Dashboard (React/Node.js/MongoDB), a Bank Management System (Java/Spring Boot/SQL), WAGAN SHOP — an e-commerce app built during an internship (React/Node.js/MongoDB/JWT), a coverless image steganography research project (Python/OpenCV/AWS, presented at CoCole 2025, NIT Rourkela), and a Multi-Waveform Generator built on STM32 during an embedded systems internship.",
  },

  // ----------------------------------------------------------- EXPERIENCE
  {
    id: "experience-infopulse",
    category: "experience",
    phrases: ["infopulse technology", "infopulse", "current internship"],
    keywords: ["infopulse", "current internship", "internship experience"],
    answer:
      "Frontend Developer Intern at Infopulse Technology (current): developing responsive, interactive web applications with React.js, JavaScript, HTML5 and CSS3, building reusable UI components and integrating REST APIs.",
  },
  {
    id: "experience-ardent",
    category: "experience",
    phrases: ["ardent computech"],
    keywords: ["ardent", "previously intern", "previous internship", "internship experience"],
    answer:
      "Full-Stack MERN Developer Intern at Ardent Computech Pvt. Ltd. (2021): built responsive web applications using React.js, Node.js and MySQL, with REST APIs, JWT authentication and Git-based workflows.",
  },
  {
    id: "experience-embedded",
    category: "experience",
    phrases: ["c.v. raman global university", "embedded systems intern", "embedded systems", "embedded technologies"],
    keywords: ["embedded systems intern", "cv raman", "embedded systems", "embedded technologies", "previously intern", "previous internship", "internship experience"],
    answer:
      "Embedded Systems Intern at C.V. Raman Global University (2024): developed STM32 applications using Embedded C and HAL libraries, with oscilloscope-based testing and validation.",
  },
  {
    id: "experience-research",
    category: "experience",
    phrases: ["nit rourkela", "cocole 2025", "research student", "his research"],
    keywords: ["nit rourkela", "cocole", "research"],
    answer:
      "Research Student, CoCole 2025 at NIT Rourkela (2025): published research on coverless image steganography using Python, OpenCV, AWS S3 and AWS Lambda.",
  },

  // ------------------------------------------------------------ EDUCATION
  {
    id: "education-btech",
    category: "education",
    phrases: ["b tech", "bachelor of technology"],
    keywords: ["b.tech", "bachelor degree"],
    answer:
      "B.Tech in Computer Science & Information Technology, C.V. Raman Global University, Bhubaneswar (2022–2025, CGPA 8.06/10).",
  },
  {
    id: "education-diploma",
    category: "education",
    phrases: ["diploma"],
    keywords: ["diploma"],
    answer:
      "Diploma in Computer Science & Engineering, Arka Jain University, Jamshedpur (2019–2022, CGPA 8.95/10).",
  },
  {
    id: "education-overview",
    category: "education",
    phrases: ["his education", "educational background", "academic background"],
    keywords: ["his education", "educational background", "academic background", "degree college", "university cgpa"],
    answer:
      "B.Tech in Computer Science & Information Technology from C.V. Raman Global University, Bhubaneswar (2022–2025, CGPA 8.06/10), preceded by a Diploma in Computer Science & Engineering from Arka Jain University, Jamshedpur (2019–2022, CGPA 8.95/10), and Matriculation from Ramakrishna Mission English School, Jamshedpur.",
  },

  // ------------------------------------------------------------ RECRUITER
  {
    id: "recruiter-why-hire",
    category: "recruiter",
    phrases: [
      "why should we hire",
      "why hire abhishek",
      "hire abhishek",
      "why should i hire",
      "good candidate",
      "why is abhishek a good candidate",
      "suitable for a full stack",
      "full stack role",
      "full stack role",
    ],
    keywords: [
      "why hire",
      "good candidate",
      "worth hiring",
      "should i hire",
      "suitable full stack",
      "full stack role",
      "right fit",
      "contribute development team",
      "full stack capability",
      "full stack development",
    ],
    answer:
      "Abhishek's portfolio demonstrates hands-on experience with React, Node.js, Spring Boot and MongoDB through real projects and internships, along with cloud exposure (AWS) via a published research project at NIT Rourkela. His work spans frontend, backend, database and embedded systems, showing he can operate across the stack rather than in a single lane. The best way to judge fit for a specific role is to review the Projects section or his resume directly.",
  },
  {
    id: "recruiter-strengths",
    category: "recruiter",
    phrases: ["his strengths", "key strengths", "what are his strengths", "makes him different", "what makes him different", "strongest technical areas"],
    keywords: ["his strengths", "key strengths", "makes him different", "strongest technical areas"],
    answer:
      "Based on the verified portfolio, Abhishek's strengths are: full-stack web development (React/Node.js/Spring Boot), REST API design with JWT authentication, and applied AWS cloud usage in a research context. He has also worked with embedded systems (STM32) and computer vision (OpenCV), which is less common alongside typical web development experience.",
  },

  // --------------------------------------------------------------- CONTACT
  {
    id: "contact-info",
    category: "contact",
    phrases: ["contact abhishek", "reach abhishek", "his email", "email address"],
    keywords: ["contact abhishek", "reach abhishek", "his email", "his github", "his linkedin"],
    answer:
      "You can contact Abhishek through the Contact section of the portfolio or directly by email at sharmaabhishek121198@gmail.com. His GitHub and LinkedIn profiles are also available in the portfolio footer.",
  },
  {
    id: "contact-resume",
    category: "contact",
    phrases: ["download resume", "his resume", "his cv"],
    keywords: ["download resume", "his resume", "his cv"],
    answer: "You can view or download Abhishek's resume from the Resume link in the navigation bar.",
  },
];

export const FAQ_DEFAULT_ANSWER =
  "The portfolio does not provide enough verified information to answer that. Try asking about Abhishek's projects, skills, experience, education, or how to contact him.";

// --------------------------------------------------------------------------
// Lightweight deterministic retrieval (no embeddings, no vector DB)
// --------------------------------------------------------------------------

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "he",
  "his", "him", "it", "its", "what", "which", "who", "whom", "why", "how",
  "abhishek", "has", "have", "had", "you", "your", "tell", "me", "about",
  "of", "to", "for", "and", "or", "on", "in", "at", "with", "can", "could",
  "would", "should", "i", "we", "there", "any", "some",
]);

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[-.]+/g, " ")
    .replace(/[^\p{L}\p{N}\s+#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Very small stemmer: unifies simple plurals so "technologies" ~ "technology". */
function stem(word: string): string {
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) return word.slice(0, -1);
  return word;
}

function tokenize(input: string): string[] {
  return normalize(input)
    .split(" ")
    .filter(Boolean)
    .map(stem);
}

function contentTokenSet(input: string): Set<string> {
  return new Set(tokenize(input).filter((t) => !STOPWORDS.has(t)));
}

export type ChatMode = "general" | "recruiter";

// Phase 3: Recruiter Mode changes ANSWER FOCUS via retrieval ranking, not
// facts — the underlying knowledge is identical in both modes. A small,
// scale-adjustable boost nudges recruiter-relevant categories up; it never
// filters anything out, so an off-focus but strongly-matched entry can
// still win. Reused by lib/rag.ts so RAG re-ranking follows the same rule.
const RECRUITER_PRIORITY_CATEGORIES = new Set<FaqCategory>([
  "skills",
  "projects",
  "experience",
  "recruiter",
]);

export function recruiterCategoryBoost(category: FaqCategory, mode: ChatMode, scale = 1): number {
  if (mode === "recruiter" && RECRUITER_PRIORITY_CATEGORIES.has(category)) return scale;
  return 0;
}

// Phase 5: Project Deep Dive. Single source of truth for which faq.ts
// entry belongs to which project slug — data/rag-chunks.ts imports this
// instead of maintaining its own copy.
export const FAQ_PROJECT_SLUG: Record<string, string> = {
  "project-unboundx": "unboundx-admin-dashboard",
  "project-bank": "bank-management-system",
  "project-wagan": "wagan-shop",
  "project-steganography": "coverless-image-steganography",
  "project-waveform": "multi-waveform-generator",
};

/**
 * Boosts an entry when it belongs to the currently selected project.
 * Larger scale than the recruiter category boost — a selected project is a
 * strong, explicit signal (the visitor picked it), not a soft ranking
 * preference.
 */
export function projectBoost(entryId: string, selectedProject: string | undefined, scale = 4): number {
  if (!selectedProject) return 0;
  return FAQ_PROJECT_SLUG[entryId] === selectedProject ? scale : 0;
}

function scoreEntry(
  queryNormalized: string,
  queryTokens: Set<string>,
  entry: FaqEntry,
  mode: ChatMode,
  selectedProject?: string
): number {
  let score = 0;

  for (const phrase of entry.phrases) {
    if (queryNormalized.includes(phrase.toLowerCase())) score += 5;
  }

  for (const keyword of entry.keywords) {
    const kwTokens = tokenize(keyword).filter((t) => !STOPWORDS.has(t));
    if (kwTokens.length === 0) continue;
    const allPresent = kwTokens.every((t) => queryTokens.has(t));
    if (allPresent) score += kwTokens.length >= 2 ? 3 : 1;
  }

  if (score > 0) {
    score += recruiterCategoryBoost(entry.category, mode, 1);
    score += projectBoost(entry.id, selectedProject, 4);
  }

  return score;
}

export type RetrievalOptions = {
  limit?: number;
  threshold?: number;
  mode?: ChatMode;
  /** Verified project slug (data/projects.ts) — resolved server-side, never trusted raw from the client. */
  selectedProject?: string;
};

/**
 * Scored, multi-entry retrieval. Returns entries ranked by relevance,
 * deduplicated by id, above `threshold`, capped at `limit`.
 */
export function retrieveKnowledge(query: string, opts: RetrievalOptions = {}): FaqEntry[] {
  const limit = opts.limit ?? 4;
  const threshold = opts.threshold ?? 1;
  const mode = opts.mode ?? "general";

  const qn = normalize(query);
  const qTokens = contentTokenSet(query);

  const scored = faq
    .map((entry) => ({ entry, score: scoreEntry(qn, qTokens, entry, mode, opts.selectedProject) }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: FaqEntry[] = [];
  for (const { entry } of scored) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    results.push(entry);
    if (results.length >= limit) break;
  }

  return results;
}

/**
 * Deterministic fallback answer. Combines multiple relevant entries
 * (e.g. "what projects did he build and what technologies did he use")
 * instead of returning only the first keyword match. `mode` only affects
 * ranking (see recruiterCategoryBoost) — never invents recruiter-only facts.
 *
 * `selectedProject` (Project Deep Dive): when a valid slug is resolved,
 * the project's own verified summary is always included first — this is
 * priority 1 ("selected project context") and does not depend on the
 * message matching any keyword, so generic follow-ups like "what database
 * was used?" still get a correct, project-specific answer in fallback mode.
 */
export function localFaqLookup(question: string, mode: ChatMode = "general", selectedProject?: string): string {
  const project = selectedProject ? findProjectBySlug(selectedProject) : undefined;
  const results = retrieveKnowledge(question, { limit: 3, threshold: 1, mode, selectedProject: project?.slug });

  const parts: string[] = [];
  if (project) parts.push(projectContextSummary(project));
  parts.push(...results.map((r) => r.answer));

  if (parts.length === 0) return FAQ_DEFAULT_ANSWER;
  return parts.join("\n\n");
}

/** Full knowledge dump — used only as a safety net when retrieval finds nothing relevant. */
export function faqAsContext(): string {
  return faq.map((entry) => `- ${entry.answer}`).join("\n");
}

/**
 * Relevance-ranked context for the LLM system prompt, built per-query
 * instead of blindly sending the entire knowledge base every time.
 * Falls back to the full context only when nothing scores above threshold
 * AND no project is selected, so an off-topic or ambiguous query still
 * lets the model see everything it needs to correctly say "not available"
 * rather than guess. When a project is selected, its summary is always
 * priority 1, ahead of any keyword-matched entries (priority 2).
 */
export function retrieveContext(query: string, limit = 6, mode: ChatMode = "general", selectedProject?: string): string {
  const project = selectedProject ? findProjectBySlug(selectedProject) : undefined;
  const results = retrieveKnowledge(query, { limit, threshold: 1, mode, selectedProject: project?.slug });

  const lines: string[] = [];
  if (project) lines.push(`- ${projectContextSummary(project)}`);

  if (results.length > 0) {
    lines.push(...results.map((r) => `- ${r.answer}`));
  } else if (!project) {
    return faqAsContext();
  }

  return lines.join("\n");
}
