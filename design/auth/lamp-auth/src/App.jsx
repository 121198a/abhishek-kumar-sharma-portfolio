import { useEffect, useMemo, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import HeroPanel from './components/HeroPanel';
import AuthCard from './components/AuthCard';
import { useAuthForm } from './hooks/useAuthForm';
import { useTheme } from './hooks/useTheme';
import { audio } from './lib/acoustics';
import { content } from './content';

// The chandelier brightness is fixed; an invalid email still dims it as a cue.
const BRIGHTNESS = 88;

export default function App() {
  const { isDark, toggle } = useTheme();
  const form = useAuthForm();

  const [lampOn, setLampOn] = useState(true);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    audio.muted = !sound;
  }, [sound]);

  // An invalid email dims the chandelier to 45% as a visual cue.
  const effective = useMemo(() => {
    if (!lampOn) return 5;
    return form.emailInvalid ? Math.max(18, Math.round(BRIGHTNESS * 0.45)) : BRIGHTNESS;
  }, [lampOn, form.emailInvalid]);

  // Play the dim sound once when the email becomes invalid, not on every keystroke.
  const wasInvalid = useRef(false);
  useEffect(() => {
    if (form.emailInvalid && !wasInvalid.current) audio.alertDim();
    wasInvalid.current = form.emailInvalid;
  }, [form.emailInvalid]);

  useEffect(() => {
    document.title = content.titles[form.mode];
  }, [form.mode]);

  return (
    <div className="relative flex h-screen h-dvh flex-col overflow-hidden bg-stone-100 text-stone-900 transition-colors duration-500 dark:bg-[#05060c] dark:text-stone-100">
      {/* Decorative stars: a single 1px element, so nothing image-like sits behind the text. */}
      <div aria-hidden="true" className="starfield pointer-events-none absolute left-0 top-0 h-px w-px" />

      <TopBar
        isDark={isDark}
        onToggleTheme={() => { audio.cordPull(); toggle(); }}
        sound={sound}
        onToggleSound={() => { const next = !sound; setSound(next); if (next) { audio.muted = false; audio.tick(880); } }}
      />

      {/* The header and footer stay put; only <main> scrolls, and only when the content is taller than the screen. */}
      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto grid min-h-full w-full max-w-6xl content-center items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-4">
          <HeroPanel lampOn={lampOn} brightness={effective} onToggleLamp={() => setLampOn((v) => !v)} dimmed={form.emailInvalid} />
          <AuthCard form={form} />
        </div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-black/10 py-2.5 text-center text-xs text-stone-600 dark:border-white/10 dark:text-stone-400">
        {content.footer}
      </footer>
    </div>
  );
}
