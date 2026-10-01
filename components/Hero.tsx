"use client";

import React from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { trackEvent } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Magnetic from "@/components/motion/Magnetic";

const earliestYear = Math.min(...experience.map((e) => Number(e.year)));

const stats = [
  { value: `${projects.length}`, label: "Projects Documented" },
  { value: `${skills.length}+`, label: "Core Technologies" },
  { value: `${earliestYear}`, label: "Building Since" },
  { value: `${experience.length}`, label: "Work & Research Roles" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center pt-28 pb-16 overflow-hidden">
      {/* Oversized background typography watermark - subtle parallax and low opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 select-none text-[clamp(7rem,22vw,22rem)] font-black tracking-tighter text-white/[0.015] whitespace-nowrap z-0"
      >
        ABHI
      </div>

      <div className="relative z-10 mx-auto max-w-shell px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Left Column: Text & CTAs */}
          <div>
            {/* Status Pill */}
            <Reveal delay={0.05} direction="down">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/10 px-3.5 py-1.5 text-xs font-semibold text-[#d8b4fe] mb-6 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#86efac] animate-pulse" />
                <span>{profile.currentRole.title} · {profile.currentRole.org}</span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal delay={0.15}>
              <h1 className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-white">
                Building <span className="gradient-text">real products</span>,
                <br />
                not just demos.
              </h1>
            </Reveal>

            {/* Subtitle / Bio summary */}
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted">
                I&apos;m <span className="text-white font-semibold">{profile.name}</span> — a frontend and full-stack developer
                crafting responsive React interfaces backed by Node.js, Spring Boot, MySQL, MongoDB, and AWS cloud solutions.
              </p>
            </Reveal>

            {/* Action Buttons */}
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Magnetic strength={10}>
                  <a
                    href="#projects"
                    className="glow inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
                  >
                    <span>View Projects</span>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
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
                    className="inline-flex items-center gap-2 rounded-xl border border-purple/50 bg-panel/60 px-5 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-purple hover:bg-purple/10 hover:text-white"
                  >
                    <span>Resume ↓</span>
                  </a>
                </Magnetic>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-5 py-3.5 text-sm font-semibold text-muted transition hover:border-purple/40 hover:text-white"
                >
                  Let&apos;s Connect
                </a>
              </div>
            </Reveal>

            {/* Social Links */}
            <Reveal delay={0.4}>
              <div className="mt-7 flex items-center gap-5 text-xs text-muted">
                <span className="text-[11px] tracking-wider uppercase text-muted/60 font-semibold">Connect:</span>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("github_click")}
                  className="font-semibold text-muted hover:text-white transition-colors"
                >
                  GitHub ↗
                </a>
                <span className="text-line">•</span>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("linkedin_click")}
                  className="font-semibold text-muted hover:text-white transition-colors"
                >
                  LinkedIn ↗
                </a>
                <span className="text-line">•</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="font-semibold text-muted hover:text-white transition-colors"
                >
                  {profile.email}
                </a>
              </div>
            </Reveal>

            {/* Verified Statistics Grid */}
            <Reveal delay={0.5}>
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-line/80 pt-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <strong className="text-2xl sm:text-3xl font-black text-[#c084fc]">
                      {s.value}
                    </strong>
                    <span className="mt-1 text-[11px] font-medium text-muted uppercase tracking-wider">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Hero Graphic Visual with Parallax & Verified Role Card */}
          <div className="relative hidden lg:flex h-[520px] items-center justify-center">
            <Parallax speed={0.12} className="relative flex items-center justify-center w-full">
              {/* Orb Glow Backdrop */}
              <div
                className="absolute h-[320px] w-[320px] rounded-full blur-[80px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(124,58,237,0.15) 70%, transparent 100%)" }}
              />

              <Image
                src="/hero-graphic.svg"
                alt="Technical geometry graphic"
                width={460}
                height={460}
                priority
                className="orb w-[80%] max-w-[460px] select-none drop-shadow-[0_0_40px_rgba(124,58,237,0.35)]"
              />

              {/* Floating Verified Role Card */}
              <div className="absolute -bottom-2 right-4 w-[260px] rounded-2xl border border-purple/40 bg-panel/90 p-5 shadow-2xl backdrop-blur-xl glow transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#86efac]">
                    ● Verified Role
                  </span>
                  <span className="text-[10px] text-muted">2026</span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-white leading-snug">
                  {profile.currentRole.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {profile.currentRole.org}
                </p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-line/60 pt-2 text-[10px] text-[#d8b4fe]">
                  <span>Focus: React &amp; REST APIs</span>
                </div>
              </div>
            </Parallax>
          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <div className="mt-16 hidden sm:flex items-center justify-center">
          <a
            href="#about"
            aria-label="Scroll down to About section"
            className="group flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted/70 hover:text-white transition-colors"
          >
            <span>Scroll</span>
            <div className="h-7 w-4 rounded-full border border-line flex items-start justify-center p-1">
              <div className="h-1.5 w-1 rounded-full bg-purple animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
