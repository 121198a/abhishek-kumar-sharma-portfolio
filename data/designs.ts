/**
 * Design Showcase: single source of truth.
 *
 * Used by:
 *   - components/Designs.tsx            (categories + cards UI)
 *   - scripts/design/build.mjs          (builds each project into public/)
 *   - scripts/design/screenshots.mjs    (captures real previews)
 *   - scripts/design/verify.mjs         (checks every link / asset / preview)
 *
 * Conventions (derived from `category.id` + `project.slug`, never hand-typed):
 *   source   design-projects-src/<category>/<slug>/        (NOT served)
 *   output   public/design-projects/<category>/<slug>/     (served, built)
 *   URL      /design-projects/<category>/<slug>
 *   preview  public/design-previews/<category>/<slug>.jpg
 *
 * To add a design:   1) copy its folder to design-projects-src/<category>/<slug>/
 *                    2) add one entry below
 *                    3) npm run design:build -- <category>/<slug>
 *                       npm run design:screenshots -- <category>/<slug>
 * To add a category: add a DesignCategory entry (status "coming-soon" until it has projects).
 *
 * This file must stay dependency-free (no "@/..." imports): the Node scripts import it directly.
 */

export type DesignStatus = "live" | "coming-soon";

export type DesignProject = {
  /** URL + folder name. Lowercase, hyphenated. */
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** "coming-soon" renders a labelled placeholder card with no link. */
  status: DesignStatus;
  /**
   * How the project is produced. Auto-detected when omitted:
   *   "vite"   has package.json with a build script -> installed, built with the right base path
   *   "static" no package.json -> copied as-is, with relative asset URLs made absolute
   */
  kind?: "vite" | "static";
  /** static projects only: files that must NOT be published (e.g. an unused source file). */
  staticExclude?: string[];
  /** Optional overrides for the automated screenshot. */
  preview?: { width?: number; height?: number; waitMs?: number };
};

export type DesignCategory = {
  /** URL + folder name. */
  id: string;
  title: string;
  description: string;
  status: DesignStatus;
  projects: DesignProject[];
};

export const DESIGN_URL_ROOT = "/design-projects";
export const DESIGN_PREVIEW_ROOT = "/design-previews";

export const designCategories: DesignCategory[] = [
  {
    id: "auth",
    title: "Auth Pages",
    description: "Sign-in, sign-up and password-reset experiences, each with its own personality.",
    status: "live",
    projects: [
      {
        slug: "door-auth",
        title: "Door Auth Page",
        description:
          "Log in, sign up and reset-password flow with a submit button that runs away while the form is invalid and a door-opening mascot on success.",
        tags: ["React", "Vite", "Animation"],
        status: "live",
      },
      {
        slug: "lamp-auth",
        title: "Lamp Auth Page",
        description:
          "LuminaVault split-screen sign-in with a dimmable chandelier, live password-strength feedback and dark and light themes.",
        tags: ["React", "Tailwind CSS", "Vite"],
        status: "live",
      },
      {
        slug: "runway-auth",
        title: "Runway Auth Page",
        description: "Another authentication concept. Coming soon.",
        tags: [],
        status: "coming-soon",
      },
      {
        slug: "motion-auth",
        title: "Motion Auth Page",
        description:
          "Animated sign-in and sign-up with live validation, a terms-and-conditions dialog and smooth scrolling. Built without a framework.",
        tags: ["HTML", "Tailwind CSS 4", "daisyUI", "JavaScript"],
        status: "live",
      },
      {
        slug: "slider-auth",
        title: "Slider Auth Page",
        description:
          "A single card whose image panel slides across to switch between Sign In and Sign Up.",
        tags: ["HTML", "CSS", "JavaScript"],
        status: "live",
        // login.jsx is an alternate React version that nothing loads; do not publish it.
        staticExclude: ["login.jsx"],
      },
    ],
  },
  {
    id: "navbar",
    title: "Navigation Bars",
    description: "Navigation bars with distinctive shapes, scenes and motion.",
    status: "live",
    projects: [
      {
        slug: "company-navbar",
        title: "Company Navbar",
        description:
          "Futuristic premium navbar for USNAYA TECHWORKS SOLUTIONS, animated with Framer Motion.",
        tags: ["React", "TypeScript", "Framer Motion", "CSS Modules"],
        status: "live",
      },
      {
        slug: "handle-navbar",
        title: "Handle Navbar",
        description:
          "Three navigation bars whose silhouettes match their brands: a bone, a bike handlebar and a trail knife, with glass effects.",
        tags: ["React", "Vite", "CSS Modules"],
        status: "live",
      },
      {
        slug: "highway-navbar",
        title: "Highway Navbar",
        description:
          "USNAYA Motors navbar with an animated car and bike, day and night themes and a simulated live speedometer.",
        tags: ["React", "Framer Motion", "GSAP"],
        status: "live",
      },
      {
        slug: "trailverse-navbar",
        title: "Trailverse Navbar",
        description:
          "TrailVerse outdoor-themed navbar with an animated landscape, light and dark themes and adjustable animation speed.",
        tags: ["React", "Framer Motion", "GSAP"],
        status: "live",
      },
    ],
  },
  {
    id: "website",
    title: "Websites",
    description: "Full-scale 3D interactive web experiences and digital showcases.",
    status: "live",
    projects: [
      {
        slug: "usnaya-techwork-solution",
        title: "USNAYA Techwork Solution",
        description:
          "Interactive 3D virtual office tour with real-time camera controls, department hubs, team dialogues, and immersive navigation.",
        tags: ["React 19", "Three.js", "R3F", "Vite", "TypeScript"],
        status: "live",
        preview: { width: 1280, height: 800, waitMs: 3500 },
      },
    ],
  },
  {
    id: "dashboards",
    title: "Dashboards",
    description: "Data-rich dashboard layouts.",
    status: "coming-soon",
    projects: [],
  },
  {
    id: "buttons",
    title: "Buttons",
    description: "Interactive button designs.",
    status: "coming-soon",
    projects: [],
  },
  {
    id: "footers",
    title: "Footers",
    description: "Footer layouts and treatments.",
    status: "coming-soon",
    projects: [],
  },
];

/** Where a live project is served. No trailing slash (see rewrites in next.config.mjs). */
export function designProjectUrl(category: DesignCategory, project: DesignProject): string {
  return `${DESIGN_URL_ROOT}/${category.id}/${project.slug}`;
}

/** Where the project's real-output screenshot is expected. */
export function designPreviewUrl(category: DesignCategory, project: DesignProject): string {
  return `${DESIGN_PREVIEW_ROOT}/${category.id}/${project.slug}.jpg`;
}

/** Number of projects a visitor can actually open. */
export function liveProjectCount(category: DesignCategory): number {
  return category.projects.filter((p) => p.status === "live").length;
}
