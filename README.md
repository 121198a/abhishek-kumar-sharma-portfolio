# Abhishek Kumar Sharma — Personal Portfolio

A production-grade, single-architecture personal portfolio built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. The repository consolidates all verified portfolio data, research publications, internships, projects, and an AI assistant into a unified, high-performance, cost-conscious web application.

---

## 1. Project Overview

- **Owner:** Abhishek Kumar Sharma
- **Role:** Frontend & Full-Stack Developer
- **Location:** Jharkhand, India
- **Architecture:** Unified Next.js 15 App Router (Single Repository & Single Runtime)
- **Deployment:** Vercel Hobby (Zero infrastructure cost)
- **Design Philosophy:** Free-tier first, verified data only, strictly zero hallucination

---

## 2. Tech Stack

- **Framework:** Next.js 15.5.21 (React 18.3.1, App Router, Server Components by default)
- **Language:** TypeScript 5.4.5 (Strict mode enabled)
- **Styling:** Tailwind CSS 3.4.4 with custom design tokens, PostCSS, Autoprefixer
- **Smooth Scrolling:** Lenis (`lenis` ^1.3.26) with official CSS integration and reduced-motion guardrails
- **Motion & Parallax:** Lightweight custom RAF-based scroll parallax, intersection-observer reveals, and magnetic interactions
- **AI Assistant:** NVIDIA NIM API integration with deterministic local keyword/phrase fallback (`data/faq.ts`)
- **Email Delivery:** Resend API integration with spam checks, in-memory rate limiting, and honeypot bot protection
- **Font & Assets:** Next.js self-hosted Google Font (`Inter`), optimized SVG icons, Next Image optimization

---

## 3. Architecture & Design Principles

### Single Source of Truth
All personal, academic, project, skill, and career facts reside strictly in the typed `data/` layer:
- `data/profile.ts`: Verified biographical facts, contact coordinates, social URLs, current internship role.
- `data/projects.ts`: Categorized real projects, slugs, implementation approaches, tags, and server-side deep dive resolver.
- `data/experience.ts`: Verified timeline of work experience and research internships.
- `data/education.ts`: Academic degrees, institutions, and verified CGPA / percentages.
- `data/skills.ts`: Categorized technologies (Languages, Frontend, Backend, Databases, Cloud & Tools).
- `data/faq.ts`: Scored knowledge retrieval dataset covering 91+ recruiter query evaluation benchmarks.

### Zero Hallucination & Fact Grounding
- No unsupported statistics or fake metric counters.
- No randomized skill percentage bars (removed legacy `Math.random()` simulation).
- Dynamic stats computed at build/render time from real data arrays.
- Deterministic fallback answers when third-party AI keys are unconfigured.

---

## 4. Final Folder Structure

