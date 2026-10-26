import { useFrame, useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useRef } from "react";
import * as ReactDOM from "react-dom/client";
import * as THREE from "three";

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();

export interface HtmlProps {
  children?: React.ReactNode;
  position?: [number, number, number];
  center?: boolean;
  zIndexRange?: [number, number];
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Drop-in, React 19-safe 3D HTML projection component.
 * Replaces Drei's Html to avoid synchronous root.unmount() during React render/commit cycles.
 */
export function Html({
  children,
  position = [0, 0, 0],
  center = false,
  zIndexRange = [16777271, 0],
  style,
  className,
}: HtmlProps) {
  const { gl, camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const elRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<ReactDOM.Root | null>(null);

  useLayoutEffect(() => {
    const target = gl.domElement.parentElement;
    if (!target) return;

    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";
    el.style.pointerEvents = "none";
    el.style.willChange = "transform, opacity";
    if (className) el.className = className;

    target.appendChild(el);
    const root = ReactDOM.createRoot(el);
    elRef.current = el;
    rootRef.current = root;

    return () => {
      if (target.contains(el)) {
        target.removeChild(el);
      }
      // Safe asynchronous root unmount to avoid React 19 synchronous unmount during render/commit warning
      setTimeout(() => {
        root.unmount();
      }, 0);
    };
  }, [gl, className]);

  useLayoutEffect(() => {
    if (rootRef.current) {
      rootRef.current.render(
        <div
          style={{
            position: "absolute",
            transform: center ? "translate3d(-50%, -50%, 0)" : "none",
            ...style,
          }}
        >
          {children}
        </div>,
      );
    }
  });

  useFrame(() => {
    const el = elRef.current;
    if (!group.current || !el) return;
    v1.setFromMatrixPosition(group.current.matrixWorld);

    // Check if behind camera
    v2.setFromMatrixPosition(camera.matrixWorld);
    v3.subVectors(v1, v2);
    const camDir = camera.getWorldDirection(v2);
    const isBehind = v3.angleTo(camDir) > Math.PI / 2;

    if (isBehind) {
      if (el.style.display !== "none") el.style.display = "none";
      return;
    }

    if (el.style.display === "none") el.style.display = "block";

    // Project coordinates
    v1.project(camera);
    const x = (v1.x * 0.5 + 0.5) * size.width;
    const y = (-v1.y * 0.5 + 0.5) * size.height;

    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

    // Calculate z-index from depth
    if (zIndexRange) {
      const dist = v3.length();
      const [zNear, zFar] = zIndexRange;
      const factor = THREE.MathUtils.clamp((dist - camera.near) / (camera.far - camera.near), 0, 1);
      const zIndex = Math.round(zNear + factor * (zFar - zNear));
      el.style.zIndex = `${zIndex}`;
    }
  });

  return <group ref={group} position={position} />;
}
