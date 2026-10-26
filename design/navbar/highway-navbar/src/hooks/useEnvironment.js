import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
// GSAP owns only: .vm-night, .vm-dayfx opacity (lighting). Framer owns the vehicle. No shared properties.
export function useEnvironment(rootRef, theme, mult) {
  const tl = useRef(null),
    first = useRef(true),
    m = useRef(mult);
  m.current = mult;
  useLayoutEffect(() => {
    const q = gsap.utils.selector(rootRef),
      night = theme === "dark";
    if (first.current) {
      first.current = false;
      gsap.set(q(".vm-night"), { opacity: night ? 1 : 0 });
      gsap.set(q(".vm-dayfx"), { opacity: night ? 0 : 1 });
      return;
    }
    tl.current?.kill();
    const d = m.current;
    tl.current = gsap
      .timeline({ defaults: { ease: "power2.inOut" } })
      .to(
        q(".vm-night"),
        { opacity: night ? 1 : 0, duration: 1.4 * d },
        night ? 0.2 * d : 0,
      )
      .to(
        q(".vm-dayfx"),
        { opacity: night ? 0 : 1, duration: 1.2 * d },
        night ? 0 : 0.2 * d,
      );
  }, [theme, rootRef]);
  useLayoutEffect(() => () => tl.current?.kill(), []);
}
