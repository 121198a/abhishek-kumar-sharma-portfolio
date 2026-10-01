"use client";

import React, { useState, useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills & Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
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
      className={`fixed top-0 left-0 right-0 z-50 h-[76px] transition-all duration-300 ${
        scrolled
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
            className="grid h-9 w-9 place-items-center rounded-xl border border-purple/40 bg-gradient-to-br from-purple to-violet text-white font-black text-base shadow-md transition-transform duration-300 group-hover:scale-105"
          >
            A
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-white text-base tracking-tight font-bold group-hover:text-purple transition-colors">
              {profile.name.split(" ")[0]}
            </span>
            <span className="text-[9px] font-medium tracking-[0.18em] text-muted uppercase mt-0.5">
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
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-white bg-purple/20 shadow-sm border border-purple/30"
                    : "text-muted hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={profile.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("resume_download")}
            className="rounded-lg border border-purple/40 px-4 py-2 text-xs font-semibold text-white/90 transition-all duration-200 hover:border-purple hover:bg-purple/10 hover:text-white"
          >
            Resume ↓
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="glow rounded-lg px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:opacity-95 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
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
          className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-panel2/80 p-2 text-white transition hover:border-purple/50 md:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-white transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-white transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-white transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {open && (
        <div
          id="mobile-nav"
          ref={mobileMenuRef}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-[76px] bottom-0 z-50 flex flex-col justify-between overflow-y-auto bg-bg/95 backdrop-blur-2xl border-t border-line p-6 md:hidden"
        >
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#c084fc] uppercase mb-2">
              Menu Navigation
            </span>
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition ${
                    isActive
                      ? "bg-purple/20 text-white border border-purple/35"
                      : "text-muted hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-purple/70">→</span>
                </a>
              );
            })}
          </div>

          <div className="mt-8 border-t border-line pt-6 flex flex-col gap-3">
            <a
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("resume_download");
                setOpen(false);
              }}
              className="flex items-center justify-center rounded-xl border border-purple/50 bg-panel py-3 text-sm font-semibold text-white transition hover:bg-purple/10"
            >
              Download Resume ↓
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="glow flex items-center justify-center rounded-xl py-3 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)" }}
            >
              Let&apos;s Connect
            </a>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("github_click")}
                className="hover:text-white"
              >
                GitHub ↗
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("linkedin_click")}
                className="hover:text-white"
              >
                LinkedIn ↗
              </a>
              <a href={`mailto:${profile.email}`} className="hover:text-white">
                Email ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
