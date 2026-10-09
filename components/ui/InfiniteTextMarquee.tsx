"use client";

import React from "react";

interface InfiniteTextMarqueeProps {
  items?: string[];
  speed?: number; // duration in seconds
  reverse?: boolean;
  className?: string;
}

const DEFAULT_ITEMS = [
  "FULL-STACK DEVELOPER",
  "AI SYSTEM INTEGRATOR",
  "REST API ARCHITECT",
  "REACT & NEXT.JS SPECIALIST",
  "ENGINEERING WITH CRAFT",
  "CLEAN ARCHITECTURE",
];

export default function InfiniteTextMarquee({
  items = DEFAULT_ITEMS,
  speed = 28,
  reverse = false,
  className = "",
}: InfiniteTextMarqueeProps) {
  const repeated = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden border-y border-line bg-panel2/40 py-4 backdrop-blur-sm ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--bg),transparent_18%,transparent_82%,var(--bg))]" />
      <div
        className={`marquee-track flex w-max items-center ${reverse ? "[animation-direction:reverse]" : ""}`}
        style={{
          "--marquee-duration": `${speed}s`,
        } as React.CSSProperties}
      >
        {[...repeated, ...repeated].map((text, idx) => (
          <div
            key={`${text}-${idx}`}
            className="marquee-item"
          >
            <span>{text}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-purple/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
