"use client";

import React from "react";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills & Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-line/80 bg-panel2/60 pt-16 pb-14 text-muted backdrop-blur-md">
      {/* Top subtle gradient accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple/60 to-transparent"
      />

      <div className="mx-auto max-w-shell px-6 sm:px-8">
        {/* Pre-footer Callout */}
        <div className="mb-14 rounded-2xl border border-line bg-panel p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c084fc]">
              Looking Ahead
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white leading-tight">
              Have an opportunity, project, or technical conversation in mind?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {profile.tagline}
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact");
            }}
            className="glow shrink-0 rounded-xl px-6 py-3 text-xs font-bold text-white transition hover:scale-105"
            style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
          >
            Get In Touch
          </a>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr] pb-12 border-b border-line/60">
          {/* Identity & Statement */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg border border-purple/40 bg-gradient-to-br from-purple to-violet text-white font-black text-sm shadow-md"
              >
                A
              </span>
              <span className="text-base font-bold text-white tracking-tight">
                {profile.name}
              </span>
            </div>

            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-muted">
              {profile.title} based in {profile.location}. Designing responsive interfaces, scalable APIs, and reliable full-stack applications.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#86efac]">
              <span className="h-2 w-2 rounded-full bg-[#86efac] animate-pulse" />
              <span>{profile.currentRole.title} @ {profile.currentRole.org}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href);
                    }}
                    className="text-muted hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Profiles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Direct Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-muted hover:text-white transition-colors block truncate"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("github_click")}
                  className="text-muted hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("linkedin_click")}
                  className="text-muted hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("resume_download")}
                  className="text-muted hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Resume (PDF)</span>
                  <span>↓</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted/70">
          <div>
            © {year} {profile.name}. All verified portfolio facts sourced from authenticated projects and academic history.
          </div>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="text-muted hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
