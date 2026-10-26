import styles from './ShowcaseSection.module.css';

/**
 * Label + icon on the left, the nav on a colourful "stage" on the right
 * (stacked on mobile). The stage gives the glass something to blur.
 * `theme` picks the stage backdrop: "dental" | "bike" | "hiking".
 */
export function ShowcaseSection({ id, title, icon: Icon, accent, theme, children }) {
  return (
    <section className={styles.section} aria-labelledby={id} style={{ '--accent': accent }}>
      <h2 id={id} className={styles.heading}>
        <span className={styles.badge}>
          <Icon />
        </span>
        {title}
      </h2>
      <div className={styles.stage} data-theme={theme}>
        {children}
      </div>
    </section>
  );
}
