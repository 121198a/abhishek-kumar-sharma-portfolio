import React from "react";
import { education, type EducationEntry } from "@/data/education";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { MapPin, Calendar } from "@/components/ui/Icons";
import InteractiveCardSlider from "@/components/ui/InteractiveCardSlider";

export default function Education() {
  return (
    <section id="education" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            title={
              <>
                Education &amp; <span className="gradient-text">Qualifications</span>
              </>
            }
            subtitle="Computer Science engineering foundation, technical degrees, and verified academic milestones."
          />
        </Reveal>

        {/* Large Screen (Desktop): Unchanged Structured Timeline */}
        <div className="relative mt-12 sm:mt-16 hidden md:block">
          {/* Vertical Timeline Guide Line */}
          <div
            aria-hidden="true"
            className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-purple/40 via-line to-transparent"
          />

          <div className="space-y-8 sm:space-y-10">
            {education.map((item, index) => (
              <Reveal key={item.degree} delay={index * 0.1}>
                <div className="relative flex items-start gap-6 group">
                  {/* Timeline Node Icon (Desktop) */}
                  <div
                    aria-hidden="true"
                    className="grid shrink-0 z-10 h-14 w-14 place-items-center rounded-xl border border-line bg-panel2 shadow-xs transition-all duration-300 group-hover:border-purple/50 group-hover:scale-105"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-purple/10 text-purple font-mono font-bold text-xs">
                      {index === 0 ? "01" : index === 1 ? "02" : "03"}
                    </div>
                  </div>

                  {/* Main Education Card */}
                  <article className="flex-1 w-full rounded-xl border border-line bg-panel2/70 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-purple/40 hover:shadow-lg hover:shadow-purple/5">
                    {/* Top Row: Year, Score, Level Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-purple bg-purple/10 px-3 py-1 rounded-full border border-purple/20">
                          <Calendar className="h-3 w-3" />
                          <span>{item.year}</span>
                        </span>
                        {item.field && (
                          <span className="text-xs font-semibold text-muted hidden sm:inline-block">
                            {item.field}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center rounded-lg border border-purple/30 bg-purple/15 px-3 py-1 text-xs font-bold text-purple shadow-sm">
                        {item.score}
                      </span>
                    </div>

                    {/* Degree & Institution Info */}
                    <div className="mt-5">
                      <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug group-hover:text-purple transition-colors">
                        {item.degree}
                      </h3>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted">
                        <span className="font-semibold text-ink/90">
                          {item.institute}
                        </span>
                        {item.location && (
                          <span className="inline-flex items-center gap-1 text-muted">
                            <MapPin className="h-3.5 w-3.5 text-purple shrink-0" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Highlights / Key Coursework */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mt-5 border-t border-line/60 pt-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-2">
                          Key Focus &amp; Coursework:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.highlights.map((course) => (
                            <Badge key={course} variant="subtle" size="sm">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Small Screen (Mobile): Horizontal Interactive Card Slider + Sticky Focused Detail */}
        <div className="mt-8 block md:hidden">
          <InteractiveCardSlider
            items={education}
            getItemKey={(item) => item.degree}
            ariaLabel="Education academic milestones slider"
            renderCard={(item, index) => <MobileEducationCard item={item} index={index} />}
            renderDetail={(item) => <MobileEducationDetail item={item} />}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Mobile Education Card for Slider View
 */
function MobileEducationCard({ item, index }: { item: EducationEntry; index: number }) {
  return (
    <div className="p-5 flex flex-col justify-between h-full space-y-3">
      <div>
        <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-purple bg-purple/10 px-2 py-0.5 rounded-full border border-purple/20">
            <Calendar className="h-3 w-3" />
            <span>{item.year}</span>
          </span>
          <span className="text-xs font-bold text-purple bg-purple/15 px-2 py-0.5 rounded-md border border-purple/25">
            {item.score}
          </span>
        </div>

        <div className="mt-3">
          <span className="text-[10px] font-bold tracking-widest text-purple uppercase block mb-1">
            Milestone 0{index + 1}
          </span>
          <h3 className="text-base font-bold text-ink leading-snug line-clamp-2">
            {item.degree}
          </h3>
          <p className="mt-1.5 text-xs text-muted font-medium line-clamp-1">
            {item.institute}
          </p>
        </div>
      </div>

      {item.highlights && item.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 border-t border-line/40">
          {item.highlights.slice(0, 3).map((h) => (
            <Badge key={h} variant="subtle" size="sm">
              {h}
            </Badge>
          ))}
          {item.highlights.length > 3 && (
            <span className="text-[10px] text-muted self-center font-mono">
              +{item.highlights.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Focused Sticky Detail View for Education Milestone
 */
function MobileEducationDetail({ item }: { item: EducationEntry }) {
  return (
    <article className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-purple bg-purple/10 px-2.5 py-1 rounded-full border border-purple/20">
          <Calendar className="h-3.5 w-3.5" />
          <span>{item.year}</span>
        </span>
        <span className="inline-flex items-center rounded-lg border border-purple/30 bg-purple/15 px-2.5 py-1 text-xs font-bold text-purple shadow-sm">
          {item.score}
        </span>
      </div>

      {/* Degree & Field */}
      <div>
        {item.field && (
          <span className="text-xs font-semibold text-purple block mb-1">
            {item.field}
          </span>
        )}
        <h3 className="text-lg font-bold text-ink leading-snug">
          {item.degree}
        </h3>
      </div>

      {/* Institution & Location */}
      <div className="rounded-xl border border-line bg-panel p-3.5 space-y-1 text-xs">
        <span className="font-semibold text-ink block">
          {item.institute}
        </span>
        {item.location && (
          <span className="inline-flex items-center gap-1 text-muted">
            <MapPin className="h-3 w-3 text-purple" />
            <span>{item.location}</span>
          </span>
        )}
      </div>

      {/* Narrative Description */}
      {item.description && (
        <p className="text-xs text-muted leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Complete Coursework & Highlights */}
      {item.highlights && item.highlights.length > 0 && (
        <div className="border-t border-line/60 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-2">
            Academic Focus &amp; Coursework:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {item.highlights.map((course) => (
              <Badge key={course} variant="subtle" size="sm">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
