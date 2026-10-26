import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

const COLORS = ["255,79,163", "123,92,255", "255,179,107", "200,60,140"];

/** Animated bokeh + particle ribbon. Pauses when the tab is hidden; static under reduced motion. */
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const c = cv?.getContext?.("2d");
    if (!c) return undefined;

    const reduced = prefersReducedMotion();
    let W = 0;
    let H = 0;
    let mx = 0;
    let my = 0;
    let raf = 0;

    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = window.innerWidth * d;
      cv.height = window.innerHeight * d;
      c.setTransform(d, 0, 0, d, 0, 0);
      W = window.innerWidth;
      H = window.innerHeight;
    };
    size();

    const orbs = Array.from({ length: W < 600 ? 26 : 55 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 6 + Math.random() * 34,
      c: COLORS[i % 4],
      a: 0.08 + Math.random() * 0.25,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.05 - Math.random() * 0.25,
      p: Math.random() * 6,
    }));

    const frame = (t) => {
      c.fillStyle = "#07040f";
      c.fillRect(0, 0, W, H);

      const glow = c.createRadialGradient(W * 0.5, H * 0.9, 0, W * 0.5, H * 0.9, H);
      glow.addColorStop(0, "#3b1458aa");
      glow.addColorStop(1, "#07040f00");
      c.fillStyle = glow;
      c.fillRect(0, 0, W, H);

      for (const o of orbs) {
        if (!reduced) {
          o.x += o.vx;
          o.y += o.vy;
        }
        if (o.y < -50) {
          o.y = H + 50;
          o.x = Math.random() * W;
        }
        const px = o.x + mx * o.r * 1.5;
        const py = o.y + my * o.r * 1.5;
        const al = o.a * (0.7 + 0.3 * Math.sin(t + o.p));
        const rg = c.createRadialGradient(px, py, o.r * 0.2, px, py, o.r);
        rg.addColorStop(0, `rgba(${o.c},${al})`);
        rg.addColorStop(0.85, `rgba(${o.c},${al * 0.8})`);
        rg.addColorStop(1, `rgba(${o.c},0)`);
        c.fillStyle = rg;
        c.beginPath();
        c.arc(px, py, o.r, 0, 7);
        c.fill();
      }

      c.globalCompositeOperation = "lighter";
      const N = W < 600 ? 260 : 520;
      for (let i = 0; i < N; i++) {
        const u = i / N;
        const x = u * W * 1.05 - W * 0.02;
        const y =
          H * 0.78 -
          u * H * 0.36 +
          Math.sin(u * 5 + t * 0.6 + i * 0.01) * H * 0.06 * (1 - u * 0.4) +
          (((i * 37) % 17) - 8) * (1 + u * 3);
        const alpha = 0.35 + 0.4 * Math.abs(Math.sin(i + t * 0.8));
        c.fillStyle = `rgba(255,${(120 + u * 100) | 0},${(190 - u * 60) | 0},${alpha})`;
        const s = 1.6 + (i % 3) * 0.7;
        c.fillRect(x + mx * 20, y, s, s);
      }
      c.globalCompositeOperation = "source-over";
    };

    const loop = (ts) => {
      frame(ts * 0.001);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced) frame(0);
      else raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      size();
      if (reduced) frame(0);
    };
    const onPointer = (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) start();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas id="bg" ref={canvasRef} aria-hidden="true" />;
}
