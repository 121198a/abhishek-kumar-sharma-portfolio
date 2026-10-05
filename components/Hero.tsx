"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { trackEvent } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import Tilt3D from "@/components/motion/Tilt3D";
import type { VideoManifest } from "@/lib/media-policy";

const earliestYear = Math.min(...experience.map((e) => Number(e.year)));

const stats = [
  { value: `${projects.length}`, label: "Projects documented" },
  { value: `${skills.length}+`, label: "Core technologies" },
  { value: `${earliestYear}`, label: "Building since" },
  { value: `${experience.length}`, label: "Work & research roles" },
];

type HeroProps = {
  /** Optional portrait image. Rendered only when a file exists in /public/images. */
  portraitSrc?: string | null;
  /** Optional looping 3D video manifest (from `public/videos/hero`). */
  video?: VideoManifest | null;
};

export default function Hero({ portraitSrc = null, video = null }: HeroProps) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Background video source path
  const videoSrc = video?.sources?.[0]?.src ?? "/videos/hero/hero-1080.mp4";

  // Ensure continuous background video auto-play across all browser policies
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser restricts unprompted autoplay, play on first user interaction
          setIsPlaying(false);
          const handleFirstInteraction = () => {
            v.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
            window.removeEventListener("click", handleFirstInteraction);
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
          };
          window.addEventListener("click", handleFirstInteraction, { once: true });
          window.addEventListener("touchstart", handleFirstInteraction, { once: true });
          window.addEventListener("keydown", handleFirstInteraction, { once: true });
        });
    }
  }, [videoSrc]);

  const toggleBgVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = bgVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 min-h-[600px] flex flex-col justify-center">
      {/* ─────────────────────────────────────────────────────────────────
          Continuous 3D Motion Background Video (z-0)
          Plays behind all hero content and stays playing when chatbot opens.
          ───────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <video
          ref={bgVideoRef}
          src={videoSrc}
          poster="/videos/hero/hero-poster.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-center opacity-30 sm:opacity-35"
        />
        {/* Cinematic gradient overlays to guarantee WCAG AAA text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg" />
      </div>

      {/* Hero Content Container (z-10) */}
      <div className="relative z-10 mx-auto w-full max-w-shell px-6 sm:px-8">
        {/* Status Line: Professional Title & Active Role */}
        <Reveal immediate delay={0.05} direction="down">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/15 px-3 py-1 text-xs font-semibold text-[#b4c6fe]">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#86efac] motion-safe:animate-pulse" />
              <span>{profile.title}</span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">
              {profile.currentRole.title} · {profile.currentRole.org}
            </span>
          </div>
        </Reveal>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_340px] xl:grid-cols-[1.2fr_360px] lg:items-center lg:gap-12">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div>
            <div>
              <h1 className="break-words text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] text-ink">
                <span className="block">Abhishek</span>
                <span className="block">Kumar</span>
                <span className="block gradient-text">Sharma</span>
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-bold text-[#b4c6fe] tracking-tight">
                {profile.title}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                Full-stack developer building React, Next.js and Node.js applications with AI model integrations,
                REST APIs, JWT authentication, and role-based access control.
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

          {/* Right Column: Hero Character Card (contained within bounds, no overflow) */}
          {portraitSrc && (
            <Reveal immediate delay={0.25}>
              <figure className="mx-auto w-full max-w-[340px] sm:max-w-[360px] lg:max-w-none">
                <Tilt3D maxTilt={8} scale={1.02} glare glareOpacity={0.18} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 bg-panel2/90 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:border-purple/60 group-hover:shadow-[0_0_50px_rgba(111,147,255,0.25)]">
                    {/* Atmospheric ambient backlight */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-75"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 30%, rgba(111, 147, 255, 0.45), rgba(63, 102, 245, 0.2) 50%, transparent 80%)",
                      }}
                    />

                    {/* Character Portrait Image */}
                    <Image
                      src={portraitSrc}
                      alt={`Portrait of ${profile.name}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 360px, 80vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient depth vignette */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/90 via-[#0a0a0c]/20 to-transparent"
                    />

                    {/* Floating 3D holographic badge at bottom */}
                    <div
                      className="absolute inset-x-3.5 bottom-3.5 z-20 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/85 p-3 backdrop-blur-xl shadow-lg transition-transform duration-300"
                      style={{ transform: "translateZ(24px)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#86efac] opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#86efac]" />
                        </span>
                        <div>
                          <p className="text-[11px] font-bold text-ink leading-tight">{profile.name}</p>
                          <p className="text-[9px] font-medium text-muted uppercase tracking-wider">
                            {profile.title}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-lg border border-[#86efac]/30 bg-[#86efac]/10 px-2 py-0.5 text-[10px] font-semibold text-[#86efac]">
                        Available
                      </span>
                    </div>
                  </div>
                </Tilt3D>
              </figure>
            </Reveal>
          )}
        </div>

        {/* Hero Bottom Stats Bar */}
        <Reveal immediate delay={0.45}>
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line pt-6">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 flex-1">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group flex flex-col-reverse rounded-2xl border border-line/60 bg-panel2/40 p-4 transition-all duration-300 hover:border-purple/40 hover:bg-panel2/70 hover:-translate-y-1 hover:shadow-glow"
                >
                  <dt className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted group-hover:text-ink/80 transition-colors">
                    {s.label}
                  </dt>
                  <dd className="text-2xl font-black text-ink sm:text-3xl tracking-tight group-hover:text-purple transition-colors">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Optional Unobtrusive Background Video Play/Pause Toggle */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={toggleBgVideo}
                aria-label={isPlaying ? "Pause background animation" : "Play background animation"}
                className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-panel2/50 px-3 py-1 text-[11px] font-medium text-muted transition hover:border-purple/40 hover:text-white"
              >
                <span aria-hidden="true" className="text-[10px]">{isPlaying ? "❚❚" : "▶"}</span>
                <span>{isPlaying ? "Pause Motion" : "Play Motion"}</span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
