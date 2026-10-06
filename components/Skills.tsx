"use client";

import React from "react";
import {
  siC,
  siDotnet,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siOpencv,
  siPostman,
  siPython,
  siReact,
  siSpringboot,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import { Cloud, Code2, Database, PanelsTopLeft, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { skills } from "@/data/skills";

type BrandIcon = { hex: string; path: string };

const brandIcons: Record<string, BrandIcon> = {
  JavaScript: siJavascript,
  Java: siOpenjdk,
  "Embedded C": siC,
  Python: siPython,
  React: siReact,
  "HTML5": siHtml5,
  "Tailwind CSS": siTailwindcss,
  "Node.js": siNodedotjs,
  "Express.js": siExpress,
  "Spring Boot": siSpringboot,
  ".NET": siDotnet,
  MongoDB: siMongodb,
  MySQL: siMysql,
  Git: siGit,
  GitHub: siGithub,
  Postman: siPostman,
  OpenCV: siOpencv,
};

const fallbackIcons: Record<string, { icon: LucideIcon; color: string }> = {
  SQL: { icon: Database, color: "#0e7490" },
  "CSS3": { icon: Code2, color: "#2563eb" },
  "Responsive Design": { icon: PanelsTopLeft, color: "#0f766e" },
  "REST APIs": { icon: Code2, color: "#7c3aed" },
  "JWT Authentication": { icon: ShieldCheck, color: "#d97706" },
  AWS: { icon: Cloud, color: "#f59e0b" },
  "AWS S3": { icon: Database, color: "#f59e0b" },
  "AWS Lambda": { icon: Cloud, color: "#f59e0b" },
};

function SkillMark({ name }: { name: string }) {
  const brand = brandIcons[name];
  if (brand) {
    const brandColor = Number.parseInt(brand.hex, 16) < 0x404040 ? "#e2e8f0" : `#${brand.hex}`;
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" style={{ color: brandColor }}>
        <path fill="currentColor" d={brand.path} />
      </svg>
    );
  }

  const fallback = fallbackIcons[name] ?? { icon: Code2, color: "#64748b" };
  const Icon = fallback.icon;
  return (
    <Icon aria-hidden="true" className="h-9 w-9" strokeWidth={1.7} style={{ color: fallback.color }} />
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-20">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="text-3xl font-bold leading-none text-ink">Skills</h2>
          <span className="font-mono text-xs text-muted">{"// tech stack"}</span>
        </div>

        <div className="skills-grid" aria-label="Technology skills">
          {skills.map((skill) => (
            <div key={skill} className="skill-tile group text-center" title={skill}>
              <div className="skill-icon-tile group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                <SkillMark name={skill} />
              </div>
              <span className="skill-label">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
