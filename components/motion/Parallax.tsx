"use client";

import React, { useEffect, useRef, useState } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.2 to 0.2 (restrained)
  className?: string;
}

export default function Parallax({
  children,
  speed = 0.1,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisabled(true);
      return;
    }

    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Center of element relative to center of viewport
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = elementCenter - viewportCenter;
            setOffsetY(distance * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  const style: React.CSSProperties = disabled
    ? {}
    : {
        transform: `translate3d(0, ${offsetY.toFixed(2)}px, 0)`,
        willChange: "transform",
      };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
