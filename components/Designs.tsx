"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  designCategories,
  designPreviewUrl,
  designProjectUrl,
  liveProjectCount,
  type DesignCategory,
  type DesignProject,
} from "@/data/designs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Badge from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/Icons";

/**
 * Design Showcase: categories -> project cards -> project opens in a new tab.
 *
 * Nothing from a design project is loaded here. Project cards are plain links to
 * /design-projects/<category>/<slug>; the browser only fetches a project when the
 * visitor clicks it, and preview screenshots are only requested once a category is opened.
 * All content comes from data/designs.ts.
 */
export default function Designs() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = designCategories.find((c) => c.id === activeId) ?? null;

  const categoryHeadingRef = useRef<HTMLHeadingElement>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastOpenedRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  // Keyboard / screen-reader focus follows the view change.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (activeId) {
      lastOpenedRef.current = activeId;
      categoryHeadingRef.current?.focus();
    } else if (lastOpenedRef.current) {
      categoryButtonRefs.current[lastOpenedRef.current]?.focus({ preventScroll: true });
    }
  }, [activeId]);

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

        {active ? (
          <CategoryView
            category={active}
            headingRef={categoryHeadingRef}
            onBack={() => setActiveId(null)}
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {designCategories.map((category, index) => (
              <Reveal key={category.id} delay={index * 0.06} className="h-full">
                <CategoryCard
                  category={category}
                  buttonRef={(el) => {
                    categoryButtonRefs.current[category.id] = el;
                  }}
                  onOpen={() => setActiveId(category.id)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Level 1: categories                                                         */
/* -------------------------------------------------------------------------- */

function CategoryCard({
  category,
  onOpen,
  buttonRef,
}: {
  category: DesignCategory;
  onOpen: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const count = liveProjectCount(category);
  const available = category.status === "live" && count > 0;

  const body = (
    <>
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple">
          {available ? `${count} ${count === 1 ? "design" : "designs"}` : "Soon"}
        </span>
        {!available && (
          <Badge variant="subtle" size="sm">
            Coming soon
          </Badge>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-purple">
          {category.title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">{category.description}</p>
      </div>
      {available && (
        <div className="mt-5 border-t border-line/60 pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple">
            Explore <span aria-hidden="true">→</span>
          </span>
        </div>
      )}
    </>
  );

  if (!available) {
    return (
      <article
        className="project-card p-6 opacity-70"
        aria-label={`${category.title} (coming soon)`}
        data-category={category.id}
        data-state="coming-soon"
      >
        <div>{body}</div>
      </article>
    );
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onOpen}
      aria-label={`${category.title}, ${count} ${count === 1 ? "design" : "designs"}`}
      className="project-card group p-6 text-left w-full cursor-pointer"
      data-category={category.id}
      data-state="live"
    >
      <div>{body}</div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Level 2: one category's project cards                                       */
/* -------------------------------------------------------------------------- */

function CategoryView({
  category,
  onBack,
  headingRef,
}: {
  category: DesignCategory;
  onBack: () => void;
  headingRef: React.RefObject<HTMLHeadingElement>;
}) {
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to all design categories"
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-panel2 px-3.5 py-1.5 text-xs font-semibold text-muted hover:border-purple/40 hover:text-ink transition-all shadow-sm"
      >
        <span className="text-purple group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">
          ←
        </span>
        <span>All categories</span>
      </button>

      <div className="mt-6">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="scroll-mt-28 text-xl font-bold text-ink outline-none"
        >
          {category.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{category.description}</p>
        <p className="mt-1 text-xs text-muted">
          Each design is a fully working project that opens in a new tab.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.06} className="h-full">
            <ProjectCard category={category} project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ category, project }: { category: DesignCategory; project: DesignProject }) {
  const live = project.status === "live";

  const body = (
    <>
      <div>
        <Preview category={category} project={project} />
        <div className="p-6">
          <h4 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-purple">
            {project.title}
          </h4>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.description}</p>
          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="subtle" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-line/60 px-6 py-3">
        {live ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple group-hover:underline">
            <span>Open live project</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </span>
        ) : (
          <Badge variant="subtle" size="sm">
            Coming soon
          </Badge>
        )}
      </div>
    </>
  );

  if (!live) {
    return (
      <article
        className="project-card"
        aria-label={`${project.title} (coming soon)`}
        data-project={`${category.id}/${project.slug}`}
        data-state="coming-soon"
      >
        {body}
      </article>
    );
  }

  return (
    <a
      href={designProjectUrl(category, project)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} (opens in a new tab)`}
      className="project-card group"
      data-project={`${category.id}/${project.slug}`}
      data-state="live"
    >
      {body}
    </a>
  );
}

/**
 * Real screenshot of the actual built project (public/design-previews/<category>/<slug>.jpg,
 * produced by `npm run design:screenshots`). If the file is missing we show a clearly
 * labelled placeholder instead of any substitute image.
 */
function Preview({ category, project }: { category: DesignCategory; project: DesignProject }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const live = project.status === "live";

  // A 404 can fire before React hydrates (so onError never runs); catch that case here.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const frame = "relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-white/[0.02]";

  if (!live || failed) {
    return (
      <div className={frame} data-preview={live ? "pending" : "coming-soon"}>
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            {live ? "Preview pending" : "Coming soon"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={frame} data-preview="image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={designPreviewUrl(category, project)}
        alt={`Screenshot of the ${project.title}`}
        width={1280}
        height={800}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}
