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
  return (
    <span className={`badge badge-${size} badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
