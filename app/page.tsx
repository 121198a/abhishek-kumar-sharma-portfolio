import fs from "fs";
import path from "path";
import { flags } from "@/lib/env";
import { getHeroVideo } from "@/lib/media";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Projects from "@/components/Projects";
import GitHubActivity from "@/components/GitHubActivity";
import SkillsExperience from "@/components/SkillsExperience";
import Education from "@/components/Education";
import AIIntro from "@/components/AIIntro";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import LazyWidgets from "@/components/LazyWidgets";

// This page is static/server-rendered and cacheable — only the /api routes
// underneath it (chat, contact, analytics) are dynamic.
// Optional portrait: drop your own photo at public/images/abhishek.(webp|jpg|jpeg|png)
// and the hero shows it automatically. No file = no portrait slot (nothing is faked).
function findPortrait(): string | null {
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    const file = `abhishek.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", "images", file))) return `/images/${file}`;
  }
  return null;
}

export default function Home() {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <RevealObserver />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none relative">
        {/* Ambient background cyber grid and lighting orbs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60" />
          <div
            className="absolute -top-[300px] left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full opacity-20 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(111,147,255,0.45) 0%, rgba(63,102,245,0.15) 50%, transparent 80%)",
            }}
          />
          <div
            className="absolute top-[40%] -left-[200px] h-[550px] w-[550px] rounded-full opacity-15 blur-[120px]"
            style={{
              background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[20%] -right-[200px] h-[600px] w-[600px] rounded-full opacity-15 blur-[140px]"
            style={{
              background: "radial-gradient(circle, rgba(111,147,255,0.35) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10">
          <Hero portraitSrc={findPortrait()} video={getHeroVideo()} />
          <About />
          <Capabilities />
          <Projects />
          <GitHubActivity />
          <SkillsExperience />
          <Education />
          <AIIntro />
          <Contact contactEnabled={flags.enableContactForm} />
        </div>
      </main>
      <Footer />
      <LazyWidgets aiEnabled={flags.enableAI} analyticsEnabled={flags.enableAnalytics} />
    </SmoothScrollProvider>
  );
}
