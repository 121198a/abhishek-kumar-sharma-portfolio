import React from "react";
import { capabilities } from "@/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Tilt3D from "@/components/motion/Tilt3D";

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Core Competencies"
            title={
              <>
                What I bring to <span className="gradient-text">engineering teams</span>
              </>
            }
            subtitle="Hands-on full-stack development, documented API contracts, and clean interface implementations."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, index) => (
            <Reveal key={c.title} delay={index * 0.08} className="h-full">
              <Tilt3D maxTilt={5} scale={1.015} glare glareOpacity={0.1} className="h-full">
                <div
                  className="group relative flex h-full flex-col justify-between rounded-2xl border border-line/80 bg-panel2/70 p-7 transition-all duration-300 hover:border-purple/50 hover:shadow-glow"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl text-[#84a2fc] transition-transform duration-300 group-hover:scale-110">
                        ◆
                      </span>
                      <span className="text-[10px] font-mono font-medium text-muted">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-base font-bold text-white group-hover:text-[#b4c6fe] transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">
                      {c.body}
                    </p>
                  </div>
                  <div className="mt-6 h-0.5 w-8 bg-purple/30 transition-all duration-300 group-hover:w-16 group-hover:bg-purple" />
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
