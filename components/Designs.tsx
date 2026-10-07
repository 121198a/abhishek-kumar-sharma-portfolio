import React from "react";
import { designs, type DesignItem } from "@/data/designs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Badge from "@/components/ui/Badge";
import InteractiveCardSlider from "@/components/ui/InteractiveCardSlider";
import { ExternalLink } from "@/components/ui/Icons";

export default function Designs() {
  return (
    <section
      id="designs"
      aria-labelledby="designs-heading"
      className="py-24 sm:py-32 relative"
    >
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            title={
              <>
                Product &amp; <span className="gradient-text">UI/UX Designs</span>
              </>
            }
            subtitle="Design systems, interactive prototypes, and component visual specifications."
            id="designs-heading"
          />
        </Reveal>

        {designs.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-line bg-panel2/50 p-8 sm:p-12 text-center text-muted">
              <span className="text-xs font-bold text-purple uppercase tracking-wider block mb-2">
                In Preparation
              </span>
              <h3 className="text-base font-semibold text-ink">
                Visual design case studies and UI prototypes are currently being curated.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                Check back soon for component libraries, design system tokens, and interactive wireframes.
              </p>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Large Screen (Desktop): Unchanged Multi-Column Grid */}
            <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {designs.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.08} className="h-full">
                  <DesignCard item={item} />
                </Reveal>
              ))}
            </div>

            {/* Small Screen (Mobile): Horizontal Interactive Card Slider + Sticky Focused Detail */}
            <div className="mt-8 block md:hidden">
              <InteractiveCardSlider
                items={designs}
                getItemKey={(item) => item.id}
                ariaLabel="Designs mobile carousel"
                emptyMessage="Design artifacts and interactive prototypes are currently being prepared."
                renderCard={(item) => <DesignCard item={item} isSliderView />}
                renderDetail={(item) => <MobileDesignDetail item={item} />}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DesignCard({ item, isSliderView = false }: { item: DesignItem; isSliderView?: boolean }) {
  return (
    <article className="group portfolio-card p-6">
      <div>
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple">
            {item.category}
          </span>
          {item.year && (
            <span className="font-mono text-xs text-muted">
              {item.year}
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-ink leading-snug group-hover:text-purple transition-colors">
            {item.title}
          </h3>
          <p className={`mt-2 text-xs sm:text-sm text-muted leading-relaxed ${isSliderView ? "line-clamp-3" : ""}`}>
            {item.description}
          </p>
        </div>

        {item.tools && item.tools.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tools.map((t) => (
              <Badge key={t} variant="subtle" size="sm">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {!isSliderView && item.link && (
        <div className="mt-5 pt-3 border-t border-line/60">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple hover:underline"
          >
            <span>View Prototype</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </article>
  );
}

function MobileDesignDetail({ item }: { item: DesignItem }) {
  return (
    <article className="space-y-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple">
          {item.category}
        </span>
        {item.year && (
          <span className="font-mono text-xs text-muted">
            {item.year}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink">
          {item.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          {item.description}
        </p>
      </div>

      {item.tools && item.tools.length > 0 && (
        <div className="border-t border-line/60 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1.5">
            Design &amp; Prototyping Tools:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {item.tools.map((tool) => (
              <Badge key={tool} variant="subtle" size="sm">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {item.link && (
        <div className="border-t border-line/60 pt-3">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center text-xs py-2 shadow-sm"
          >
            <span>View Design Prototype</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      )}
    </article>
  );
}