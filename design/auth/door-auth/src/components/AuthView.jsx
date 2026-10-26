import { useEffect, useRef } from "react";

/** One screen of the panel (log in / sign up / reset). Focuses its heading when shown. */
export default function AuthView({ id, title, subtitle, active, children }) {
  const headingRef = useRef(null);
  const wasActive = useRef(active);

  useEffect(() => {
    if (active && !wasActive.current) {
      window.scrollTo({ top: 0 });
      headingRef.current?.focus({ preventScroll: true });
    }
    wasActive.current = active;
  }, [active]);

  // One h1 per page: only the visible view is an h1; hidden views use h2.
  const Heading = active ? "h1" : "h2";

  return (
    <section
      className={`view${active ? " active" : ""}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <Heading id={`${id}-title`} ref={headingRef} tabIndex={-1}>
        {title}
      </Heading>
      <p className="sub">{subtitle}</p>
      {children}
    </section>
  );
}
