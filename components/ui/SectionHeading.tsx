import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
  id,
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
      ? "text-right ml-auto"
      : "text-left";

  return (
    <div className={`mb-12 max-w-2xl ${alignmentClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-wider text-purple">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className={`break-words text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink ${eyebrow ? "mt-3" : ""}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
