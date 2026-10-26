import styles from './HikingNav.module.css';

/** Purely decorative carabiner + paracord wrap for the left end of the knife. */
export function CarabinerIcon() {
  return (
    <svg
      className={styles.carabiner}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="8" width="52" height="64" rx="26" stroke="#15171a" strokeWidth="8" />
      <rect x="44" y="30" width="30" height="40" rx="4" fill="#2a2d31" />
      <g stroke="#d1773a" strokeWidth="5" strokeLinecap="round">
        <path d="M46 34l26 6M46 44l26 6M46 54l26 6" />
      </g>
    </svg>
  );
}
