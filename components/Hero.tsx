"use client";

import { useEffect, useState } from "react";
import ResponsiveVideo from "@/components/media/ResponsiveVideo";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { trackEvent } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import GetInTouch from "@/components/ui/GetInTouch";
import RotatingText from "@/components/ui/RotatingText";
import { ArrowRight, Download } from "@/components/ui/Icons";
import type { VideoManifest } from "@/lib/media-policy";

const earliestYear = Math.min(...experience.map((e) => Number(e.year)));

const stats = [
  { value: `${projects.length}`, label: "Projects documented" },
  { value: `${skills.length}+`, label: "Core technologies" },
  { value: `${earliestYear}`, label: "Building since" },
  { value: `${experience.length}`, label: "Work & research roles" },
];

type HeroProps = {
  /** Optional looping background video manifest from public/videos/hero. */
  video?: VideoManifest | null;
};

export default function Hero({ video = null }: HeroProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasAnimated(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className={`relative isolate flex min-h-[600px] flex-col justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 ${
        hasAnimated ? "hero-animated" : ""
      }`}
    >
      {/* Background media and decorative effects */}
      {video && <ResponsiveVideo manifest={video} minWidth={768} />}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <div className="hero-ambient" />
        <div className="hero-ambient-alt" />

        {/* Preserve the original horizontal hero overlay. */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/70" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-shell px-6 sm:px-8">
        <Reveal immediate delay={0.05} direction="down">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/15 px-3 py-1 text-xs font-semibold text-[#4f46e5]">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-[#34d399] motion-safe:animate-pulse"
              />
              <span>{profile.title}</span>
            </span>

            <span className="text-xs font-semibold text-muted sm:text-sm">
              {profile.currentRole.title} · {profile.currentRole.org}
            </span>
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:mt-8 lg:items-center">
          <div>
            <div>
              <h1
                aria-label={profile.name}
                className="break-words text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] text-ink"
              >
                {["Abhishek", "Kumar", "Sharma"].map((word, wordIndex) => (
                  <span
                    key={word}
                    aria-hidden="true"
                    className={`block ${
                      wordIndex === 2 ? "gradient-text" : "opacity-90"
                    }`}
                  >
                    {Array.from(word).map((character, characterIndex) => (
                      <span
                        key={`${character}-${characterIndex}`}
                        className="kinetic-character"
                        style={{
                          animationDelay: `${
                            0.12 +
                            wordIndex * 0.18 +
                            characterIndex * 0.026
                          }s`,
                        }}
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              <div className="mt-4 flex items-center gap-2.5 font-mono text-xs font-semibold tracking-wider text-purple sm:text-sm">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-purple motion-safe:animate-pulse"
                />

                <RotatingText
                  phrases={[
                    "BUILDING DIGITAL EXPERIENCES",
                    "CREATING INTERACTIVE PRODUCTS",
                    "ENGINEERING MODERN WEB APPS",
                    "CRAFTING PREMIUM INTERFACES",
                  ]}
                />
              </div>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                Full-stack developer building React, Next.js, and Node.js web
                applications. I integrate AI models, design REST APIs, and
                implement secure JWT authentication with role-based access
                control.
              </p>
            </div>

            <Reveal immediate delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={10}>
                  <a
                    href="#projects"
                    className="btn-primary"
                    data-cursor="PROJECTS"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Magnetic>

                <Magnetic strength={8}>
                  <a
                    href={profile.resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("resume_download")}
                    className="btn-secondary"
                    data-cursor="CV"
                  >
                    <span>Download Resume</span>
                    <Download className="h-4 w-4" />
                  </a>
                </Magnetic>

                <GetInTouch
                  id="hero-social-profiles"
                  links={{
                    github: profile.github,
                    linkedin: profile.linkedin,
                    facebook: profile.facebook,
                    instagram: profile.instagram,
                    x: profile.x,
                  }}
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Hero bottom statistics */}
        <Reveal immediate delay={0.45}>
          <div className="mt-10 border-t border-line pt-6 sm:mt-12">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse py-1"
                >
                  <dt className="mt-1 text-xs font-medium text-muted">
                    {stat.label}
                  </dt>

                  <dd className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}