```
Personal_Portfolio/
│
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   │   └── route.ts         # Privacy-safe, consent-gated event logging
│   │   ├── chat/
│   │   │   └── route.ts         # AI assistant endpoint (NVIDIA + local fallback)
│   │   └── contact/
│   │       └── route.ts         # Contact submission (Resend + rate limiter + honeypot)
│   │
│   ├── error.tsx                # Branded client-side error boundary
│   ├── globals.css              # Tailwind base, grid overlays, Lenis utilities
│   ├── icon.svg                 # Optimized SVG favicon
│   ├── layout.tsx               # Root layout, Google Fonts, JSON-LD Schema
│   ├── not-found.tsx            # Branded 404 page
│   ├── page.tsx                 # Canonical static homepage
│   ├── robots.ts                # Dynamic robots.txt route
│   └── sitemap.ts               # Dynamic sitemap.xml route
│
├── components/
│   ├── motion/
│   │   ├── Magnetic.tsx         # Subtle CTA hover attraction
│   │   ├── Parallax.tsx         # Restrained scroll parallax
│   │   └── Reveal.tsx           # IntersectionObserver entrance reveals
│   │
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx # Lenis smooth scroll provider + anchor listener
│   │
│   ├── ui/
│   │   ├── BackToTop.tsx        # Scroll-to-top floating action
│   │   ├── Badge.tsx            # Reusable status and tag badges
│   │   ├── Container.tsx        # Standard shell container
│   │   ├── ScrollProgress.tsx   # Top gradient scroll progress indicator
│   │   └── SectionHeading.tsx   # Standardized section headings
│   │
│   ├── About.tsx                # Verified narrative & current engagement
│   ├── AIChat.tsx               # Assistant dialog (data-lenis-prevent, recruiter mode)
│   ├── AIIntro.tsx              # Interactive prompt triggers & assistant launcher
│   ├── Capabilities.tsx         # Core engineering competencies
│   ├── Contact.tsx              # Validated contact form + direct email fallback
│   ├── CookieBanner.tsx         # Privacy-conscious consent banner
│   ├── Education.tsx            # Academic qualifications timeline
│   ├── Footer.tsx               # Final CTA, navigation, verified links, back-to-top
│   ├── Hero.tsx                 # Headline, CTAs, watermark, orbital graphic visual
│   ├── Nav.tsx                  # Navbar, active link tracker, accessible mobile drawer
│   ├── Projects.tsx             # Category filter, project cards, AI deep dive button
│   ├── RevealObserver.tsx       # Global intersection observer fallback
│   └── SkillsExperience.tsx     # Grouped technical stack & experience timeline
│
├── data/
│   ├── education.ts             # Verified degree entries & CGPA
│   ├── embeddings.generated.json# Precomputed vector embeddings for RAG
│   ├── experience.ts            # Verified internships & research roles
│   ├── faq.ts                   # Structured knowledge base + fallback retriever
│   ├── profile.ts               # Canonical profile details & verified URLs
│   ├── projects.ts              # Canonical project array & context summaries
│   ├── rag-chunks.ts            # Text chunks for embedding generation
│   └── skills.ts                # Grouped technical skill items
│
├── lib/
│   ├── analytics.ts             # Consent management & client event dispatcher
│   ├── embeddings.ts            # NVIDIA embedding client & cosine similarity
│   ├── env.ts                   # Server-side environment variable flags & limits
│   ├── project-ai-event.ts      # Custom browser events for project context & chat
│   ├── rag.ts                   # Semantic retrieval module
│   ├── rate-limit.ts            # In-memory IP rate limiter & daily token tracker
│   ├── site.ts                  # Canonical domain & site configuration
│   └── validate.ts              # Server-side input sanitizer & email validator
│
├── public/
│   ├── hero-graphic.svg         # Geometric vector graphic
│   └── resume.pdf               # Canonical verified resume document
│
├── scripts/
│   ├── build-embeddings.ts      # RAG indexer (generates embeddings.generated.json)
│   └── cost-check.mjs           # Infrastructure cost auditor
│
├── tests/
│   ├── recruiter-questions.ts   # 91 curated recruiter test cases
│   ├── run-retrieval-tests.ts   # Retrieval & anti-hallucination test runner
│   └── smoke-test.ts            # End-to-end production smoke test
│
├── .env.example                 # Documented environment variables template
├── COST_CONTROL.md              # Free-tier policy & budget limits
├── next.config.mjs              # Next.js production configuration & security headers
├── package.json                 # Dependencies & project scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Custom Tailwind theme tokens & content globs
└── tsconfig.json                # Strict TypeScript configuration
```

---

## 5. Getting Started (Windows PowerShell & Terminal)

### Prerequisites
- Node.js 18.18.0 or newer
- npm 9.0.0 or newer

### Installation
Clone or navigate to the repository directory:

```powershell
cd "C:\Users\HP\Desktop\Project\Personal_Portfolio"

npm install
```

### Environment Configuration
Copy the sample environment file:

```powershell
Copy-Item .env.example .env.local
```

> **Zero Key Requirement:** The site works out-of-the-box in local development with no external API keys. The AI assistant uses deterministic local retrieval, and the contact form gracefully explains that direct email is available.

### Run Development Server
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Build & Production Commands

### Type Checking & Linting
```powershell
npm run lint
```

### Run Knowledge & Recruiter Retrieval Tests
```powershell
npm run test:recruiter
```

### Run End-to-End Smoke Tests
Validates server compilation, static assets, robots, sitemap, AI fallback, honeypot spam protection, and contact validation:
```powershell
npm run test:smoke
```

### Production Build
```powershell
npm run build
```

### Start Production Server
```powershell
npm start
```

---

## 7. Environment Variables Reference

