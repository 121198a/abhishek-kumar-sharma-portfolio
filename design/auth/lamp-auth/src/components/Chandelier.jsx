import { useEffect, useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { audio } from '../lib/acoustics';

const amber = (alpha) => `rgb(var(--amber) / ${alpha})`;

export default function Chandelier({ lampOn, brightness, onToggle, dimmed, className = '' }) {
  const [pulling, setPulling] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const lumen = lampOn ? brightness / 100 : 0.05;

  const pull = () => {
    setPulling(true);
    audio.cordPull();
    onToggle();
    timer.current = setTimeout(() => setPulling(false), 380);
  };

  return (
    <div className={`relative flex select-none flex-col items-center ${className}`}>
      {/* Decorative fixture: hidden from assistive tech, the pull button below is the control. */}
      <div aria-hidden="true" className="flex flex-col items-center">
        <div className="h-3 w-16 rounded-t-sm border-b border-amber-900/60 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 shadow-md" />
        <div className="h-8 w-1.5 bg-[repeating-linear-gradient(to_bottom,#b45309_0px,#b45309_4px,#d97706_4px,#f59e0b_8px)] sm:h-10" />
        <div className="flex h-5 w-28 items-center justify-center rounded-t-full border border-amber-400/50 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-lg">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 w-1.5 rounded-full bg-amber-200/90 shadow-[0_0_4px_#fde68a]" />
            ))}
          </div>
        </div>
        <div
          className="relative h-24 w-36 overflow-hidden rounded-b-[42px] border-b-2 border-amber-300/60 backdrop-blur-md transition-all duration-500 sm:h-28 sm:w-44"
          style={{
            background: lampOn
              ? `radial-gradient(ellipse at 50% 20%, ${amber(0.95 * lumen)}, rgb(251 191 36 / ${0.45 * lumen}) 70%, rgb(180 83 9 / 0.45))`
              : 'rgb(120 113 108 / 0.35)',
            boxShadow: lampOn ? `0 14px 45px ${amber(0.55 * lumen)}, 0 70px 200px 50px ${amber(0.3 * lumen)}, inset 0 2px 14px rgb(254 243 199 / ${lumen})` : 'none',
          }}
        >
          <div
            className="absolute left-1/2 top-3 h-12 w-3 -translate-x-1/2 rounded-full transition-all duration-300"
            style={{
              background: lampOn ? `linear-gradient(to bottom, #fffbeb, ${amber(0.95)})` : '#78716c',
              boxShadow: lampOn ? `0 0 24px rgb(254 240 138 / ${lumen})` : 'none',
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex justify-around opacity-30">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-full w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
            ))}
          </div>
        </div>
        <div className="h-2 w-10 rounded-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 shadow" />
        <div
          className="w-0.5 origin-top bg-gradient-to-b from-amber-500 to-amber-700 transition-all duration-150"
          style={{ height: pulling ? 58 : 40 }}
        />
      </div>

      <button
        type="button"
        onClick={pull}
        aria-pressed={lampOn}
        aria-label="Chandelier light"
        title="Pull the cord to toggle the light"
        className="btn-ghost -mt-1"
        style={{
          transform: pulling ? 'translateY(14px)' : 'translateY(0)',
          transition: pulling ? 'transform 0.08s ease-in' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <span className="flex h-6 w-4 items-center justify-center rounded-b-full border border-amber-200/50 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-100/80" />
        </span>
      </button>

      <div role="status">
        {dimmed && (
          <p className="alert-error mt-1 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold">
            <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5" />
            Light dimmed: check the email format
          </p>
        )}
      </div>
    </div>
  );
}
