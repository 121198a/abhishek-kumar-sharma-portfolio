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

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {education.map((e, index) => (
            <Reveal key={e.degree} delay={index * 0.08}>
              <div className="flex flex-col justify-between border-t border-line/70 pt-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple">
                      {e.year}
                    </span>
                    <span className="inline-flex items-center rounded-lg border border-purple/30 bg-purple/10 px-2.5 py-0.5 text-xs font-semibold text-purple">
                      {e.score}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-ink leading-snug">
                    {e.degree}
                  </h3>

                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {e.institute}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
