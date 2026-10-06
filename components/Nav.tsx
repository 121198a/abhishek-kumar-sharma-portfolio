"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MotionToggle from "@/components/ui/MotionToggle";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experiences" },
  { href: "#projects", label: "Projects" },
  { href: "#designs", label: "Designs" },
  { href: "#education", label: "Education" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { scrollTo } = useSmoothScroll();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for navbar background transition
  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Monitor active section with IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.slice(1));

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Mobile menu scroll lock and keyboard/focus management
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          menuButtonRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Focus first focusable element inside menu
      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollTo(href);
      setOpen(false);
      menuButtonRef.current?.focus();
    }
  };

  return (
    <header
      className={`nav-header ${open ? "nav-header-open" : ""} ${
        open
          ? "bg-bg border-b border-line"
          : scrolled
          ? "bg-panel/85 backdrop-blur-xl border-b border-line shadow-lg shadow-black/25"
          : "bg-bg/40 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-shell items-center justify-between px-6 sm:px-8">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(0);
          }}
          className="group flex items-center gap-3 font-extrabold tracking-wide"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-panel2 text-ink font-bold text-sm shadow-sm transition-transform duration-300 group-hover:scale-105"
          >
            A
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-ink text-base tracking-tight font-bold group-hover:text-purple transition-colors">
              {profile.name.split(" ")[0]}
            </span>
            <span className="text-xs font-medium text-muted mt-0.5">
              {profile.shortTitle}
            </span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-1 rounded-full border border-line/60 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`nav-link ${
                  isActive
                    ? "text-ink bg-purple/20 shadow-sm border border-purple/30"
                    : "text-muted hover:text-ink hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />
          <MotionToggle />

          <a
            href={profile.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("resume_download")}
            className="btn-secondary"
          >
            Resume ↓
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="btn-primary"
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="btn-icon md:hidden flex-col gap-1.5"
        >
          <span
            className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-ink transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer Navigation (with 3 subtle animated moving background light layers) */}
      {open && createPortal(
        <div
          id="mobile-nav"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-[76px] bottom-0 z-[80] flex flex-col justify-between overflow-y-auto border-t border-line bg-bg p-6 shadow-2xl md:hidden"
        >
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple">
                Navigation
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <MotionToggle />
              </div>
            </div>
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-drawer-link ${
                    isActive
                      ? "bg-purple/20 text-ink border border-purple/35 font-bold"
                      : "text-muted hover:bg-white/[0.04] hover:text-ink"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-purple">→</span>
                </a>
              );
            })}
          </div>

          <div className="mt-8 border-t border-line pt-6 flex flex-col gap-3 relative z-10">
            <a
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("resume_download");
                setOpen(false);
              }}
              className="btn-secondary w-full"
            >
              Download Resume ↓
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="btn-primary w-full"
            >
              Let&apos;s Connect
            </a>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
