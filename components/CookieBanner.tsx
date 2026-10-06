"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, trackEvent } from "@/lib/analytics";

export default function CookieBanner({ analyticsEnabled }: { analyticsEnabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (analyticsEnabled) setVisible(getConsent() === null);
  }, [analyticsEnabled]);

  function choose(choice: "all" | "essential") {
    setConsent(choice);
    setVisible(false);
    if (choice === "all") trackEvent("page_view");
  }

  if (!analyticsEnabled || !visible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[70] max-w-[390px] rounded-2xl border border-line bg-panel/95 p-4.5 shadow-2xl backdrop-blur-lg">
      <p className="mb-3 text-xs leading-relaxed text-muted">
        Essential storage keeps your preferences. Optional analytics only run if you accept — no personal data is collected.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => choose("all")}
          className="btn-primary"
        >
          Accept All
        </button>
        <button
          onClick={() => choose("essential")}
          className="btn-secondary"
        >
          Reject Optional
        </button>
      </div>
    </div>
  );
}
