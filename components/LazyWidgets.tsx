"use client";

import dynamic from "next/dynamic";

// Non-critical widgets: loaded after the page is interactive so they don't
// compete with the hero for main-thread time. ssr:false needs a client wrapper.
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/CookieBanner"), { ssr: false });

export default function LazyWidgets({
  aiEnabled,
  analyticsEnabled,
}: {
  aiEnabled: boolean;
  analyticsEnabled: boolean;
}) {
  return (
    <>
      <AIChat aiEnabled={aiEnabled} />
      <CookieBanner analyticsEnabled={analyticsEnabled} />
    </>
  );
}
