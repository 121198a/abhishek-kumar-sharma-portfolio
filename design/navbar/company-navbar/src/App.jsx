import React, { useState } from 'react';
import { UsnayaNavbar } from './components/UsnayaNavbar';

export default function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <div
      style={{
        minHeight: '200vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: theme === 'dark' ? '#030712' : '#f8fafc',
        color: theme === 'dark' ? '#f8fafc' : '#0f172a',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <UsnayaNavbar
        theme={theme}
        onThemeToggle={(newTheme) => setTheme(newTheme)}
      />

      <main style={{ paddingTop: '130px', paddingLeft: '1.5rem', paddingRight: '1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00f0ff', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            Next-Gen Web Architecture
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em', background: theme === 'dark' ? 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)' : 'linear-gradient(135deg, #0f172a 40%, #475569 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            USNAYA TECHWORKS SOLUTIONS
          </h1>
          <p style={{ fontSize: '1.0625rem', color: theme === 'dark' ? '#94a3b8' : '#475569', maxWidth: '560px', margin: 0, lineHeight: 1.6 }}>
            Futuristic dual-mode navigation system with real-time responsive states, perimeter lighting, and tactile interactions.
          </p>
        </div>
      </main>
    </div>
  );
}