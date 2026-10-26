import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
// Deterministic stars (no Math.random, stable across renders)
const STARS = Array.from({ length: 26 }, (_, i) => ({
  x: 30 + ((i * 397) % 1100),
  y: 10 + ((i * 131) % 105),
  r: 1 + ((i * 7) % 10) / 10,
  d: (i % 7) / 7,
}));
const ext = (pts) =>
  pts
    .map(([x, y]) => [x <= 0 ? -30 : x >= 1160 ? 1190 : x, y].join(","))
    .join(" ");
const FAR = ext([
  [0, 215],
  [250, 133],
  [330, 165],
  [470, 125],
  [640, 195],
  [780, 145],
  [900, 195],
  [1000, 155],
  [1160, 205],
  [1160, 255],
  [0, 255],
]);
const MID = ext([
  [0, 240],
  [60, 235],
  [330, 155],
  [520, 210],
  [700, 135],
  [860, 205],
  [1050, 105],
  [1160, 180],
  [1160, 255],
  [0, 255],
]);
const NEAR = ext([
  [0, 235],
  [190, 195],
  [360, 225],
  [560, 185],
  [760, 225],
  [960, 197],
  [1160, 225],
  [1160, 255],
  [0, 255],
]);
const SHOOT = [
  [640, 16, 9, 0.2],
  [260, 34, 13, 0.62],
  [860, 10, 17, 0.9],
]; // x, y, period (s), phase
const RAYS = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
const TREES = [30, 270, 470, 640, 740, 880, 960, 1090];
const px = (k) => ({
  transform: `translateX(calc(var(--px, 0) * ${k}px))`,
  transition: "transform .5s ease-out",
});
const Layer = ({ k, pts, fill, op = 1, children }) => (
  <g style={px(k)}>
    <polygon points={pts} fill={fill} opacity={op} />
    <g className="litpulse">
      <polygon className="lit" points={pts} fill="url(#warmG)" opacity="0" />
    </g>
    <polygon className="moonlit" points={pts} fill="url(#coolG)" opacity="0" />
    <polygon className="shade" points={pts} fill="#0a1233" opacity="0" />
    {children}
  </g>
);
const STATE = {
  light: {
    shade: 0,
    dusk: 0,
    night: 0,
    stars: 0,
    moon: 0,
    glow: 0,
    sun: 1,
    sunglow: 1,
    clouds: 0.9,
    lit: 1,
    moonlit: 0,
    shoot: 0,
  },
  dark: {
    shade: 0.62,
    dusk: 1,
    night: 1,
    stars: 1,
    moon: 1,
    glow: 1,
    sun: 0,
    sunglow: 0,
    clouds: 0.4,
    lit: 0,
    moonlit: 0.6,
    shoot: 1,
  },
};
export default function Scene({ theme, mult }) {
  const root = useRef(null),
    tl = useRef(null),
    first = useRef(true),
    m = useRef(mult);
  m.current = mult;
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root),
      night = theme === "dark",
      s = STATE[theme];
    if (first.current) {
      first.current = false;
      gsap.set(q(".sun"), { y: night ? 140 : 0, opacity: s.sun });
      gsap.set(q(".sunglow"), { opacity: s.sunglow });
      gsap.set(q(".dusk"), { opacity: 0 });
      gsap.set(q(".night"), { opacity: s.night });
      gsap.set(q(".star"), { opacity: s.stars });
      gsap.set(q(".moon"), { y: night ? 0 : 70, opacity: s.moon });
      gsap.set(q(".moonglow"), { opacity: s.glow });
      gsap.set(q(".clouds"), { opacity: s.clouds });
      gsap.set(q(".shade"), { opacity: s.shade });
      gsap.set(q(".lit"), { opacity: s.lit });
      gsap.set(q(".moonlit"), { opacity: s.moonlit });
      gsap.set(q(".shooters"), { opacity: s.shoot });
      if (!night && m.current > 0.05) {
        // one-time sunrise on load (skipped for reduced motion)
        tl.current = gsap
          .timeline()
          .from(q(".sun"), { y: 90, opacity: 0, duration: 2.4 * m.current, ease: "power3.out" }, 0)
          .from(q(".sunglow"), { opacity: 0, duration: 3 * m.current, ease: "power2.out" }, 0.3)
          .from(q(".lit"), { opacity: 0, duration: 3 * m.current }, 0.4);
      }
      return;
    }
    tl.current?.kill(); // reverse-safe: new timeline tweens from the current (mid-flight) values
    const d = 2.8 * m.current;
    const t = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    if (night) {
      t.to(q(".sun"), { y: 140, opacity: 0, duration: d * 0.7 }, 0)
        .to(q(".sunglow"), { opacity: 0, duration: d * 0.5 }, 0)
        .to(q(".dusk"), { opacity: 1, duration: d * 0.35 }, 0)
        .to(q(".night"), { opacity: 1, duration: d * 0.6 }, d * 0.3)
        .to(q(".shade"), { opacity: 0.62, duration: d * 0.9 }, d * 0.1)
        .to(q(".clouds"), { opacity: 0.4, duration: d * 0.6 }, 0)
        .to(q(".lit"), { opacity: 0, duration: d * 0.5 }, 0)
        .to(q(".moonlit"), { opacity: 0.6, duration: d * 0.6 }, d * 0.5)
        .to(q(".shooters"), { opacity: 1, duration: d * 0.4 }, d * 0.8)
        .to(q(".moon"), { y: 0, opacity: 1, duration: d * 0.6 }, d * 0.45)
        .to(q(".moonglow"), { opacity: 1, duration: d * 0.6 }, d * 0.5)
        .to(
          q(".star"),
          {
            opacity: 1,
            duration: d * 0.4,
            stagger: { each: d * 0.02, from: "random" },
          },
          d * 0.5,
        );
    } else {
      t.to(
        q(".star"),
        {
          opacity: 0,
          duration: d * 0.25,
          stagger: { each: d * 0.008, from: "random" },
        },
        0,
      )
        .to(q(".moon"), { y: 70, opacity: 0, duration: d * 0.4 }, 0)
        .to(q(".moonglow"), { opacity: 0, duration: d * 0.3 }, 0)
        .to(q(".night"), { opacity: 0, duration: d * 0.6 }, 0)
        .to(q(".dusk"), { opacity: 0.9, duration: d * 0.3 }, 0)
        .to(q(".sun"), { y: 0, opacity: 1, duration: d * 0.8 }, d * 0.2)
        .to(q(".sunglow"), { opacity: 1, duration: d * 0.6 }, d * 0.3)
        .to(q(".dusk"), { opacity: 0, duration: d * 0.5 }, d * 0.5)
        .to(q(".shade"), { opacity: 0, duration: d * 0.8 }, d * 0.1)
        .to(q(".clouds"), { opacity: 0.9, duration: d * 0.6 }, d * 0.4)
        .to(q(".shooters"), { opacity: 0, duration: d * 0.2 }, 0)
        .to(q(".moonlit"), { opacity: 0, duration: d * 0.4 }, 0)
        .to(q(".lit"), { opacity: 1, duration: d * 0.7 }, d * 0.35);
    }
    tl.current = t;
  }, [theme]);
  useLayoutEffect(() => () => tl.current?.kill(), []);
  return (
    <svg
      ref={root}
      className="tv-scene"
      viewBox="0 0 1160 255"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".5" stopColor="#eaf4ff" />
          <stop offset=".8" stopColor="#fff0d8" />
          <stop offset="1" stopColor="#ffd9a6" />
        </linearGradient>
        <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a6d" />
          <stop offset=".5" stopColor="#b24c78" />
          <stop offset=".85" stopColor="#ff9a5c" />
          <stop offset="1" stopColor="#ffb870" />
        </linearGradient>
        <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040818" />
          <stop offset=".55" stopColor="#141b52" />
          <stop offset="1" stopColor="#25437f" />
        </linearGradient>
        <radialGradient id="sunG">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ff9e2c" />
        </radialGradient>
        <radialGradient id="glowG">
          <stop offset="0" stopColor="#ffb54a" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffb54a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonG">
          <stop offset="0" stopColor="#cfe0ff" stopOpacity=".5" />
          <stop offset="1" stopColor="#cfe0ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9db8aa" stopOpacity=".7" />
          <stop offset="1" stopColor="#cfe0d6" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f9a85" />
          <stop offset="1" stopColor="#a9c8b8" />
        </linearGradient>
        <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8a6c" />
          <stop offset="1" stopColor="#8fb8a2" />
        </linearGradient>
        <linearGradient id="warmG" gradientUnits="userSpaceOnUse" x1="1160" y1="0" x2="380" y2="0">
          <stop offset="0" stopColor="#ffb54a" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffb54a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="coolG" gradientUnits="userSpaceOnUse" cx="960" cy="58" r="560">
          <stop offset="0" stopColor="#9fbcff" stopOpacity=".42" />
          <stop offset="1" stopColor="#9fbcff" stopOpacity="0" />
        </radialGradient>
        <mask id="crescent">
          <rect x="-30" y="-30" width="60" height="60" fill="#fff" />
          <circle cx="9" cy="-5" r="14" fill="#000" />
        </mask>
      </defs>
      <rect width="1160" height="255" fill="url(#skyDay)" />
      <rect
        className="dusk"
        width="1160"
        height="255"
        fill="url(#skyDusk)"
        opacity="0"
      />
      <rect
        className="night"
        width="1160"
        height="255"
        fill="url(#skyNight)"
        opacity="0"
      />
      <g>
        {STARS.map((s, i) => (
          <g key={i} className="star">
            <circle
              className="tw"
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#fff"
              style={{
                animationDuration: `calc(var(--tw) * ${(0.5 + s.d * 1.1).toFixed(2)}s)`,
                animationDelay: `calc(var(--tw) * -${(s.d * 3).toFixed(2)}s)`,
              }}
            />
          </g>
        ))}
      </g>
      <g className="shooters">
        {SHOOT.map(([x, y, p, ph], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g
              className="shoot"
              style={{
                animationDuration: `calc(var(--shoot) * ${p}s)`,
                animationDelay: `calc(var(--shoot) * -${(p * ph).toFixed(2)}s)`,
              }}
            >
              <line x1="-46" y1="-19" x2="0" y2="0" stroke="#dfe9ff" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
              <circle r="1.6" fill="#fff" />
            </g>
          </g>
        ))}
      </g>
      <g transform="translate(960 58)">
        <g style={px(3)}>
          <g className="moon">
            <g className="halo">
              <circle className="moonglow" r="64" fill="url(#moonG)" />
            </g>
            <circle r="19" fill="#f6f1dc" mask="url(#crescent)" />
          </g>
        </g>
      </g>
      <g style={px(2)}>
        <g className="clouds">
          {[
            [0, 50, 300, 1, 0.85],
            [0, 95, 650, 1.4, 0.7],
            [0, 35, 920, 0.8, 0.9],
            [0, 72, 120, 1.9, 0.5],
          ].map(([x, y, rx, f, o], i) => (
            <g
              key={i}
              className="cloud"
              style={{
                "--rx": `${rx}px`,
                animationDuration: `calc(var(--cloud) * ${f}s)`,
                animationDelay: `calc(var(--cloud) * -${i * 0.31}s)`,
              }}
            >
              <g className="cl" opacity={o}>
                <ellipse cx={x} cy={y} rx="44" ry="12" />
                <ellipse cx={x + 22} cy={y - 9} rx="28" ry="12" />
                <ellipse cx={x - 20} cy={y - 5} rx="24" ry="9" />
              </g>
            </g>
          ))}
        </g>
      </g>
      <g style={px(3)}>
        <g className="sun">
          <g className="breathe">
            <circle className="sunglow" cx="1110" cy="130" r="115" fill="url(#glowG)" />
          </g>
          {[0, 1].map((k) => (
            <g key={k} className="rays" style={{ animationDelay: `calc(var(--ray) * -${k * 0.5}s)` }}>
              {RAYS.map((a, i) => (
                <line
                  key={a}
                  x1="1110"
                  y1={i % 2 ? 76 : 70}
                  x2="1110"
                  y2={i % 2 ? 54 : 40}
                  transform={`rotate(${a + k * 11} 1110 130)`}
                  stroke="#ffcf6b"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))}
          <circle cx="1110" cy="130" r="40" fill="url(#sunG)" />
        </g>
      </g>
      <Layer k={4} pts={FAR} fill="url(#m1)" />
      <Layer k={9} pts={MID} fill="url(#m2)" op=".8" />
      <Layer k={16} pts={NEAR} fill="url(#m3)" op=".92">
        <path
          d="M-30 225c120-12 260 4 430 0s320-8 460 4 220-4 330-6V255H-30z"
          fill="#fff"
          opacity=".3"
        />
        {TREES.map((x) => (
          <polygon
            key={x}
            points={`${x},255 ${x + 9},213 ${x + 18},255`}
            fill="#4f8a6c"
            opacity=".85"
          />
        ))}
        <path
          className="shade"
          d="M-30 225c120-12 260 4 430 0s320-8 460 4 220-4 330-6V255H-30z"
          fill="#0a1233"
          opacity="0"
        />
      </Layer>
    </svg>
  );
}
