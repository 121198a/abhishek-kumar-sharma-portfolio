import { useEffect, useRef, useState } from "react";
import mascot from "../assets/mascot.svg";
import { MASCOT_ALT } from "./Hero.jsx";
import { prefersReducedMotion } from "../lib/motion.js";

/** Full-screen "door opens, creature walks out" scene shown after a successful submit. */
export default function DoorScene({ on, name, onClose }) {
  const [phase, setPhase] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!on) return undefined;
    const delay = (fn, ms) => setTimeout(fn, prefersReducedMotion() ? 0 : ms);
    const timers = [
      delay(() => setPhase("knock"), 1200),
      delay(() => setPhase("peek"), 2000),
      delay(() => setPhase("peek open"), 2800),
      delay(() => setPhase("peek open walk"), 4200),
      delay(() => setShowMessage(true), 7200),
    ];
    return () => {
      timers.forEach(clearTimeout);
      setPhase("");
      setShowMessage(false);
    };
  }, [on]);

  useEffect(() => {
    if (showMessage) closeRef.current?.focus();
  }, [showMessage]);

  return (
    <div id="scene" className={on ? "on" : undefined} aria-live="polite">
      <div className={`wall ${phase}`.trim()}>
        <div className="frame">
          <div className="light" />
          <div className="door" />
        </div>
        <div className="crt">
          <img src={mascot} alt={MASCOT_ALT} />
        </div>
      </div>
      <div id="msg" className={showMessage ? "on" : undefined}>
        <h2>{name ? `Welcome in, ${name}.` : "Welcome in."}</h2>
        <button type="button" id="re" className="cta" ref={closeRef} onClick={onClose}>
          Close the door
        </button>
      </div>
    </div>
  );
}
