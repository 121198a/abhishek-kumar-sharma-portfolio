"use client";

import React, { useState } from "react";
import { projects, projectCategories, type Project } from "@/data/projects";
import { dispatchAskAiProject } from "@/lib/project-ai-event";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Badge from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/Icons";
import InteractiveCardSlider from "@/components/ui/InteractiveCardSlider";

export default function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <Reveal>
            <SectionHeading
              title={
                <>
                  Projects &amp; <span className="gradient-text">Implementations</span>
                </>
              }
              subtitle="End-to-end full-stack applications, computer vision research, and embedded systems engineering."
              className="mb-0"
            />
          </Reveal>

          {/* Filter Pills */}
          <Reveal delay={0.15}>
            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-2 rounded-2xl border border-line bg-panel2/60 p-1.5"
            >
              {projectCategories.map((c) => {
                const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
                const isSelected = filter === c;

                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setFilter(c)}
                    className={`btn-ghost ${
                      isSelected
                        ? "border-purple text-ink shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span>{c}</span>
                    <span className={`text-xs ${isSelected ? "text-purple" : "text-muted"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Project Cards: Large Screen (Desktop) vs Mobile Screen */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-line bg-panel2/40 p-12 text-center text-muted">
            No projects found in this category.
          </div>
        ) : (
          <>
            {/* Desktop / Large Screen: Unchanged Multi-Column Grid */}
            <div className="hidden md:grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, index) => (
                <Reveal key={p.slug} delay={index * 0.08} className="h-full">
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>

            {/* Mobile / Small Screen: Horizontal Interactive Card Slider + Sticky Focused Detail */}
            <div className="block md:hidden">
              <InteractiveCardSlider
                items={visible}
                getItemKey={(p) => p.slug}
                ariaLabel="Projects horizontal slider"
                renderCard={(p) => <ProjectCard project={p} isSliderView />}
                renderDetail={(p) => <MobileProjectDetail project={p} />}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project: p, isSliderView = false }: { project: Project; isSliderView?: boolean }) {
  const statusVariant =
    p.status === "Shipped"
      ? "success"
      : p.status === "Internship project"
        ? "purple"
        : "subtle";

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel2/70 transition-all duration-300 hover:border-purple/40">
      <div>
        {/* Header Preview Banner */}
        <div className="relative flex h-[90px] items-center justify-between border-b border-line bg-white/[0.02] px-6">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md border border-line bg-panel px-2.5 py-0.5 text-xs font-mono text-muted">
              {p.year}
            </span>

            <span className="text-xs font-bold tracking-wider uppercase text-purple">
              {p.category}
            </span>
          </div>

          <Badge variant={statusVariant} size="sm">
            {p.status}
          </Badge>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-ink group-hover:text-purple transition-colors leading-snug">
            {p.name}
          </h3>

          <p className={`mt-2.5 text-sm leading-relaxed text-muted ${isSliderView ? "line-clamp-3" : ""}`}>
            {p.description}
          </p>

          {/* Approach & Implementation notes (desktop or non-slider) */}
          {!isSliderView && p.approach && (
            <div className="mt-4 border-t border-line/60 pt-3">
              <span className="text-xs font-semibold text-muted block mb-1">
                Implementation approach:
              </span>

              <p className="text-xs leading-relaxed text-muted">
                {p.approach}
              </p>
            </div>
          )}

          {/* Technology Badges */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {(isSliderView ? p.tags.slice(0, 4) : p.tags).map((tag) => (
              <Badge key={tag} variant="subtle" size="sm">
                {tag}
              </Badge>
            ))}
            {isSliderView && p.tags.length > 4 && (
              <span className="text-[10px] text-muted self-center font-mono">
                +{p.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      {!isSliderView && (
        <div className="border-t border-line/60 p-6 pt-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            {(p.liveUrl || p.href) && (
              <a
                href={p.liveUrl || p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live deployed project: ${p.name}`}
                className="btn-primary flex-1 justify-center text-xs py-2 shadow-sm font-bold"
              >
                <span>Live Project</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            )}
            {p.githubUrl && (
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View GitHub repository for ${p.name}`}
                className="btn-secondary px-3 py-2 text-xs font-semibold"
                title="View GitHub Repository"
              >
                <span>Code</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => dispatchAskAiProject({ slug: p.slug, name: p.name })}
            className="btn-ghost w-full justify-center"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="text-purple shrink-0"
            >
              <path
                d="M2 3a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5.5L2 14.5V3z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>Ask about architecture</span>
          </button>
        </div>
      )}
    </article>
  );
}

/**
 * Focused Sticky Detail View for Mobile
 * Displays full project content, scrollable if long, with all actions and tags
 */
function MobileProjectDetail({ project: p }: { project: Project }) {
  const statusVariant =
    p.status === "Shipped"
      ? "success"
      : p.status === "Internship project"
        ? "purple"
        : "subtle";

  return (
    <article className="space-y-5">
      {/* Detail Header */}
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md border border-line bg-panel px-2.5 py-0.5 text-xs font-mono text-muted">
            {p.year}
          </span>
          <span className="text-xs font-bold tracking-wider uppercase text-purple">
            {p.category}
          </span>
        </div>
        <Badge variant={statusVariant} size="sm">
          {p.status}
        </Badge>
      </div>

      {/* Project Title & Full Description */}
      <div>
        <h3 className="text-xl font-bold text-ink leading-tight">
          {p.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {p.description}
        </p>
      </div>

      {/* Full Implementation Approach */}
      {p.approach && (
        <div className="rounded-xl border border-line bg-panel p-4 space-y-1.5">
          <span className="text-xs font-bold text-purple block">
            Implementation Approach
          </span>
          <p className="text-xs leading-relaxed text-muted">
            {p.approach}
          </p>
        </div>
      )}

      {/* Full Technology Stack */}
      <div>
        <span className="text-xs font-semibold text-muted block mb-2">
          Technologies &amp; Architecture:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <Badge key={tag} variant="subtle" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="border-t border-line/60 pt-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {(p.liveUrl || p.href) && (
            <a
              href={p.liveUrl || p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open live deployed project: ${p.name}`}
              className="btn-primary flex-1 justify-center text-xs py-2.5 shadow-sm font-bold"
            >
              <span>Live Project</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          )}
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View GitHub repository for ${p.name}`}
              className="btn-secondary px-3.5 py-2.5 text-xs font-semibold"
              title="View GitHub Repository"
            >
              <span>Code</span>
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => dispatchAskAiProject({ slug: p.slug, name: p.name })}
          className="btn-ghost w-full justify-center"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="text-purple shrink-0"
          >
            <path
              d="M2 3a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5.5L2 14.5V3z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Ask about architecture</span>
        </button>
      </div>
    </article>
  );
}
