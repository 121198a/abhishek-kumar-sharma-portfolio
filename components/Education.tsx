"use client";

import React from "react";
import { education } from "@/data/education";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Education() {
  return (
    <section id="education" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Academic Background"
            title={
              <>
                Education &amp; <span className="gradient-text">Qualifications</span>
              </>
            }
            subtitle="Computer Science engineering foundation and technical degree milestones."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {education.map((e, index) => (
            <Reveal key={e.degree} delay={index * 0.1}>
              <div
                className="group relative flex h-full flex-col justify-between rounded-2xl border border-line bg-panel2/70 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-purple/50 hover:shadow-glow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#c084fc]">
                      {e.year}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted font-mono">
                      Step 0{education.length - index}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white leading-snug group-hover:text-[#d8b4fe] transition-colors">
                    {e.degree}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                    {e.institute}
                  </p>
                </div>

                <div className="mt-6 border-t border-line/60 pt-4">
                  <span className="inline-flex items-center rounded-lg border border-purple/30 bg-purple/15 px-3 py-1.5 text-xs font-bold text-[#d8b4fe]">
                    {e.score}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
