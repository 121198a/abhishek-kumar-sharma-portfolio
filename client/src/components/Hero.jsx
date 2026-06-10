import { useScrollY } from "../hooks/useAnimation";
import "./Hero.css";

export default function Hero() {
  const scrollY = useScrollY();

  return (
    <section className="hero" id="hero">
      {/* Oversized background name — the signature element */}
      <div
        className="hero__bg-name"
        style={{ transform: `translateY(${scrollY * 0.35}px)`, opacity: 1 - scrollY / 500 }}
        aria-hidden="true"
      >
        ABHI
      </div>

      <div className="container hero__content">
        <div className="hero__label">
          <span className="hero__status-dot" />
          Available for work · Passout Batch - 2025
        </div>

        <h1 className="hero__headline">
          Building digital
          <br />
          products that
          <br />
          <em>actually work.</em>
        </h1>

        <div className="hero__sub-row">
          <p className="hero__description">
            Frontend & Full-Stack Developer & Creative Technologist.
            <br />
            I craft fast, thoughtful, end-to-end experiences.
          </p>

          <div className="hero__actions">
            <a href="#work" className="hero__btn hero__btn--primary">
              My Project Work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className="hero__btn hero__btn--secondary">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">12+</span>
            <span className="hero__stat-label">Certifications</span>
          </div>
          <div className="hero__divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">6+</span>
            <span className="hero__stat-label">Projects Developed</span>
          </div>
          <div className="hero__divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">Fresher </span>
            <span className="hero__stat-label">Looking For an Opportunities</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
