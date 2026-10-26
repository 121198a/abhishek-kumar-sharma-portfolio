import { useEffect, useRef, useState } from "react";
// Simulated speed (demo only, NOT telemetry). Numeric speed never depends on the animation preset;
// the preset only scales how fast road/wheels/streaks are drawn (rate).
export const SPEC = {
  car: { low: 84, cruise: 158, max: 220 },
  bike: { low: 52, cruise: 96, max: 140 },
};
const sm = (x) => x * x * (3 - 2 * x),
  lerp = (a, b, t) => a + (b - a) * t;
const LAUNCH = 4.5; // seconds to accelerate from 0 to cruise on load
// boost: ref whose .current is true while the user hovers the car/speedometer ("rev").
export function useDriving(rootRef, vehicle, rate, calm, boost) {
  const [speed, setSpeed] = useState(0);
  const live = useRef({
    v: 0,
    road: 0,
    rot: 0,
    sky: 0,
    t: 0,
    vehicle,
    rate,
    calm,
  });
  live.current.vehicle = vehicle;
  live.current.rate = rate;
  live.current.calm = calm;
  useEffect(() => {
    const s = live.current,
      root = rootRef.current;
    if (!root) return undefined;
    let raf,
      prev = performance.now(),
      last = 0,
      shown = -1;
    const frame = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.1);
      prev = now;
      s.t += dt;
      const c = SPEC[s.vehicle],
        p = s.t % 16,
        revving = boost.current;
      // launch 0 -> cruise, then a 16s cycle: accelerate -> cruise -> decelerate -> hold
      let target =
        s.t < LAUNCH
          ? lerp(0, c.cruise, sm(s.t / LAUNCH))
          : p < 4
            ? lerp(c.low, c.cruise, sm(p / 4))
            : p < 11
              ? c.cruise + Math.sin(p * 1.3) * 3
              : p < 14
                ? lerp(c.cruise, c.low, sm((p - 11) / 3))
                : c.low;
      if (revving) target = c.max * 0.94 + Math.sin(s.t * 9) * 2;
      s.v += (target - s.v) * (1 - Math.exp(-dt * (revving ? 1.3 : 2.5)));
      const px = s.v * 2.2 * s.rate * dt;
      s.rot = (s.rot + (px / 44) * 57.3 * (s.calm ? 0.3 : 1)) % 360;
      root.style.setProperty("--rot", s.rot.toFixed(1));
      if (!s.calm) {
        // scrolling scenery is the large-motion part: frozen in calm mode
        s.road = (s.road + px) % 3600;
        s.sky = (s.sky + px * 0.1) % 600;
        root.style.setProperty("--road", s.road.toFixed(1));
        root.style.setProperty("--sky", s.sky.toFixed(1));
      }
      if (now - last > 66) {
        last = now;
        const r = Math.round(s.v);
        if (r !== shown) {
          shown = r;
          setSpeed(r);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [rootRef, boost]);
  return speed;
}
