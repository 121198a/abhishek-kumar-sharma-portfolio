"use client";

import React, { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { useMotionPreference } from "@/components/providers/MotionPreferenceProvider";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const introCompletedRef = useRef(false);
  const { motionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!motionEnabled) {
      introCompletedRef.current = true;
      setIntroComplete(true);
      return;
    }
    if (introCompletedRef.current) return;

    const completeIntro = () => {
      introCompletedRef.current = true;
      setIntroComplete(true);
    };
    const fallbackTimer = window.setTimeout(completeIntro, 1450);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [motionEnabled]);

  const handleIntroAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.animationName === "intro-screen-dismiss") {
      introCompletedRef.current = true;
      setIntroComplete(true);
    }
  };

  return (
    <>
      <div className={`page-transition-content ${introComplete ? "page-transition-content--ready" : ""}`}>
        {children}
      </div>
      {!introComplete && (
        <div
          className="intro-screen"
          aria-hidden="true"
          onAnimationEnd={handleIntroAnimationEnd}
        >
          <span className="intro-screen-name">{profile.name}</span>
        </div>
      )}
    </>
  );
}
