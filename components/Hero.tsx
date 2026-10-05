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
  /** Optional portrait or fallback image. Rendered only when a file exists in /public/images. */
  portraitSrc?: string | null;
  /** Optional looping 3D video manifest (from `public/videos/hero`). */
  video?: VideoManifest | null;
};

export default function Hero({ portraitSrc = null, video = null }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Resolve video path from manifest or default 1080p hero video
  const videoSrc = video?.sources?.[0]?.src ?? (portraitSrc ? "/videos/hero/hero-1080.mp4" : null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay policy or low-power mode might pause initially
        setIsPlaying(false);
      });
  }, [videoSrc]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
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
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
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

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_340px] xl:grid-cols-[1.2fr_360px] lg:items-center lg:gap-12">
          <div>
            {/* h1 + intro paragraph are LCP candidates: rendered static, no entrance animation. */}
            <div>
              <h1 className="break-words text-[clamp(2.1rem,13vw,8.5rem)] font-black uppercase leading-[0.86] tracking-[-0.055em] text-ink">
                <span className="block">Abhishek</span>
                <span className="block">Kumar</span>
                <span className="block text-purple">Sharma</span>
              </h1>
              <p className="mt-6 sm:mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
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

          {/* Hero 3D Card: displays the 3D animated motion video, with static image fallback */}
          {(portraitSrc || videoSrc) && (
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

                    {/* Fallback Static Image */}
                    {portraitSrc && (
                      <Image
                        src={portraitSrc}
                        alt={`Portrait of ${profile.name}`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 360px, 80vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}

                    {/* 3D Animated Motion Video */}
                    {videoSrc && !videoError && (
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        poster={portraitSrc ?? undefined}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onError={() => setVideoError(true)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}

                    {/* Gradient depth vignette */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/90 via-[#0a0a0c]/20 to-transparent"
                    />

                    {/* Play/Pause Control Button */}
                    {videoSrc && !videoError && (
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause 3D animation" : "Play 3D animation"}
                        className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-bg/75 text-xs text-white shadow-md backdrop-blur-md transition-all hover:scale-110 hover:border-purple hover:bg-purple/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple"
                      >
                        <span aria-hidden="true">{isPlaying ? "❚❚" : "▶"}</span>
                      </button>
                    )}

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
                            Full-Stack &amp; AI
                          </p>
                        </div>
                      </div>
                      <span className="rounded-lg border border-purple/30 bg-purple/15 px-2 py-0.5 text-[10px] font-semibold text-[#b4c6fe]">
                        3D Motion
                      </span>
                    </div>
                  </div>
                </Tilt3D>
              </figure>
            </Reveal>
          )}
        </div>

        <Reveal immediate delay={0.45}>
          <dl className="mt-10 sm:mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 border-t border-line pt-6">
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
        </Reveal>
      </div>
    </section>
  );
}
