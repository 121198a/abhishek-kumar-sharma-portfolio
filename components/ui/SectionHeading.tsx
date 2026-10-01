import React from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
      ? "text-right ml-auto"
      : "text-left";

  return (
    <div className={`mb-12 max-w-2xl ${alignmentClass} ${className}`}>
      <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#c084fc]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
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
