const Wheel = ({ cx, tone, hub }) => (
  <g transform={`translate(${cx} 150)`}>
    <circle r="46" fill="#05080f" stroke="#1b2a44" strokeWidth="4" />
    <g className="wheel">
      <circle r="34" fill="none" stroke={tone} strokeWidth="2.5" />
      {[0, 72, 144, 216, 288].map((a) => (
        <line
          key={a}
          y1="-9"
          y2="-33"
          transform={`rotate(${a})`}
          stroke={tone}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      ))}
    </g>
    <circle
      r="8"
      fill={hub}
      style={{ filter: `drop-shadow(0 0 6px ${hub})` }}
    />
  </g>
);
export function Car() {
  return (
    <svg
      className="vm-svg"
      viewBox="0 0 520 210"
      role="img"
      aria-label="Blue electric sedan"
    >
      <defs>
        <linearGradient id="cb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a9bff" />
          <stop offset=".6" stopColor="#2a62d6" />
          <stop offset="1" stopColor="#1a3d8f" />
        </linearGradient>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5fb0ff" />
          <stop offset="1" stopColor="#2d6fd6" />
        </linearGradient>
        <radialGradient id="hl">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#8fd0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M10 130 C12 118 40 112 80 108 L80 98 L40 96 L50 90 L84 92 C120 52 170 30 240 28 C310 26 370 34 410 76 C450 82 490 100 508 120 C516 128 510 142 496 148 L40 150 C16 148 8 140 10 130Z"
        fill="url(#cb)"
      />
      <path
        d="M118 88 C140 56 180 42 235 42 L235 88Z"
        fill="url(#cg)"
        opacity=".9"
      />
      <path
        d="M245 42 C300 40 350 46 380 84 L245 88Z"
        fill="#2f78e0"
        opacity=".85"
      />
      <path d="M245 42V150" stroke="#8fc8ff" strokeOpacity=".4" />
      <path
        d="M40 142 L496 142"
        stroke="#58c0ff"
        strokeWidth="3"
        opacity=".8"
      />
      <ellipse cx="22" cy="120" rx="16" ry="7" fill="#ff4d5a" opacity=".85" />
      <ellipse cx="490" cy="104" rx="22" ry="10" fill="url(#hl)" />
      <Wheel cx={120} tone="#bfe3ff" hub="#8fd0ff" />
      <Wheel cx={390} tone="#bfe3ff" hub="#8fd0ff" />
    </svg>
  );
}
export function Bike() {
  return (
    <svg
      className="vm-svg"
      viewBox="0 0 520 210"
      role="img"
      aria-label="Motorcycle"
    >
      <defs>
        <linearGradient id="bk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a9bff" />
          <stop offset="1" stopColor="#1f5fd0" />
        </linearGradient>
      </defs>
      <ellipse cx="260" cy="199" rx="200" ry="7" fill="#000" opacity=".2" />
      <Wheel cx={110} tone="#8a97ad" hub="#d7e3f5" />
      <Wheel cx={410} tone="#8a97ad" hub="#d7e3f5" />
      <g stroke="#1c2a44" strokeWidth="9" strokeLinecap="round" fill="none">
        <path d="M110 150 L238 126" />
        <path d="M410 150 L360 74" />
        <path d="M238 126 L305 108" />
      </g>
      <rect x="226" y="104" width="78" height="40" rx="8" fill="#26364f" />
      <path
        d="M232 142 L150 142 L124 150"
        stroke="#9aa9bf"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M180 112 C215 84 295 70 340 88 L358 104 L250 116 Z"
        fill="url(#bk)"
      />
      <path
        d="M130 108 C160 98 205 98 236 100 L230 114 L132 122Z"
        fill="#0f1a2e"
      />
      <path d="M346 62 L384 68 L402 100 L360 104 Z" fill="#4a9bff" />
      <path
        d="M346 62 L324 50"
        stroke="#1c2a44"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="394" cy="88" r="7" fill="#fff6c8" />
    </svg>
  );
}
