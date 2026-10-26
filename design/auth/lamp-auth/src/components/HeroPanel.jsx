import { Sparkles, Shield, Fingerprint, Zap } from 'lucide-react';
import Chandelier from './Chandelier';
import { content } from '../content';

const CHIP_ICONS = [Shield, Fingerprint, Zap];

export default function HeroPanel({ lampOn, brightness, onToggleLamp, dimmed }) {
  const { hero } = content;
  return (
    <section aria-labelledby="hero-title" className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
      <Chandelier lampOn={lampOn} brightness={brightness} onToggle={onToggleLamp} dimmed={dimmed} className="mb-4 self-center" />

      <p className="surface-chip mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-body">
        <Sparkles aria-hidden="true" className="h-4 w-4 text-accent" />
        {hero.badge}
      </p>

      <h1 id="hero-title" className="hero-title">{hero.title}</h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-body">{hero.body}</p>

      <ul className="mt-6 grid w-full max-w-md grid-cols-3 gap-3 short:hidden">
        {hero.chips.map((label, i) => {
          const Icon = CHIP_ICONS[i];
          return (
            <li key={label} className="surface-chip flex flex-col items-center gap-3 rounded-2xl px-2 py-4 text-xs font-semibold lg:items-start lg:px-3.5">
              <Icon aria-hidden="true" className="h-5 w-5 text-accent" />
              {label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
