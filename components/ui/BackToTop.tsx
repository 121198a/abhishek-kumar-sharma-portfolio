"use client";

import React, { useEffect, useState } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    let ticking = false;

    function checkScroll() {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    checkScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleScrollTop = () => {
    scrollTo(0);
  };

  return (
    <button
      type="button"
      onClick={handleScrollTop}
      aria-label="Back to top"
      className={`fixed bottom-24 right-6 z-40 btn-icon shadow-lg backdrop-blur-md transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:-translate-y-0.5"
      >
        <path
          d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
