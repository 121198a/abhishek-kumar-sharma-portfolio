"use client";

import React, { useState, useEffect } from "react";
import { useMotionPreference } from "@/components/providers/MotionPreferenceProvider";

interface RotatingTextProps {
  phrases?: string[];
  intervalMs?: number;
  className?: string;
}

const DEFAULT_PHRASES = [
  "BUILDING DIGITAL EXPERIENCES",
  "CREATING INTERACTIVE PRODUCTS",
  "ENGINEERING MODERN WEB APPS",
  "CRAFTING PREMIUM INTERFACES",
];

export default function RotatingText({
  phrases = DEFAULT_PHRASES,
  intervalMs = 3200,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const { motionEnabled } = useMotionPreference();
  const phraseCount = phrases.length;
  const longestPhrase = phrases.reduce(
    (longest, phrase) => phrase.length > longest.length ? phrase : longest,
    ""
  );

  useEffect(() => {
    if (!motionEnabled || phraseCount <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phraseCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [phraseCount, intervalMs, motionEnabled]);

  const currentPhrase = phraseCount ? phrases[index % phraseCount] : "";

  return (
    <div
      className={`relative inline-grid h-[1.4em] items-center overflow-hidden align-middle ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 whitespace-nowrap font-mono text-[0.7rem] font-semibold uppercase tracking-[0.24em] sm:text-xs"
      >
        {longestPhrase}
      </span>
      <span className="sr-only">{currentPhrase}</span>
      <span
        key={currentPhrase}
        aria-hidden="true"
        className="hero-rotate-text col-start-1 row-start-1 whitespace-nowrap font-mono text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-purple sm:text-xs"
      >
        {currentPhrase}
      </span>
    </div>
  );
}
