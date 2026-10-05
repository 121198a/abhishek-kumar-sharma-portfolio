"use client";

import React, { useState } from "react";
import Link from "next/link";
import { caseStudySlugs } from "@/data/case-study-slugs";
import { projects, projectCategories, type Project } from "@/data/projects";
import { dispatchAskAiProject } from "@/lib/project-ai-event";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Badge from "@/components/ui/Badge";
import Tilt3D from "@/components/motion/Tilt3D";

export default function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <Reveal>
            <SectionHeading
              eyebrow="Selected Work"
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
              className="flex flex-wrap gap-2 rounded-2xl border border-line/80 bg-panel2/60 p-1.5"
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
                    className={`flex min-h-9 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${
                      isSelected
                        ? "border border-purple/40 bg-purple/25 text-white shadow-sm"
                        : "border border-transparent text-muted hover:border-line hover:text-white"
                    }`}
                  >
                    <span>{c}</span>
                    <span className={`text-[10px] ${isSelected ? "text-[#b4c6fe]" : "text-muted"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Project Cards Grid */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-line bg-panel2/40 p-12 text-center text-muted">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, index) => (
              <Reveal key={p.slug} delay={index * 0.08} className="h-full">
                <Tilt3D maxTilt={6} scale={1.015} perspective={1200} glare glareOpacity={0.12} className="h-full">
                  <ProjectCard project={p} />
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const statusVariant =
    p.status === "Shipped"
      ? "success"
      : p.status === "Internship project"
      ? "purple"
      : "subtle";

  return (
    <article
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel2/70 transition-all duration-300 hover:-translate-y-2 hover:border-purple/50 hover:shadow-glow"
    >
      <div>
        {/* Header Preview Banner */}
        <div
          className="relative flex h-[160px] items-center justify-center overflow-hidden border-b border-line"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(85, 125, 247, 0.3) 0%, transparent 60%), linear-gradient(135deg, #151518 0%, #1f1f24 100%)",
          }}
        >
          {/* Subtle watermark monogram */}
          <span className="select-none font-black text-6xl tracking-tighter text-white/[0.04] transition-transform duration-500 group-hover:scale-110">
            {p.name.slice(0, 2).toUpperCase()}
          </span>

          {/* Top metadata badges */}
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-md border border-line bg-bg/80 px-2 py-0.5 text-[10px] font-mono text-muted">
              {p.year}
            </span>
            <Badge variant={statusVariant} size="sm">
              {p.status}
            </Badge>
          </div>

          {/* Category Pill at bottom left */}
          <div className="absolute bottom-3 left-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#84a2fc]">
              {p.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-white group-hover:text-[#b4c6fe] transition-colors leading-snug">
            {p.name}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">
            {p.description}
          </p>

          {/* Approach & Implementation notes */}
          {p.approach && (
            <div className="mt-4 border-t border-line/60 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b4c6fe] block mb-1">
                Implementation Approach:
              </span>
              <p className="text-xs leading-relaxed text-muted">
                {p.approach}
              </p>
            </div>
          )}

          {/* Technology Badges */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <Badge key={tag} variant="purple" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="border-t border-line/60 p-6 pt-4 flex flex-col gap-2.5">
        {caseStudySlugs.includes(p.slug) && (
          <Link
            href={`/projects/${p.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-ink transition-colors hover:text-[#84a2fc]"
          >
            <span>Read case study</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}

        {p.href && (
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-[#84a2fc] hover:text-white transition-colors"
          >
            <span>View Project Link</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
        )}

        <button
          type="button"
          onClick={() => dispatchAskAiProject({ slug: p.slug, name: p.name })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple/35 bg-purple/10 px-3.5 py-2.5 text-xs font-semibold text-[#b4c6fe] transition hover:border-purple hover:bg-purple/20 hover:text-white"
        >
          <span>✦ Ask AI about this project</span>
        </button>
      </div>
    </article>
  );
}
