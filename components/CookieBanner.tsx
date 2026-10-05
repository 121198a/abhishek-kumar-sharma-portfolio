"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, trackEvent } from "@/lib/analytics";

export default function CookieBanner({ analyticsEnabled }: { analyticsEnabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  function choose(choice: "all" | "essential") {
    setConsent(choice);
    setVisible(false);
    if (choice === "all") trackEvent("page_view");
  }

  if (!visible) return null;

  // Analytics are off site-wide, so there is no real choice to offer: show one
  // compact notice with a single acknowledgement instead of Accept/Reject.
  if (!analyticsEnabled) {
    return (
      <div
        role="status"
        className="fixed bottom-3 left-3 right-[4.75rem] z-[70] flex items-center gap-3 rounded-xl border border-line bg-panel/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-lg sm:right-auto sm:bottom-5 sm:left-5 sm:max-w-[420px]"
      >
        <p className="flex-1 text-[11px] leading-snug text-muted">
          Essential storage only (your preferences). Analytics are off.
        </p>
        <button
          onClick={() => choose("essential")}
          className="min-h-9 shrink-0 rounded-md border border-line px-3 text-[11px] font-semibold text-ink transition-colors hover:border-ink/50"
        >
          Got it
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-[70] max-w-[390px] rounded-2xl border border-purple/25 bg-panel/95 p-4.5 shadow-2xl backdrop-blur-lg">
      <p className="mb-3 text-[11px] leading-relaxed text-muted">
        🍪 Essential storage keeps your preferences.
        {analyticsEnabled
          ? " Optional analytics only run if you accept — no personal data is collected."
          : " Optional analytics are currently disabled site-wide."}
      </p>
      <div className="flex gap-1.5">
        <button
          onClick={() => choose("all")}
          className="rounded-md bg-violet px-3 py-2 text-[11px] text-white"
        >
          Accept All
        </button>
        <button
          onClick={() => choose("essential")}
          className="rounded-md border border-line px-3 py-2 text-[11px] text-white"
        >
          Reject Optional
        </button>
      </div>
    </div>
  );
}
