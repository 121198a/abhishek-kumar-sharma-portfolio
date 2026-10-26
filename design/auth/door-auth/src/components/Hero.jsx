import { useEffect, useRef } from "react";
import logo from "../assets/logo.svg";
import mascot from "../assets/mascot.svg";

export const LOGO_ALT = "Emberdoor logo, a pink arched door with a glowing knob";
export const MASCOT_ALT =
  "A smiling purple creature with two large glowing orange eyes";

const HERO = {
  login: {
    badge: "New to the house?",
    title: "Open the door to what's next.",
    text: "Something warm is waiting behind it. Log in, and the door opens a little wider each time.",
    cta: "Let's get started",
    target: "signup",
  },
  signup: {
    badge: "Already a resident?",
    title: "Every house starts with a first key.",
    text: "Create your account and step through. The creature has been expecting you.",
    cta: "Back to log in",
    target: "login",
  },
  forgot: {
    badge: "Locked out?",
    title: "Happens to the best of us.",
    text: "Enter your email and we will point you back to the door.",
    cta: "Back to log in",
    target: "login",
  },
};

/** Left-hand brand panel. The little door opens once the active form is valid. */
export default function Hero({ view, ready, onNavigate }) {
  const doorRef = useRef(null);
  const copy = HERO[view];

  useEffect(() => {
    const onPointer = (e) => {
      const el = doorRef.current;
      if (!el) return;
      el.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(2));
      el.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(2));
    };
    window.addEventListener("pointermove", onPointer);
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  return (
    <aside className="hero" aria-label="About Emberdoor">
      <header className="brand">
        <img src={logo} alt={LOGO_ALT} width="22" height="28" />
        EMBERDOOR
      </header>
      <div className="hero-body">
        <span className="badge">{copy.badge}</span>
        <p className="hero-title">{copy.title}</p>
        <p className="hero-text">{copy.text}</p>
        <button type="button" className="cta" onClick={() => onNavigate(copy.target)}>
          {copy.cta}
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className={`hd${ready ? " ready" : ""}`} ref={doorRef} aria-hidden="true">
        <div className="hd-frame">
          <div className="hd-light" />
          <div className="hd-door" />
        </div>
        <div className="hd-crt">
          <img src={mascot} alt={MASCOT_ALT} />
        </div>
      </div>
    </aside>
  );
}
