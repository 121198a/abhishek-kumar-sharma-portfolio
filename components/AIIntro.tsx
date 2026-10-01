"use client";

import React from "react";
import { dispatchOpenAiChat } from "@/lib/project-ai-event";
import Reveal from "@/components/motion/Reveal";

const EXAMPLE_PROMPTS = [
  "Tell me about Abhishek",
  "What are his strongest technical skills?",
  "Tell me about his projects",
  "What is his research work?",
  "What is his current role?",
  "How can I contact him?",
];

export default function AIIntro() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-purple/35 p-8 sm:p-12 backdrop-blur-xl"
            style={{
              background:
                "radial-gradient(circle at 85% 20%, rgba(168,85,247,0.18) 0%, transparent 60%), linear-gradient(135deg, rgba(22,12,42,0.85) 0%, rgba(13,9,25,0.92) 100%)",
            }}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -right-16 -top-16 h-[320px] w-[320px] rounded-full pointer-events-none"
              style={{ background: "rgba(168,85,247,0.22)", filter: "blur(90px)" }}
            />

            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/15 px-3 py-1 text-xs font-semibold text-[#d8b4fe]">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple animate-ping" />
                  ✦ AI Assistant Mode
                </span>

                <h3 className="mt-4 text-2xl sm:text-4xl font-black tracking-[-0.03em] text-white">
                  Chat with <span className="gradient-text">Abhishek AI</span>
                </h3>

                <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
                  Ask about verified technical skills, full-stack projects, internship experience,
                  research publications, or recruiter fit. Grounded strictly in factual portfolio data with
                  deterministic fallback if offline.
                </p>

                {/* Example prompt pills */}
                <div className="mt-6">
                  <span className="text-xs uppercase tracking-wider text-muted/70 font-semibold block mb-2.5">
                    Click an example prompt to try:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => dispatchOpenAiChat({ initialQuestion: prompt })}
                        className="rounded-full border border-purple/25 bg-white/[0.03] px-3.5 py-1.5 text-xs text-[#d8b4fe] transition hover:border-purple hover:bg-purple/20 hover:text-white"
                      >
                        &ldquo;{prompt}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action column */}
              <div className="flex flex-col items-start lg:items-end justify-center gap-4">
                <button
                  type="button"
                  onClick={() => dispatchOpenAiChat()}
                  className="glow inline-flex items-center gap-2.5 rounded-2xl px-6 py-4 text-sm font-bold text-white transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
                >
                  <span className="text-lg">✦</span>
                  <span>Launch Assistant</span>
                </button>
                <span className="text-[11px] text-muted text-center lg:text-right">
                  Runs lightweight edge queries · Zero tracking of private questions
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
