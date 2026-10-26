export default function Landscape() {
  const trees = [30, 270, 470, 640, 740, 880, 960, 1090];
  return (
    <svg
      className="tv-land"
      viewBox="0 0 1160 170"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9db8aa" stopOpacity=".55" />
          <stop offset="1" stopColor="#cfe0d6" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f9a85" />
          <stop offset="1" stopColor="#a9c8b8" />
        </linearGradient>
        <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8a6c" />
          <stop offset="1" stopColor="#8fb8a2" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#m1)"
        points="0,130 250,48 330,80 470,40 640,110 780,60 900,110 1000,70 1160,120 1160,170 0,170"
      />
      <polygon
        fill="url(#m2)"
        opacity=".75"
        points="60,150 330,70 520,125 700,50 860,120 1050,20 1160,95 1160,170 60,170"
      />
      <polygon
        fill="url(#m3)"
        opacity=".9"
        points="0,150 190,110 360,140 560,100 760,140 960,112 1160,140 1160,170 0,170"
      />
      <path
        d="M0 140c120-12 260 4 400 0s320-8 460 4 220-4 300-6V170H0z"
        fill="#fff"
        opacity=".35"
      />
      {trees.map((x) => (
        <polygon
          key={x}
          fill="#4f8a6c"
          opacity=".85"
          points={`${x},170 ${x + 9},128 ${x + 18},170`}
        />
      ))}
    </svg>
  );
}
