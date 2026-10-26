import { SPEC } from "../hooks/useDriving.js";
const ARC = "M21.9 84 A44 44 0 1 1 98.1 84";
const TICKS = Array.from({ length: 13 }, (_, i) => i);
export default function Speedometer({ value, vehicle, onRev }) {
  const max = SPEC[vehicle].max,
    pct = Math.min(1, value / max),
    ang = -120 + pct * 240;
  return (
    <figure
      className={`vm-speedo${pct > 0.85 ? " hot" : ""}`}
      style={{ "--p": pct.toFixed(3) }}
      role="img"
      aria-label={`Simulated speed ${value} kilometres per hour (demo)`}
      title="Simulated speed, demo only"
      onPointerEnter={() => onRev(true)}
      onPointerLeave={() => onRev(false)}
    >
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" className="sp-bg" />
        <circle cx="60" cy="60" r="57" className="sp-ring" />
        <g className="sp-ticks">
          {TICKS.map((i) => (
            <line
              key={i}
              x1="60"
              y1="11"
              x2="60"
              y2={i % 3 ? 14 : 16}
              transform={`rotate(${-120 + i * 20} 60 62)`}
              className={i / 12 <= pct ? "lit" : undefined}
            />
          ))}
        </g>
        <path d={ARC} className="sp-track" pathLength="100" />
        <path
          d={ARC}
          className="sp-arc"
          pathLength="100"
          strokeDasharray={`${pct * 100} 100`}
          opacity={pct < 0.01 ? 0 : 1}
        />
        <g className="sp-needle" style={{ transform: `rotate(${ang}deg)` }}>
          <path
            d="M60 62V24"
            stroke="#ff9d4d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
        <circle cx="60" cy="62" r="4" className="sp-pulse" />
        <circle cx="60" cy="62" r="4" fill="#5cc0ff" />
      </svg>
      <b>{value}</b>
      <small>KM/H</small>
      <em>{vehicle === "car" ? "ELECTRIC" : "ROAD"} · SIMULATED</em>
    </figure>
  );
}
