export default function Car() {
  const wheel = (cx) => (
    <g transform={`translate(${cx} 150)`}>
      <circle r="46" fill="#05080f" stroke="#1b2a44" strokeWidth="4" />
      <circle r="24" fill="none" stroke="#bfe3ff" strokeWidth="3" />
      <circle
        r="7"
        fill="#8fd0ff"
        style={{ filter: "drop-shadow(0 0 6px #4db2ff)" }}
      />
    </g>
  );
  return (
    <svg
      className="vm-car"
      viewBox="0 0 520 210"
      aria-label="Blue electric sedan"
      role="img"
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4aff53" />
          <stop offset=".6" stopColor="#2a62d6" />
          <stop offset="1" stopColor="#8f1a33" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffa5f" />
          <stop offset="1" stopColor="#dd7710" />
        </linearGradient>
        <radialGradient id="hl">
          <stop offset="0" stopColor="#626038" />
          <stop offset="1" stopColor="#8fd0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M10 130 C12 118 40 112 80 108 L80 98 L40 96 L50 90 L84 92 C120 52 170 30 240 28 C310 26 370 34 410 76 C450 82 490 100 508 120 C516 128 510 142 496 148 L40 150 C16 148 8 140 10 130Z"
        fill="url(#body)"
      />
      <path
        d="M118 88 C140 56 180 42 235 42 L235 88Z"
        fill="url(#glass)"
        opacity=".9"
      />
      <path
        d="M245 42 C300 40 350 46 380 84 L245 88Z"
        fill="#2f78e0"
        opacity=".85"
      />
      <path d="M245 42V150" stroke="#ff8fd8" strokeOpacity=".4" />
      <path
        d="M40 142 L496 142"
        stroke="#58c0ff"
        strokeWidth="3"
        opacity=".8"
      />
      <ellipse cx="22" cy="120" rx="16" ry="7" fill="#ffe14d" opacity=".85" />
      <ellipse cx="490" cy="104" rx="22" ry="10" fill="url(#hl)" />
      {wheel(120)}
      {wheel(390)}
    </svg>
  );
}
