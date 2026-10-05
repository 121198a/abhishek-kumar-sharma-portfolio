"use client";

import React from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { trackEvent } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import dynamic from "next/dynamic";
import type { VideoManifest } from "@/lib/media-policy";

// Code-split: the video component is only downloaded when a video actually exists.
const ResponsiveVideo = dynamic(() => import("@/components/media/ResponsiveVideo"));

const earliestYear = Math.min(...experience.map((e) => Number(e.year)));

const stats = [
  { value: `${projects.length}`, label: "Projects documented" },
  { value: `${skills.length}+`, label: "Core technologies" },
  { value: `${earliestYear}`, label: "Building since" },
  { value: `${experience.length}`, label: "Work & research roles" },
];

type HeroProps = {
  /** Optional portrait. Rendered only when a file exists in /public/images. */
  portraitSrc?: string | null;
  /** Optional looping background video (from `npm run media:optimize`). */
  video?: VideoManifest | null;
};

export default function Hero({ portraitSrc = null, video = null }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
      {video && <ResponsiveVideo manifest={video} />}
      <div className="relative z-10 mx-auto w-full max-w-shell px-6 sm:px-8">
        {/* Status line — content comes from data/profile.ts */}
        <Reveal immediate delay={0.05} direction="down">
          <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-xs">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#86efac] motion-safe:animate-pulse" />
            <span>
              {profile.currentRole.title} · {profile.currentRole.org}
            </span>
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-14">
          <div>
            {/* h1 + intro paragraph are LCP candidates: rendered static, no entrance animation. */}
            <div>
              <h1 className="break-words text-[clamp(2.1rem,13vw,8.5rem)] font-black uppercase leading-[0.86] tracking-[-0.055em] text-ink">
                <span className="block">Abhishek</span>
                <span className="block">Kumar</span>
                <span className="block text-purple">Sharma</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                Full-stack developer building React, Next.js and Node.js applications with REST APIs,
                JWT authentication and role-based access control.
              </p>
            </div>

            <Reveal immediate delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={10}>
                  <a
                    href="#projects"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-bg transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
                  >
                    View projects
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </Magnetic>
                <Magnetic strength={8}>
                  <a
                    href={profile.resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("resume_download")}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink/30 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
                  >
                    Resume ↓
                  </a>
                </Magnetic>
                <a
                  href="#contact"
                  className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple"
                >
                  Get in touch
                </a>
              </div>
            </Reveal>

            <Reveal immediate delay={0.36}>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 text-xs text-muted">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("github_click")}
                  className="inline-flex min-h-11 items-center font-semibold transition-colors hover:text-ink"
                >
                  GitHub ↗
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("linkedin_click")}
                  className="inline-flex min-h-11 items-center font-semibold transition-colors hover:text-ink"
                >
                  LinkedIn ↗
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-11 items-center break-all font-semibold transition-colors hover:text-ink"
                >
                  {profile.email}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Portrait slot: only rendered when /public/images/abhishek.* exists.
              `grayscale` is display styling only — delete the class to show the
              original colours. The photo itself is never altered or regenerated. */}
          {portraitSrc && (
            <Reveal immediate delay={0.3}>
              <figure className="mx-auto w-full max-w-[320px] lg:max-w-none">
                <div className="relative aspect-[4/5] overflow-hidden border border-line">
                  <Image
                    src={portraitSrc}
                    alt={`Portrait of ${profile.name}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 320px, 80vw"
                    className="object-cover grayscale contrast-110"
                  />
                </div>
              </figure>
            </Reveal>
          )}
        </div>

        <Reveal immediate delay={0.45}>
          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">{s.label}</dt>
                <dd className="text-2xl font-black text-ink sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
