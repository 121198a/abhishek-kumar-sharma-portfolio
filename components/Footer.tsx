"use client";

import React from "react";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useNavigation } from "@/components/providers/NavigationProvider";
import GetInTouch from "@/components/ui/GetInTouch";
import { Github, Linkedin, Mail, Phone, Download, ArrowUp } from "@/components/ui/Icons";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const { navigateToSection, navigateToHero } = useNavigation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-line bg-panel2/60 pt-16 pb-14 text-muted">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        {/* Pre-footer Callout */}
        <div className="mb-14 border-y border-line py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-purple">
              Looking Ahead
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-ink leading-tight">
              Have an opportunity, project, or technical conversation in mind?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {profile.tagline}
            </p>
          </div>
          <GetInTouch
            id="footer-social-profiles"
            links={{
              github: profile.github,
              linkedin: profile.linkedin,
              facebook: profile.facebook,
              instagram: profile.instagram,
              x: profile.x,
            }}
            className="shrink-0"
          />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr] pb-12 border-b border-line/60">
          {/* Identity & Statement */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-panel2 text-ink font-bold text-sm shadow-xs"
              >
                A
              </span>
              <span className="text-base font-bold text-ink tracking-tight">
                {profile.name}
              </span>
            </div>

            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-muted">
              {profile.title}, currently based in {profile.currentLocation} with a permanent location in {profile.permanentLocation}. Designing responsive interfaces, scalable APIs, and reliable full-stack applications.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#86efac]">
              <span className="h-2 w-2 rounded-full bg-[#86efac] animate-pulse" />
              <span>{profile.currentRole.title} @ {profile.currentRole.org}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection(item.href.replace(/^#/, ""));
                    }}
                    className="text-muted hover:text-ink transition-colors inline-block py-3"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Profiles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Direct Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-muted hover:text-ink transition-colors inline-flex items-center gap-2 py-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-purple" />
                  <span className="truncate">{profile.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.phoneHref}
                  className="text-muted hover:text-ink transition-colors inline-flex items-center gap-2 py-1.5"
                >
                  <Phone className="h-3.5 w-3.5 text-purple" />
                  <span>{profile.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("resume_download")}
                  className="text-muted hover:text-ink transition-colors inline-flex items-center gap-2 py-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-purple" />
                  <span>Resume (PDF) ↓</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © {year} {profile.name}.
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateToHero();
            }}
            className="text-muted hover:text-ink transition-colors inline-flex min-h-11 items-center gap-1.5 font-semibold"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}