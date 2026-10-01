import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "subtle" | "outline" | "success";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "subtle",
  size = "sm",
  className = "",
}: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs";

  const variantClasses = {
    purple: "border border-purple/30 bg-purple/15 text-[#d8b4fe]",
    subtle: "border border-white/10 bg-white/[0.04] text-muted hover:text-white transition-colors",
    outline: "border border-line text-muted hover:border-purple/40 hover:text-white transition-colors",
    success: "border border-[#86efac]/30 bg-[#86efac]/10 text-[#86efac]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-tight ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
