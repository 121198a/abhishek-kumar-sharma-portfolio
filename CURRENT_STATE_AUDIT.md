# Current State Audit (Phase 0 Baseline)

**Date:** 2026-10-07  
**Branch:** `upgrade/portfolio-v2`  
**Checkpoint Tag:** `pre-upgrade-20261007` / `pre-upgrade-20261007-v2`  
**Git Commit:** `1b6a64c`  
**Operating System:** Windows (x64)

---

## 1. Environment & Stack Identity

| Dimension | Specification / Version | Evidence |
|---|---|---|
| **Framework** | Next.js 15.5.27 (App Router) | `package.json` (`"next": "15.5.27"`) |
| **React** | 18.3.1 (React DOM 18.3.1) | `package.json` |
| **Node.js Runtime** | Node.js v24.17.0 (engine spec: `>=18.18.0`) | `process.version`, `package.json` |
| **Styling** | Tailwind CSS 3.4.4 + Autoprefixer 10.4.19 + PostCSS 8.5.26 | `tailwind.config.ts`, `app/globals.css` |
| **TypeScript** | TypeScript 5.4.5 | `tsconfig.json` |
| **Smooth Scrolling** | Lenis 1.3.26 | `components/providers/SmoothScrollProvider.tsx` |
| **Validation** | Zod 4.6.5 | `lib/validate.ts` |
| **Email Service** | Resend 4.0.0 | `app/api/contact/route.ts` |
| **Iconography** | Lucide-React 1.52.0 + Simple-Icons 16.34.0 | `components/ui/Icons.tsx`, `components/Skills.tsx` |
| **AI Integration** | NVIDIA NIM API (`openai/gpt-oss-20b`) + Nemotron Embeddings | `app/api/chat/route.ts`, `lib/embeddings.ts` |
| **Hosting Platform** | Vercel Hobby (Configured for static/edge-first rendering) | `next.config.mjs`, `docs/DEPLOYMENT.md` |

---

## 2. Owner-Confirmed Facts — Codebase Verification

1. **Video in hero or sections**:
   - **Status:** **VERIFIED**
   - **Evidence:** `components/Hero.tsx` renders `<video src={videoSrc} poster="/videos/hero/hero-poster.png" autoPlay muted loop playsInline />` using media manifest from `lib/media.ts` / `public/videos/hero/hero-1080.mp4` (3.45 MB).
2. **Motion library for animation**:
   - **Status:** **VERIFIED WITH ARCHITECTURAL DETAIL**
   - **Evidence:** Neither `framer-motion` nor `motion` is installed in `package.json`. Animations are implemented using native, zero-runtime React components in `components/motion/` (`Magnetic.tsx`, `Reveal.tsx`, `PageTransition.tsx`, `Tilt3D.tsx`, `Parallax.tsx`) backed by `requestAnimationFrame`, `IntersectionObserver`, and hardware-accelerated CSS `transform`/`opacity` transitions.
3. **Lenis for smooth scrolling**:
   - **Status:** **VERIFIED**
   - **Evidence:** `lenis` (`^1.3.26`) is initialized in `components/providers/SmoothScrollProvider.tsx` with duration `1.1` and `smoothWheel: true`.
4. **Kinetic typography (animated text)**:
   - **Status:** **VERIFIED**
   - **Evidence:** Implemented in `components/Hero.tsx` (kinetic character letter splitting) and `components/ui/RotatingText.tsx` using CSS keyframes `rotatePhraseIn` in `app/globals.css`.
5. **Mobile responsiveness confirmed good**:
   - **Status:** **VERIFIED**
   - **Evidence:** Tested at 320px–390px viewports; interactive card sliders enabled in `Projects` and `Education` for small screens; zero document horizontal overflow (`scrollWidth === clientWidth`).
6. **Cards exist in several sections**:
   - **Status:** **VERIFIED**
   - **Evidence:** Cards implemented in `Projects.tsx`, `Education.tsx`, `About.tsx` (credentials card), and `Contact.tsx`.

---

## 3. Baseline Storage & Performance Metrics

### Disk Space Breakdown
| Scope | Size | Notes |
|---|---|---|
| **Total Working Directory** | **1,056.2 MB (~1.05 GB)** | Measured on disk |
| **`node_modules/`** | 598.78 MB | Dev/build dependencies, Sharp, esbuild, TypeScript |
| **`.next/`** | 436.93 MB | Build artifacts, webpack cache, server chunks |
| **`.git/`** | 12.13 MB | Complete Git history (12 commits) |
| **`public/`** | 6.73 MB | Video asset (3.45 MB), PNG images (2.67 MB), PDF (72 KB) |
| **`data/`** | 1.41 MB | Generated embeddings JSON (1.39 MB), TypeScript data files |
| **Source Code (`app/`, `components/`, `lib/`)** | 0.27 MB | Lightweight codebase |

