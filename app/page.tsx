import { flags } from "@/lib/env";
import { getHeroVideo } from "@/lib/media";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { NavigationProvider } from "@/components/providers/NavigationProvider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import PageTransition from "@/components/motion/PageTransition";
import Nav from "@/components/Nav";
import PortfolioContent from "@/components/PortfolioContent";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import LazyWidgets from "@/components/LazyWidgets";

// This page is static/server-rendered and cacheable — only the /api routes
// underneath it (chat, contact, analytics) are dynamic.
export default function Home() {
  return (
    <SmoothScrollProvider>
      <NavigationProvider>
        <CustomCursor />
        <ScrollProgress />
        <RevealObserver />
        <Nav />
        <PageTransition>
          <main id="main" tabIndex={-1} className="outline-none relative">
            <div className="relative z-10">
              <PortfolioContent
                video={getHeroVideo()}
                contactEnabled={flags.enableContactForm}
              />
            </div>
          </main>
        </PageTransition>
        <Footer />
        <LazyWidgets aiEnabled={flags.enableAI} analyticsEnabled={flags.enableAnalytics} />
      </NavigationProvider>
    </SmoothScrollProvider>
  );
}
