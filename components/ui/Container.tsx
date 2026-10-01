import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={`mx-auto max-w-shell px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Component>
  );
}
