import React from "react";
import { profile } from "@/data/profile";
import TrackedLink from "@/components/ui/TrackedLink";
import Reveal from "@/components/motion/Reveal";

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column: Narrative and Links */}
          <div>
            <Reveal>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#84a2fc] uppercase">
                About Abhishek
              </span>
              <h2 className="mt-3 break-words text-[clamp(1.5rem,9vw,2.25rem)] sm:text-[clamp(2.25rem,4.5vw,3.75rem)] font-black leading-[1.02] tracking-[-0.035em] text-white">
                Engineering with <span className="gradient-text">clarity &amp; craft.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-muted">
                {profile.intro.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {/* Quick action buttons */}
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <TrackedLink event="github_click"
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple/40 bg-purple/10 px-4 py-2 text-xs font-semibold text-[#b4c6fe] transition hover:border-purple hover:bg-purple/20 hover:text-white"
                >
                  <span>GitHub</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </TrackedLink>
                <TrackedLink event="linkedin_click"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple/40 bg-purple/10 px-4 py-2 text-xs font-semibold text-[#b4c6fe] transition hover:border-purple hover:bg-purple/20 hover:text-white"
                >
                  <span>LinkedIn</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </TrackedLink>
                <TrackedLink event="resume_download"
                  href={profile.resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-purple/50 hover:text-white"
                >
                  <span>Download Resume ↓</span>
                </TrackedLink>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Verified Highlights & Information Cards */}
          <div className="flex flex-col gap-4">
            {/* Current Position Card */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-line bg-panel2/70 p-7">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-[#84a2fc] uppercase">
                    Active Engagement
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#86efac]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#86efac]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#86efac] animate-pulse" />
                    Present
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">
                  {profile.currentRole.title}
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  {profile.currentRole.org}
                </p>
                <div className="my-5 h-px bg-line/80" />
                <p className="text-xs leading-relaxed text-muted">
                  Developing user interfaces with React.js, Tailwind CSS, and REST API integrations. Focused on clean component composition and performance.
                </p>
              </div>
            </Reveal>

            {/* Location & Academic Base Card */}
            <Reveal delay={0.3}>
              <div className="rounded-2xl border border-line bg-panel2/50 p-6">
                <span className="text-[10px] font-bold tracking-[0.18em] text-muted uppercase">
                  Location &amp; Foundation
                </span>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted block">Location</span>
                    <strong className="text-sm text-white font-semibold mt-0.5 block">
                      {profile.location}
                    </strong>
                  </div>
                  <div>
                    <span className="text-xs text-muted block">Education</span>
                    <strong className="text-sm text-white font-semibold mt-0.5 block">
                      B.Tech in CSIT
                    </strong>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-line/60">
                  <span className="text-xs text-muted block">Research Publication</span>
                  <p className="text-xs text-[#b4c6fe] mt-1 font-medium">
                    Presented at CoCole 2025, NIT Rourkela on Coverless Image Steganography
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
