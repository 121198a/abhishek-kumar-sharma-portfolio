import { useCallback, useEffect, useState } from 'react';

const KEY = 'lv-theme';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    } catch (e) {
      /* storage can be unavailable (private mode) */
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((v) => !v), []);
  return { isDark, toggle };
}
