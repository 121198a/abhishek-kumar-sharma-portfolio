"use client";

import React from "react";
import Hero from "@/components/Hero";
import InfiniteTextMarquee from "@/components/ui/InfiniteTextMarquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Designs from "@/components/Designs";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import AIIntro from "@/components/AIIntro";
import Contact from "@/components/Contact";
import { useNavigation } from "@/components/providers/NavigationProvider";
import type { VideoManifest } from "@/lib/media-policy";

type PortfolioContentProps = {
  video: VideoManifest | null;
  contactEnabled: boolean;
};

export default function PortfolioContent({ video, contactEnabled }: PortfolioContentProps) {
  const { isolatedSection, navigateToHero } = useNavigation();

  const renderIsolatedSection = () => {
    switch (isolatedSection) {
      case "about":
        return <About />;
      case "experience":
        return <Experience />;
      case "projects":
        return <Projects />;
      case "designs":
        return <Designs />;
      case "education":
        return <Education />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact contactEnabled={contactEnabled} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 
        Continuous Full Portfolio View:
        When on the Hero section, scrolling naturally lets the user scroll sequentially:
        Hero → About → Experience → Projects → Design → Education → Footer.
        Kept mounted with CSS display toggle so returning to Hero does not reload the page
        or re-trigger intro animations.
      */}
      <div className={isolatedSection ? "hidden" : "block"}>
        <Hero video={video} />
        {!isolatedSection && (
          <>
            <InfiniteTextMarquee
              items={[
                "FULL-STACK DEVELOPER",
                "AI INTEGRATIONS",
                "REST API ARCHITECTURE",
                "REACT & NEXT.JS",
                "SPRING BOOT & NODE.JS",
                "HIGH-PERFORMANCE WEB",
              ]}
              speed={32}
            />
            <About />
            <Experience />
            <Projects />
            <Designs />
            <Skills />
            <Education />
            <AIIntro />
            <Contact contactEnabled={contactEnabled} />
          </>
        )}
      </div>

      {/* 
        Isolated Section View:
        When a navigation item is clicked directly:
        Only that section's content and the footer are displayed.
        The user can scroll through [Section] → [Section Content] → Footer,
        and cannot continue scrolling into other sections.
      */}
      {isolatedSection && (
        <div className="isolated-section-view min-h-[calc(100vh-140px)] pt-20 sm:pt-24">
          <div className="mx-auto max-w-shell px-6 sm:px-8 pt-4 pb-2">
            <button
              type="button"
              onClick={navigateToHero}
              aria-label="Return to full continuous portfolio view"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-panel2 px-3.5 py-1.5 text-xs font-semibold text-muted hover:border-purple/40 hover:text-ink transition-all shadow-sm"
            >
              <span className="text-purple group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>Back</span>
            </button>
          </div>
          {renderIsolatedSection()}
        </div>
      )}
    </>
  );
}
