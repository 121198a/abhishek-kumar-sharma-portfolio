"use client";

import React from "react";
import { skillGroups } from "@/data/skills";
import { experience } from "@/data/experience";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function SkillsExperience() {
  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Technical Stack &amp; Experience"
            title={
              <>
                Skills &amp; <span className="gradient-text">Practical Experience</span>
              </>
            }
            subtitle="Verified technical competencies, hands-on production internships, and university research."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Left Column: Technical Skills Groups */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-panel2/70 p-7 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#c084fc] uppercase">
                  Technical Arsenal
                </span>
                <span className="text-xs text-muted font-medium">Categorized Stack</span>
              </div>

              <div className="mt-6 space-y-6 flex-1">
                {skillGroups.map((group) => (
                  <div key={group.label} className="group">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d8b4fe]">
                        {group.label}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-purple/20 bg-purple/[0.06] px-3 py-1.5 text-xs text-white/90 transition-all duration-200 hover:border-purple/50 hover:bg-purple/15 hover:text-white"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right Column: Experience Timeline */}
          <Reveal delay={0.2}>
            <div
              id="experience"
              className="flex h-full flex-col rounded-2xl border border-line bg-panel2/70 p-7 sm:p-8 backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#c084fc] uppercase">
                  Career Milestones
                </span>
                <span className="text-xs text-muted font-medium">Verified History</span>
              </div>

              <div className="mt-6 divide-y divide-line/60">
                {experience.map((entry) => (
                  <div key={entry.year + entry.role} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-[#c084fc]">
                          {entry.year}
                        </span>
                        {entry.current && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#86efac]/10 px-2 py-0.5 text-[9px] font-bold text-[#86efac]">
                            <span className="h-1 w-1 rounded-full bg-[#86efac] animate-pulse" />
                            CURRENT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted/70 text-right truncate">
                        {entry.org}
                      </span>
                    </div>

                    <h4 className="mt-2 text-sm sm:text-base font-bold text-white">
                      {entry.role}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">
                      {entry.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
