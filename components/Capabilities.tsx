import React from "react";
import { capabilities } from "@/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Core Competencies"
            title={
              <>
                What I bring to <span className="gradient-text">engineering teams</span>
              </>
            }
            subtitle="Hands-on full-stack development, documented API contracts, and clean interface implementations."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {capabilities.map((c, index) => (
            <Reveal key={c.title} delay={index * 0.06}>
              <div className="flex flex-col justify-between border-t border-line/70 pt-5">
                <div>
                  <span className="font-mono text-xs font-semibold text-purple">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {c.body}
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