> **Conclusion on ~1 GB Project Size:** 98.1% of the project size is caused by `.next/` (436.9 MB) and `node_modules/` (598.8 MB). These are untracked build artifacts and local package installations, NOT part of the Git repository or the production bundle. The true Git source repository is only ~20 MB.

### Build Metrics (Next.js 15.5.27 Production Build)
- **Compilation Time:** 2.0s – 2.3s
- **Lint Check:** 0 warnings, 0 errors
- **TypeScript Typecheck (`npx tsc --noEmit`):** 0 errors
- **Shared First Load JS:** **103 kB**
  - `chunks/255-ce8c7c75002f810b.js`: 46.5 kB
  - `chunks/4bd1b696-c023c6e3521b1417.js`: 54.2 kB
  - Other shared chunks: 2.03 kB
- **Page Routes:**
  - `/` (Home): 47.6 kB page JS (150 kB First Load JS)
  - `/_not-found`: 140 B (103 kB First Load JS)
  - `/api/analytics`: 140 B (Dynamic)
  - `/api/chat`: 140 B (Dynamic)
  - `/api/contact`: 140 B (Dynamic)
  - `/opengraph-image`: 140 B (Static)
  - `/robots.txt`: 140 B (Static)
  - `/sitemap.xml`: 140 B (Static)

---

## 4. Routes Map

| Route | Type | Description |
|---|---|---|
| `/` | Static (SSG) | Main portfolio page with continuous hero-scrolling and isolated navigation modes |
| `/_not-found` | Static (SSG) | Custom branded 404 page |
| `/opengraph-image` | Static (Image) | Dynamic Open Graph social sharing image |
| `/robots.txt` | Static | Search engine crawler rules |
| `/sitemap.xml` | Static | Search engine XML index |
| `/api/contact` | Dynamic (POST) | Contact form submission handler with Resend integration |
| `/api/chat` | Dynamic (POST) | NVIDIA NIM AI assistant endpoint with local RAG and FAQ fallback |
| `/api/analytics` | Dynamic (POST) | Privacy-friendly in-memory analytics collection endpoint |

---

## 5. API Contracts & Security Audit

### 1. `/api/contact`
- **Method:** `POST` (All other methods return 405 Method Not Allowed)
- **Validation:** Server-side Zod schema (`contactSchema` in `lib/validate.ts`)
  - `name`: String, 1–120 characters, control character stripping (`stripControlChars`)
  - `email`: String, max 254 chars, RFC-valid email regex with CRLF injection rejection
  - `message`: String, 1–2000 characters, spam heuristic check (`looksLikeSpam`)
  - `phone`: Optional string, max 40 characters
  - `subject`: Optional string, max 160 characters
  - `honeypot`: Silent rejection (returns 200 to bots without sending email)
- **Rate Limiting:** `checkRateLimit` enforces 3 submissions per IP per hour.
- **Payload Cap:** Max 20,000 bytes enforced by `request-guard.ts` before parsing.
- **Origin Guard:** Same-origin validation with cross-origin 403 block.

### 2. `/api/chat`
- **Method:** `POST` (All other methods return 405)
- **Validation:** Server-side Zod schema (`chatSchema`)
  - `message`: Required non-empty string, clamped to 400 characters (`aiLimits.maxInputChars`)
  - `history`: Sanitized to max 2 turns, max 300 chars each
  - `selectedProject`: Resolved server-side against verified project slugs in `data/projects.ts`
- **Rate Limiting:** In-memory limiter enforces 5 requests per IP per minute; daily budget cap of 20 calls.
- **Session Cap:** Signed HMAC-SHA256 cookie (`session-cap.ts`) enforces max 10 messages per user session.
- **Fallback:** Complete local FAQ retrieval fallback (`data/faq.ts`) when offline or budget exhausted.

### 3. `/api/analytics`
- **Method:** `POST` (All other methods return 405)
- **Validation:** Strict payload format, maximum 40 requests per IP per minute.
- **Privacy:** Consent-gated via Cookie Banner (`ENABLE_ANALYTICS`), no PII or message content stored.

---

## 6. Environment Variables Contract (Names Only)

### Client-Accessible Variables (`NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_SITE_URL` (Base URL for canonical metadata and sitemap)

### Server-Only Variables (Zero Client Exposure)
- `ENABLE_AI` (Feature flag, default `true`)
- `ENABLE_ANALYTICS` (Feature flag, default `false`)
- `ENABLE_CONTACT_FORM` (Feature flag, default `true`)
- `ENABLE_RAG` (Feature flag, default `true`)
- `NVIDIA_API_KEY` (NVIDIA NIM AI endpoint authentication)
- `NVIDIA_BASE_URL` (NVIDIA API base endpoint)
- `NVIDIA_MODEL` (NVIDIA chat completion model identifier)
- `NVIDIA_EMBEDDING_MODEL` (NVIDIA embedding model identifier)
- `AI_DAILY_LIMIT` (Daily call quota)
- `AI_MAX_MESSAGES_PER_SESSION` (Per-session turn quota)
- `AI_MAX_INPUT_CHARS` (Input length ceiling)
- `AI_MAX_OUTPUT_TOKENS` (Output token ceiling)
- `AI_REQUEST_TIMEOUT_MS` (Upstream timeout)
- `AI_RATE_LIMIT_PER_IP_PER_MINUTE` (Per-IP flood protection)
- `RESEND_API_KEY` (Resend email delivery token)
- `CONTACT_TO_EMAIL` (Destination mailbox)
- `CONTACT_FROM_EMAIL` (Sender address)
- `CONTACT_RATE_LIMIT_PER_IP_PER_HOUR` (Per-IP email limit)
- `CHAT_SESSION_SECRET` (Cryptographic key for signing session cookies)
- `GITHUB_TOKEN` (Read-only token for server-side repository data cache)

