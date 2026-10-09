import React from "react";
import { experience } from "@/data/experience";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            title={
              <>
                Verified <span className="gradient-text">Experience &amp; Roles</span>
              </>
            }
            subtitle="Hands-on production internships, computer vision academic research, and full-stack software delivery."
          />
        </Reveal>

        <div className="relative mt-12 border-l border-line/80 ml-4 sm:ml-8 space-y-12 pl-6 sm:pl-10">
          {experience.map((entry, index) => (
            <Reveal key={entry.year + entry.role} delay={index * 0.1}>
              <div className="relative group">
                {/* Timeline node */}
                <div
                  aria-hidden="true"
                  className={`timeline-marker ${
                    entry.current
                      ? "border-purple bg-purple/10 text-purple"
                      : ""
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      entry.current ? "bg-purple animate-pulse" : "bg-muted"
                    }`}
                  />
                </div>

                {/* Entry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-purple transition-colors">
                      {entry.role}
                    </h3>
                    <span className="text-sm font-semibold text-muted">
                      · {entry.org}{entry.location ? ` · ${entry.location}` : ""}
                    </span>
                    {entry.current && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#86efac]/10 px-2.5 py-0.5 text-xs font-bold text-[#86efac]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#86efac] animate-pulse" />
                        Present
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-purple">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{entry.year}</span>
                  </div>
                </div>

                {/* Entry Body */}
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-3xl">
                  {entry.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
