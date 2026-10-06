"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center bg-bg text-ink">
      <div className="rounded-full border border-pink/30 bg-pink/10 p-4 mb-6">
        <span className="text-2xl text-pink">⚠</span>
      </div>

      <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#84a2fc]">
        Application Error
      </span>

      <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
        Something unexpected occurred
      </h1>

      <p className="mt-4 max-w-md text-sm text-muted leading-relaxed">
        An error prevented this section from rendering properly. You can try refreshing or returning to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="btn-secondary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
