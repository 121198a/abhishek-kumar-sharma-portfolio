import { CloseIcon, MenuIcon } from '../../icons';
import styles from './MenuToggle.module.css';

/**
 * Hamburger button shown below the desktop breakpoint.
 * Theme colours arrive through the --toggle-fg / --toggle-bg / --focus
 * custom properties set by the parent nav.
 */
export function MenuToggle({ isOpen, onClick, controls, toggleRef }) {
  return (
    <button
      ref={toggleRef}
      type="button"
      className={styles.toggle}
      aria-expanded={isOpen}
      aria-controls={controls}
      aria-label="Menu"
      onClick={onClick}
    >
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </button>
  );
}
