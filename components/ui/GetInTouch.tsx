"use client";

import { useRef, useState } from "react";
import { siFacebook, siInstagram, siX, type SimpleIcon } from "simple-icons";
import { Github, Linkedin } from "@/components/ui/Icons";

type SocialLinks = Partial<
  Record<"github" | "linkedin" | "facebook" | "instagram" | "x" | "whatsapp", string>
>;

type SocialNetwork = { key: keyof SocialLinks; label: string } & (
  | { Icon: typeof Github }
  | { icon: SimpleIcon }
);

const networks: SocialNetwork[] = [
  { key: "github", label: "GitHub", Icon: Github },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "facebook", label: "Facebook", icon: siFacebook },
  { key: "instagram", label: "Instagram", icon: siInstagram },
  { key: "x", label: "X", icon: siX },
];

export default function GetInTouch({
  links,
  id,
  className = "",
}: {
  links: SocialLinks;
  id: string;
  className?: string;
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const open = pinned || hovered || focused;

  return (
    <div
      className={`contact-button ${className}`}
      data-open={open}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
          setPinned(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          triggerRef.current?.focus();
          setPinned(false);
          setHovered(false);
          setFocused(false);
        }
      }}
    >
      <div className="contact-outline" aria-hidden="true" />
      <button
        ref={triggerRef}
        type="button"
        className="contact-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (open && pinned) {
            setPinned(false);
            setFocused(false);
            setHovered(false);
          } else {
            setPinned(true);
          }
        }}
      >
        <span>Get In Touch</span>
      </button>
      <div
        id={id}
        className="contact-networks"
        role="group"
        aria-label="Social profiles"
        aria-hidden={!open}
      >
        {networks.map((network) => {
          const href = links[network.key];
          if (!href) return null;

          return (
            <a
              key={network.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${network.label} profile (opens in a new tab)`}
              tabIndex={open ? 0 : -1}
              className="contact-social"
            >
              {"Icon" in network ? (
                <network.Icon className="h-5 w-5" />
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                  <path fill="currentColor" d={network.icon.path} />
                </svg>
              )}
              <span className="contact-tooltip" role="tooltip">
                {network.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}