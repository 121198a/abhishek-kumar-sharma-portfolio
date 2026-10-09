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
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs";

  const variantClasses = {
    purple: "border border-purple/30 bg-purple/15 text-purple",
    subtle: "border border-line bg-panel2/60 text-muted hover:text-ink transition-colors",
    outline: "border border-line text-muted hover:border-purple/40 hover:text-ink transition-colors",
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
