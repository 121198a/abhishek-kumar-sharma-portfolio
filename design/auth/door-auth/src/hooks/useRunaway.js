import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

const RADIUS = 115; // px: how close the pointer can get before the button flees
const NUDGES_BEFORE_HINT = 3;

/**
 * Makes a submit button dodge the pointer while the form is invalid.
 * Does nothing under prefers-reduced-motion. Returns refs for the button and
 * its arena plus `nudged` (true after the button has dodged a few times).
 */
export function useRunaway({ enabled, active, valid, loading, sceneOn }) {
  const btnRef = useRef(null);
  const arenaRef = useRef(null);
  const motion = useRef({ x: 0, y: 0, tx: 0, ty: 0, n: 0 });
  const live = useRef({});
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    live.current = { active, valid, loading, sceneOn };
  });

  // Return to the start whenever the view is shown/hidden.
  useEffect(() => {
    Object.assign(motion.current, { x: 0, y: 0, tx: 0, ty: 0, n: 0 });
    setNudged(false);
  }, [active]);

  // A valid form stops running away.
  useEffect(() => {
    if (valid) motion.current.tx = motion.current.ty = 0;
  }, [valid]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return undefined;

    const dodge = (px, py) => {
      const { active: on, valid: ok, loading: busy, sceneOn: scene } = live.current;
      const btn = btnRef.current;
      const arena = arenaRef.current;
      if (!on || ok || busy || scene || !btn || !arena) return;

      const m = motion.current;
      const rect = btn.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - px;
      const dy = rect.top + rect.height / 2 - py;
      const dist = Math.hypot(dx, dy);
      if (dist > RADIUS) return;

      const k = (RADIUS - dist) / RADIUS;
      const maxX = arena.clientWidth - btn.offsetWidth;
      const maxY = arena.clientHeight - btn.offsetHeight;
      const len = Math.max(dist, 1);

      m.tx += (dx / len) * 150 * k;
      m.ty += (dy / len) * 60 * k;
      m.tx = Math.min(Math.max(m.tx, 0), maxX);
      m.ty = Math.min(Math.max(m.ty, -14), maxY + 24);
      // Cornered: hop to the other side.
      if ((m.tx <= 2 && dx < 0) || (m.tx >= maxX - 2 && dx > 0)) {
        m.tx = m.tx < maxX / 2 ? maxX : 0;
      }
      if (++m.n === NUDGES_BEFORE_HINT) setNudged(true);
    };

    const onMove = (e) => dodge(e.clientX, e.clientY);
    const onDown = (e) => {
      if (btnRef.current?.contains(e.target)) dodge(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown, true);

    let raf = 0;
    let last = "";
    const loop = () => {
      const btn = btnRef.current;
      if (btn && live.current.active) {
        const m = motion.current;
        m.x += (m.tx - m.x) * 0.16;
        m.y += (m.ty - m.y) * 0.16;
        const next = `translate(${m.x}px,${m.y}px) rotate(${(m.tx - m.x) * 0.2}deg)`;
        if (next !== last) {
          btn.style.transform = next;
          last = next;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown, true);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return { btnRef, arenaRef, nudged };
}
