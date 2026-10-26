"use client";

import React from "react";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useNavigation } from "@/components/providers/NavigationProvider";
import GetInTouch from "@/components/ui/GetInTouch";
import { Github, Linkedin, Mail, Phone, Download, ArrowUp, ArrowRight } from "@/components/ui/Icons";
import { siFacebook, siInstagram, siX } from "simple-icons";

const NAV_ITEMS = [
  { href: "about", label: "About" },
  { href: "experience", label: "Experience" },
  { href: "projects", label: "Projects" },
  { href: "designs", label: "Designs" },
  { href: "skills", label: "Skills" },
  { href: "education", label: "Education" },
  { href: "contact", label: "Contact" },
];

export default function Footer() {
  const { navigateToSection, navigateToHero } = useNavigation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-line bg-panel2/60 pt-16 pb-12 text-muted">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        {/* Pre-footer Callout */}
        <div className="footer-callout">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Looking Ahead
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-ink leading-tight">
              Have an opportunity, project, or technical conversation in mind?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              {profile.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateToSection("contact")}
              className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm"
            >
              <span>Let&apos;s Connect</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <GetInTouch
              id="footer-social-profiles"
              links={{
                github: profile.github,
                linkedin: profile.linkedin,
                facebook: profile.facebook,
                instagram: profile.instagram,
                x: profile.x,
              }}
            />
          </div>
        </div>

        {/* Main Footer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          {/* Card 1: Identity & Professional Status */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-panel/75 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-purple/35 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-purple/20 bg-purple/10 text-ink font-bold text-base shadow-sm">
                  A
                </span>
                <div>
                  <h4 className="text-base font-bold text-ink tracking-tight">{profile.name}</h4>
                  <p className="text-xs font-semibold text-purple">{profile.title}</p>
                </div>
              </div>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted">
                Based in {profile.currentLocation} with permanent location in {profile.permanentLocation}. Designing responsive interfaces, scalable APIs, and reliable full-stack applications.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-line/60">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.currentRole.title} @ {profile.currentRole.org}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Quick Navigation & Discovery */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-panel/75 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-purple/35 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
                  Navigation
                </h4>
                <span className="text-[11px] font-mono text-muted">Direct Jumps</span>
              </div>
              <nav aria-label="Footer navigation links">
                <ul className="grid grid-cols-2 gap-2 text-xs">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <a
                        href={`#${item.href}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToSection(item.href);
                        }}
                        className="flex items-center justify-between rounded-lg border border-line/50 bg-panel2/40 px-3 py-2 text-muted hover:border-purple/40 hover:bg-panel hover:text-ink transition-all group"
                      >
                        <span>{item.label}</span>
                        <span className="text-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
              <span>Single-page portfolio</span>
              <button
                type="button"
                onClick={navigateToHero}
                className="text-purple hover:underline font-semibold"
              >
                Back to Top ↑
              </button>
            </div>
          </div>

          {/* Card 3: Direct Connect & Resources */}
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-panel/75 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-purple/35 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
                  Direct Contact
                </h4>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Available</span>
              </div>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-between rounded-xl border border-line/60 bg-panel2/40 p-2.5 text-muted hover:border-purple/40 hover:bg-panel hover:text-ink transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-purple/10 text-purple">
                        <Mail className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate font-medium">{profile.email}</span>
                    </div>
                    <span className="text-purple text-xs font-semibold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.phoneHref}
                    className="flex items-center justify-between rounded-xl border border-line/60 bg-panel2/40 p-2.5 text-muted hover:border-purple/40 hover:bg-panel hover:text-ink transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-purple/10 text-purple">
                        <Phone className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                    <span className="text-purple text-xs font-semibold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("resume_download")}
                    className="flex items-center justify-between rounded-xl border border-purple/30 bg-purple/10 p-2.5 text-ink hover:border-purple/60 hover:bg-purple/15 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-purple/20 text-purple">
                        <Download className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-bold">Resume (PDF)</span>
                    </div>
                    <span className="rounded bg-purple/20 px-1.5 py-0.5 text-[10px] font-mono text-purple">
                      Download ↓
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                <span>Usually responds within 24h</span>
              </span>
              <span className="text-[11px] font-mono">IST (UTC+5:30)</span>
            </div>
          </div>
        </div>

        {/* Fluid Wave Art Base & Social Profiles */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-line/60 bg-gradient-to-b from-panel via-panel2/80 to-[#101827]/90 pt-8 pb-3 text-center">
          <div className="relative z-10 px-6">
            <nav className="flex items-center justify-center gap-3 mb-3" aria-label="Footer social profiles">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-muted hover:border-purple hover:bg-purple/15 hover:text-ink transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-muted hover:border-purple hover:bg-purple/15 hover:text-ink transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-muted hover:border-purple hover:bg-purple/15 hover:text-ink transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                  <path d={siInstagram.path} />
                </svg>
              </a>
              <a
                href={profile.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                title="X"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-muted hover:border-purple hover:bg-purple/15 hover:text-ink transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                  <path d={siX.path} />
                </svg>
              </a>
              <a
                href={profile.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-muted hover:border-purple hover:bg-purple/15 hover:text-ink transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                  <path d={siFacebook.path} />
                </svg>
              </a>
            </nav>
            <p className="text-[11px] sm:text-xs text-muted">
              Built with precision &bull; Next.js 15 &bull; TypeScript &bull; Tailwind CSS
            </p>
          </div>

          {/* Subtle Animated Fluid Wave Canvas */}
          <div className="relative mt-2 h-14 w-full overflow-hidden pointer-events-none opacity-40 dark:opacity-60" aria-hidden="true">
            <svg className="portfolio-wave-footer__wave portfolio-wave-footer__wave--back" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,70 C180,20 280,145 470,90 C650,38 770,18 940,78 C1110,138 1260,28 1440,68 L1440,180 L0,180 Z" />
            </svg>
            <svg className="portfolio-wave-footer__wave portfolio-wave-footer__wave--middle" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,92 C190,145 320,25 520,80 C720,135 850,150 1030,85 C1200,22 1320,90 1440,55 L1440,180 L0,180 Z" />
            </svg>
            <svg className="portfolio-wave-footer__wave portfolio-wave-footer__wave--front" viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,112 C210,65 350,130 540,108 C760,82 850,145 1060,105 C1220,74 1320,120 1440,96 L1440,180 L0,180 Z" />
            </svg>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            &copy; {year} {profile.name}. All rights reserved.
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateToHero();
            }}
            className="text-muted hover:text-ink transition-colors inline-flex min-h-11 items-center gap-1.5 font-semibold group"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 text-purple group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}