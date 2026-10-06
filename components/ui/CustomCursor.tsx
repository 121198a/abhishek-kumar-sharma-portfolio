"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  type CursorVariant = "default" | "hover" | "project" | "text";

  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const lastAppearanceRef = useRef<{ variant: CursorVariant; text: string }>({ variant: "default", text: "" });

  // Position references for smooth interpolation (lerp)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Touch devices use their native pointer; reduced motion uses a no-trail cursor.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch) {
      setDisabled(true);
      return;
    }

    setDisabled(false);

    const syncCursorAppearance = (target: HTMLElement | null) => {
      let variant: CursorVariant = "default";
      let text = "";

      if (!target) {
        variant = "default";
      } else {
        const cursorAttr = target.closest<HTMLElement>("[data-cursor]");
        const projectCard = target.closest<HTMLElement>("article, [data-cursor-project]");
        const clickable = target.closest<HTMLElement>("button, a, [role='button'], input, textarea");

        if (cursorAttr) {
          variant = "hover";
          text = cursorAttr.getAttribute("data-cursor") || "VIEW";
        } else if (projectCard) {
          variant = "project";
          text = "VIEW PROJECT";
        } else if (clickable) {
          variant = "hover";
          text = "";
        }
      }

      if (lastAppearanceRef.current.variant !== variant || lastAppearanceRef.current.text !== text) {
        lastAppearanceRef.current = { variant, text };
        setCursorVariant(variant);
        setCursorText(text);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (prefersReducedMotion && ringRef.current) {
        ringPos.current = { x: e.clientX, y: e.clientY };
        ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      syncCursorAppearance(target);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth Lerp loop for the trailing ring
    const render = () => {
      const lerpFactor = 0.08;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    if (!prefersReducedMotion) {
      rafId.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (disabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`custom-cursor pointer-events-none fixed inset-0 z-[999] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-purple transition-transform duration-75 will-change-transform"
      />

      {/* Trailing Dynamic Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full will-change-transform transition-[width,height,background-color,border-color] duration-200 ${
          cursorVariant === "project"
            ? "-ml-12 -mt-12 h-24 w-24 border border-purple/60 bg-panel/80 text-[10px] font-bold tracking-widest text-purple backdrop-blur-sm shadow-xl"
            : cursorVariant === "hover"
            ? cursorText
              ? "-ml-8 -mt-8 h-16 w-16 border border-purple bg-panel/85 text-[9px] font-bold tracking-wider text-ink backdrop-blur-sm shadow-lg"
              : "-ml-5 -mt-5 h-10 w-10 border border-purple/50 bg-purple/10"
            : "-ml-3 -mt-3 h-6 w-6 border border-ink/30 bg-transparent"
        }`}
      >
        {cursorText && (
          <span className="text-center font-mono leading-none select-none px-1">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
