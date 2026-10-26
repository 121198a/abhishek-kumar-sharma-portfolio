import { Diamond, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { content } from '../content';

export default function TopBar({ isDark, onToggleTheme, sound, onToggleSound }) {
  return (
    <header className="relative z-20 shrink-0 border-b border-black/10 bg-stone-100/80 backdrop-blur-md dark:border-white/10 dark:bg-[#05060c]/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <p className="flex items-center gap-2.5 text-base font-extrabold tracking-[0.14em] sm:text-lg">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200">
            <Diamond className="h-5 w-5 text-stone-950" />
          </span>
          <span className="text-accent">
            {content.brand.name}
            <span className="text-stone-900 dark:text-white">{content.brand.suffix}</span>
          </span>
        </p>

        <div role="group" aria-label="Display controls" className="flex items-center gap-2">
          {/* The label itself changes with state, so no aria-pressed on these two. */}
          <button type="button" onClick={onToggleSound} aria-label={sound ? 'Mute sounds' : 'Turn sounds on'} className="ctrl w-11 px-0">
            {sound ? <Volume2 aria-hidden="true" className="h-4 w-4 text-accent" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
          </button>
          <button
            type="button" onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="ctrl w-11 px-0 sm:w-auto sm:px-3"
          >
            {isDark ? <Sun aria-hidden="true" className="h-4 w-4 text-amber-400" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
            <span aria-hidden="true" className="hidden sm:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
