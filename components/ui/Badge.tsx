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
  const sizeClass = size === "md" ? "px-3.5 py-1.5" : "";
  const variantClass = `badge-tag-${variant}`;

  return (
    <span className={`badge-tag ${variantClass} ${sizeClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
