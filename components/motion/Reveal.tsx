"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number; // in seconds
  duration?: number; // in seconds
  className?: string;
  threshold?: number;
  /** Above-the-fold content: CSS-only entrance, no hydration wait, visible without JS. */
  immediate?: boolean;
}

function RevealObserved({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getTransform = () => {
    if (prefersReducedMotion || isVisible) return "none";
    switch (direction) {
      case "up":
        return "translateY(32px)";
      case "down":
        return "translateY(-32px)";
      case "left":
        return "translateX(32px)";
      case "right":
        return "translateX(-32px)";
      case "none":
      default:
        return "none";
    }
  };

  const style: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: isVisible ? "auto" : "opacity, transform",
      };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

export default function Reveal(props: RevealProps) {
  if (props.immediate) {
    const { children, delay = 0, duration = 0.7, className = "" } = props;
    return (
      <div
        className={`reveal-immediate ${className}`}
        style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    );
  }
  return <RevealObserved {...props} />;
}
