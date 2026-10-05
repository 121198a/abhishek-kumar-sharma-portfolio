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
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero portraitSrc={findPortrait()} video={getHeroVideo()} />
        <About />
        <Capabilities />
        <Projects />
        <GitHubActivity />
        <SkillsExperience />
        <Education />
        <AIIntro />
        <Contact contactEnabled={flags.enableContactForm} />
      </main>
      <Footer />
      <LazyWidgets aiEnabled={flags.enableAI} analyticsEnabled={flags.enableAnalytics} />
    </SmoothScrollProvider>
  );
}
