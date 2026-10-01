import { flags } from "@/lib/env";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Projects from "@/components/Projects";
import SkillsExperience from "@/components/SkillsExperience";
import Education from "@/components/Education";
import AIIntro from "@/components/AIIntro";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import CookieBanner from "@/components/CookieBanner";
import RevealObserver from "@/components/RevealObserver";

// This page is static/server-rendered and cacheable — only the /api routes
// underneath it (chat, contact, analytics) are dynamic.
export default function Home() {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <RevealObserver />
      <Nav />
      <main>
        <Hero />
        <About />
        <Capabilities />
        <Projects />
        <SkillsExperience />
        <Education />
        <AIIntro />
        <Contact contactEnabled={flags.enableContactForm} />
      </main>
      <Footer />
      <BackToTop />
      <AIChat aiEnabled={flags.enableAI} />
      <CookieBanner analyticsEnabled={flags.enableAnalytics} />
    </SmoothScrollProvider>
  );
}
