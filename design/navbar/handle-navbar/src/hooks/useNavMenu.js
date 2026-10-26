import { useCallback, useEffect, useId, useRef, useState } from 'react';

/** Must match the `min-width: 56.25em` media queries in the nav stylesheets. */
const DESKTOP_QUERY = '(min-width: 56.25em)';

/**
 * Disclosure behaviour for the mobile menu:
 * - Escape closes it and returns focus to the toggle button
 * - clicking/tapping outside closes it
 * - growing to the desktop layout resets it
 */
export function useNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => {
      if (event.matches) setIsOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return { isOpen, toggle, close, menuId, rootRef, toggleRef };
}
