import { flags } from "@/lib/env";
import { getHeroVideo } from "@/lib/media";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import InfiniteTextMarquee from "@/components/ui/InfiniteTextMarquee";
import PageTransition from "@/components/motion/PageTransition";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Designs from "@/components/Designs";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import AIIntro from "@/components/AIIntro";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import LazyWidgets from "@/components/LazyWidgets";

// This page is static/server-rendered and cacheable — only the /api routes
// underneath it (chat, contact, analytics) are dynamic.
export default function Home() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <ScrollProgress />
      <RevealObserver />
      <Nav />
      <PageTransition>
        <main id="main" tabIndex={-1} className="outline-none relative">
          <div className="relative z-10">
            <Hero video={getHeroVideo()} />
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
            <Contact contactEnabled={flags.enableContactForm} />
          </div>
        </main>
      </PageTransition>
      <Footer />
      <LazyWidgets aiEnabled={flags.enableAI} analyticsEnabled={flags.enableAnalytics} />
    </SmoothScrollProvider>
  );
}