| Variable | Required? | Default | Scope | Description |
| :--- | :---: | :---: | :---: | :--- |
| `NEXT_PUBLIC_SITE_URL` | Optional | `https://abhishek-portfolio.vercel.app` | Public | Canonical base domain used for SEO, Open Graph, Sitemap, and Robots. |
| `ENABLE_AI` | Optional | `true` | Server | Enable or disable the AI assistant feature across the application. |
| `ENABLE_ANALYTICS` | Optional | `false` | Server | Enable or disable same-origin, consent-gated event tracking. |
| `ENABLE_CONTACT_FORM` | Optional | `true` | Server | Enable or disable the API contact endpoint. |
| `ENABLE_RAG` | Optional | `true` | Server | Enable semantic vector retrieval alongside structured FAQ matching. |
| `NVIDIA_API_KEY` | Optional | *(empty)* | Server | NVIDIA NIM API key for LLM generation and embeddings. |
| `NVIDIA_BASE_URL` | Optional | `https://integrate.api.nvidia.com/v1` | Server | NVIDIA NIM base endpoint. |
| `NVIDIA_MODEL` | Optional | `openai/gpt-oss-20b` | Server | Language model for portfolio Q&A. |
| `RESEND_API_KEY` | Optional | *(empty)* | Server | Resend API key for delivering contact form messages. |
| `CONTACT_TO_EMAIL` | Optional | `sharmaabhishek121198@gmail.com` | Server | Destination email address for contact form submissions. |
| `CONTACT_FROM_EMAIL` | Optional | `onboarding@resend.dev` | Server | Verified sender address on your Resend domain. |

---

## 8. AI & RAG Setup

### Two Operational Modes
1. **Offline / Free-Tier Deterministic Mode (Default without API Key):**
   - The assistant uses scored multi-keyword and phrase retrieval across `data/faq.ts`.
   - Returns instantaneous, accurate, verified answers without network requests or API costs.
   - Guaranteed 0% hallucination risk.
2. **Online Augmented Generation Mode (When `NVIDIA_API_KEY` is provided):**
   - Retrieves verified portfolio context from `data/faq.ts` and `data/embeddings.generated.json`.
   - Sends strictly grounded system instructions to NVIDIA NIM.
   - Follows Recruiter Mode constraints (`Fact → Evidence → Relevance → Answer`) when selected.

### Knowledge Re-Indexing
Whenever `data/faq.ts` or `data/rag-chunks.ts` are updated, regenerate the local embeddings vector index by running:
```powershell
npm run index:knowledge
```
*(Requires `NVIDIA_API_KEY` set in your environment).*

---

## 9. Contact Form & Email Delivery

- Real visitors submit their Name, Email, and Message.
- A hidden honeypot field (`company`) silently catches automated spam bots.
- Messages are checked for spam patterns, control characters are stripped, and submissions are rate-limited to 3 per IP per hour.
- If `RESEND_API_KEY` is configured, the message is sent via Resend.
- If Resend is unconfigured, the UI displays a clear explanation with direct mailto fallback links to `sharmaabhishek121198@gmail.com`.

---

## 10. Vercel Deployment Guide

1. Push your repository to GitHub:
   ```powershell
   git add .
   git commit -m "feat: complete portfolio refactor and production hardening"
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com), select **Add New Project** and import your repository.
3. Keep the default Framework Preset as **Next.js**.
4. Configure Environment Variables in the Vercel project settings:
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com` or your Vercel deployment URL)
   - `NVIDIA_API_KEY` (optional)
   - `RESEND_API_KEY` (optional)
   - `CONTACT_TO_EMAIL` (optional)
5. Click **Deploy**.
6. Verify deployment:
   - Homepage loads with zero console errors.
   - Resume downloads at `/resume.pdf`.
   - Sitemap loads at `/sitemap.xml`.
   - Robots directive loads at `/robots.txt`.
   - Contact form and AI assistant operate seamlessly.

---

## 11. Troubleshooting

### Port 3000 Already in Use
If another process is using port 3000 on Windows PowerShell:
```powershell
netstat -ano | findstr :3000
```
Locate the PID (last number in the output) and terminate it:
```powershell
Stop-Process -Id <PID> -Force
```

### Dependency Cache Corruption
To perform a clean installation from lockfile:
```powershell
Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue
npm ci
```

### Contact Form 503 Message
If the contact form reports `"Email delivery isn't configured yet"`:
- Ensure `RESEND_API_KEY` is provided in `.env.local` or Vercel environment variables.
- When using Resend's free `onboarding@resend.dev` sender, `CONTACT_TO_EMAIL` must match the account owner's registration email.

---

## 12. Security, Performance & Accessibility

- **Security Headers:** Enforces `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and strict `Permissions-Policy`.
- **Zero Client Leakage:** API keys and sensitive tokens are strictly server-side; none are prefixed with `NEXT_PUBLIC_`.
- **Performance:** Server Components by default; client components scoped strictly to interactive elements; total First Load JS is ~131 kB.
- **Accessibility:** Semantic HTML5 landmarks, ARIA dialog and expanded states, full keyboard navigation, Escape-to-close on drawers/dialogs, focus trapping, and full compliance with `prefers-reduced-motion`.
