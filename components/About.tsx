import React from "react";
import { profile } from "@/data/profile";
import { capabilities } from "@/data/skills";
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
              <span className="text-xs font-bold tracking-[0.18em] text-[#84a2fc] uppercase">
                About Abhishek
              </span>
              <h2 className="mt-3 break-words text-[clamp(1.85rem,4vw,3rem)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
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
                  className="btn-secondary"
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
                  className="btn-secondary"
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
                  className="btn-secondary"
                >
                  <span>Download Resume ↓</span>
                </TrackedLink>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Verified Credentials & Engagement */}
          <div className="flex flex-col gap-6">
            <Reveal delay={0.2}>
              <div className="rounded-xl border border-line bg-panel p-6 shadow-xs">
                <div className="flex items-center justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#86efac]/10 px-2.5 py-0.5 text-xs font-bold text-[#86efac]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#86efac] animate-pulse" />
                    Present
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">
                  {profile.currentRole.title}
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  {profile.currentRole.org}
                </p>
                <div className="my-4 h-px bg-line/60" />
                <p className="text-xs leading-relaxed text-muted">
                  Building responsive user interfaces with React.js, Tailwind CSS, and REST APIs, with an emphasis on clean code and fast load times.
                </p>

                <div className="mt-6 pt-6 border-t border-line/60">
                  <span className="text-xs font-semibold text-muted">
                    Location &amp; Academic Base
                  </span>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted block">Current Location</span>
                      <strong className="text-sm text-ink font-semibold mt-0.5 block">
                        {profile.currentLocation}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted block">Permanent Location</span>
                      <strong className="text-sm text-ink font-semibold mt-0.5 block">
                        {profile.permanentLocation}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted block">Education</span>
                      <strong className="text-sm text-ink font-semibold mt-0.5 block">
                        B.Tech in CSIT
                      </strong>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-line/60">
                    <span className="text-xs text-muted block">Research Contribution</span>
                    <p className="text-xs text-[#b4c6fe] mt-1 font-medium">
                      Presented at CoCole 2025, NIT Rourkela on Coverless Image Steganography
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-lg font-bold text-ink">Engineering approach</h3>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => (
              <Reveal key={capability.title} delay={index * 0.05}>
                <article className="h-full border-t border-line/70 pt-5">
                  <h4 className="text-sm font-bold text-ink">{capability.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {capability.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