---

## 7. Component Usage & Dependency Analysis

| Component | Status | Importers / Renderers | Notes |
|---|---|---|---|
| `Nav.tsx` | **Active** | `app/page.tsx` | Fixed sticky header with desktop & mobile drawer |
| `Hero.tsx` | **Active** | `PortfolioContent.tsx` | Kinetic typography, 3D video, stats bar |
| `PortfolioContent.tsx` | **Active** | `app/page.tsx` | Orchestrates continuous view vs isolated section view |
| `About.tsx` | **Active** | `PortfolioContent.tsx` | Bio, credentials, engineering approach |
| `Experience.tsx` | **Active** | `PortfolioContent.tsx` | Production internships & research roles timeline |
| `Projects.tsx` | **Active** | `PortfolioContent.tsx` | Desktop grid + Mobile interactive card slider |
| `Designs.tsx` | **Active** | `PortfolioContent.tsx` | UI/UX design showcase with card slider architecture |
| `Skills.tsx` | **Active** | `PortfolioContent.tsx` | Categorized tech stack grid with Simple-Icons & Lucide |
| `Education.tsx` | **Active** | `PortfolioContent.tsx` | Academic milestones timeline + Mobile slider |
| `AIIntro.tsx` | **Active** | `PortfolioContent.tsx` | Interactive knowledge base teaser & prompt triggers |
| `Contact.tsx` | **Active** | `PortfolioContent.tsx` | Country-code enabled inquiry form with Resend |
| `Footer.tsx` | **Active** | `app/page.tsx` | Global footer with direct links and navigation |
| `AIChat.tsx` | **Active** | `LazyWidgets.tsx` | Floating AI assistant dialog |
| `CookieBanner.tsx` | **Active** | `LazyWidgets.tsx` | Analytics consent banner |
| `LazyWidgets.tsx` | **Active** | `app/page.tsx` | Dynamically imports AIChat and CookieBanner |
| `InteractiveCardSlider.tsx` | **Active** | `Projects.tsx`, `Education.tsx`, `Designs.tsx` | Mobile-only touch/swipe slider with sticky detail |
| `Capabilities.tsx` | *Unreferenced* | *None* | Capabilities are already rendered directly inside `About.tsx` |
| `GitHubActivity.tsx` | *Unreferenced* | *None* | Standalone GitHub server component, not rendered in page |
| `ResponsiveVideo.tsx` | *Unreferenced* | *None* | Alternative video player with media-policy bandwidth checks |
| `Parallax.tsx` | *Unreferenced* | *None* | Utility motion wrapper |
| `Tilt3D.tsx` | *Unreferenced* | *None* | 3D interactive tilt motion wrapper |
| `BackToTop.tsx` | *Unreferenced* | *None* | Standalone back-to-top button (Footer has its own inline link) |

---

## 8. Findings & Security Review Sorted by Severity

### Findings
1. **Low Risk — Unreferenced Components**:
   - `Capabilities.tsx`, `GitHubActivity.tsx`, `ResponsiveVideo.tsx`, `Parallax.tsx`, `Tilt3D.tsx`, `BackToTop.tsx` exist in `components/` but are not imported into the active page layout. They add minor disk weight (~12 KB total) but are NOT included in the client bundle.
2. **Low Risk — Developer Toolchain Vulnerabilities in `npm audit`**:
   - 10 vulnerabilities flagged by `npm audit` in build-time devDependencies (`braces`, `micromatch`, `source-map-js`, `postcss-selector-parser` under Tailwind 3 and Next.js compiler). None affect client runtime code. Upgrading Tailwind to v4 is breaking and must be avoided.
3. **Informational — Media Size Optimization**:
   - `public/videos/hero/hero-1080.mp4` is 3.45 MB. Works smoothly on desktop/broadband, but could benefit from poster prioritization on mobile data savers.
   - Character sheet PNGs in `public/images/` total ~2.67 MB.
4. **Clean Status — Secrets & Git History**:
   - Zero committed secrets in Git history (`re_*`, `nvapi-*`, `ghp_*` patterns scanned across all commits).
   - `.env.local` is strictly ignored in `.gitignore`.
   - Security headers configured in `next.config.mjs` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, etc.).
