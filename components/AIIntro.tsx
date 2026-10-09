import React from "react";
import OpenChatButton from "@/components/ui/OpenChatButton";
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
          <div className="relative overflow-hidden rounded-3xl border border-line bg-panel2/80 p-8 sm:p-12">
            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/10 px-3 py-1 text-xs font-semibold text-purple">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple animate-ping" />
                  Portfolio Assistant
                </span>

                <h3 className="mt-4 text-2xl sm:text-3xl font-black tracking-[-0.03em] text-ink">
                  Interactive <span className="gradient-text">Portfolio Knowledge Base</span>
                </h3>

                <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
                  Ask about verified technical skills, full-stack projects, internship experience,
                  research publications, or recruiter evaluations. Grounded strictly in factual portfolio data with
                  deterministic fallback if offline.
                </p>

                {/* Example prompt pills */}
                <div className="mt-6">
                  <span className="text-xs text-muted font-semibold block mb-2.5">
                    Click an example query to explore:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <OpenChatButton question={prompt}
                        key={prompt}
                        type="button"
                        className="btn-ghost"
                      >
                        &ldquo;{prompt}&rdquo;
                      </OpenChatButton>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action column */}
              <div className="flex flex-col items-start lg:items-end justify-center gap-4">
                <OpenChatButton
                  type="button"
                  className="btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5.5L2 14.5V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Launch Assistant</span>
                </OpenChatButton>
                <span className="text-xs text-muted text-center lg:text-right">
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
