const amber = (alpha) => `rgb(var(--amber) / ${alpha})`;

// Soft light cast by the chandelier plus the amber orb from the reference design.
export default function Atmosphere({ lampOn, brightness }) {
  const lumen = lampOn ? brightness / 100 : 0.02;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-[620px] overflow-hidden">
      <div
        className="absolute left-1/2 top-0 h-[600px] w-[150%] -translate-x-1/2 transition-all duration-500 md:w-[900px]"
        style={{
          background: `conic-gradient(from 180deg at 50% 0%, transparent 142deg, ${amber(0.28 * lumen)} 174deg, rgb(253 230 138 / ${0.4 * lumen}) 180deg, ${amber(0.28 * lumen)} 186deg, transparent 218deg)`,
          filter: 'blur(34px)',
          opacity: lampOn ? 1 : 0.05,
        }}
      />
      <div
        className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${amber(0.4 * lumen)}, transparent 70%)`, filter: 'blur(40px)' }}
      />
    </div>
  );
}
