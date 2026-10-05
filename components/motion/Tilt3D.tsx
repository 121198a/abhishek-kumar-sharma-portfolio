"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees, e.g. 10
  perspective?: number; // perspective in px, e.g. 1000
  scale?: number; // scale on hover, e.g. 1.02
  glare?: boolean; // dynamic specular glare
  glareOpacity?: number; // glare max opacity, e.g. 0.15
}

export default function Tilt3D({
  children,
  className = "",
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  glareOpacity = 0.15,
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqHover = window.matchMedia("(hover: none)");

    const updateDisabled = () => {
      setDisabled(mqMotion.matches || mqHover.matches);
    };

    updateDisabled();
    mqMotion.addEventListener("change", updateDisabled);
    mqHover.addEventListener("change", updateDisabled);

    return () => {
      mqMotion.removeEventListener("change", updateDisabled);
      mqHover.removeEventListener("change", updateDisabled);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2; // -1 to 1
      const normY = (y / rect.height - 0.5) * 2; // -1 to 1

      const rotateY = normX * maxTilt;
      const rotateX = -normY * maxTilt;

      setCoords({
        rotateX,
        rotateY,
        scale,
      });

      if (glare) {
        setGlarePosition({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: glareOpacity,
        });
      }
    },
    [disabled, glare, glareOpacity, maxTilt, scale]
  );

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    setCoords({ rotateX: 0, rotateY: 0, scale: 1 });
    if (glare) {
      setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transform-gpu ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="w-full h-full transform-gpu transition-transform duration-200 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${coords.rotateX.toFixed(2)}deg) rotateY(${coords.rotateY.toFixed(2)}deg) scale3d(${coords.scale}, ${coords.scale}, 1)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {glare && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
            style={{
              opacity: isHovered ? glarePosition.opacity : 0,
              background: `radial-gradient(circle 300px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.2), transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
