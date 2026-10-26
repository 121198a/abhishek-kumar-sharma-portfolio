import React from 'react';
import styles from './UsnayaNavbar.module.css';

export interface UsnayaLogoProps {
  className?: string;
}

export const UsnayaLogo: React.FC<UsnayaLogoProps> = ({ className = '' }) => {
  return (
    <a
      href="#home"
      className={`${styles.logoContainer} ${className}`}
      aria-label="USNAYA TECHWORKS SOLUTIONS Homepage"
    >
      <div className={styles.logoMarkWrapper}>
        <svg
          className={styles.logoSvg}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="usnayaCyanGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#2979ff" />
            </linearGradient>
            <linearGradient
              id="usnayaVioletGrad"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2979ff" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter
              id="usnayaGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Shield */}
          <polygon
            points="22,3 39,11 39,33 22,41 5,33 5,11"
            className={styles.shieldBorder}
            stroke="url(#usnayaCyanGrad)"
            strokeWidth="1.8"
            fill="none"
            filter="url(#usnayaGlow)"
          />

          {/* Telemetry Geometry */}
          <path
            d="M22 7 L35 13.5 V30.5 L22 37 L9 30.5 V13.5 Z"
            stroke="rgba(0, 240, 255, 0.25)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Stylized U Monogram */}
          <path
            d="M14 15 V25 C14 29.5 17.5 32 22 32 C26.5 32 30 29.5 30 25 V15"
            stroke="url(#usnayaVioletGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Central Beacon Node */}
          <circle
            cx="22"
            cy="22"
            r="2.5"
            fill="#00f0ff"
            className={styles.corePulse}
          />
          <line
            x1="22"
            y1="12"
            x2="22"
            y2="16"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className={styles.brandTypography}>
        <span className={styles.brandTitle}>USNAYA</span>{" "}
        <span className={styles.brandSubtitle}>Techworks Solutions</span>
      </div>
    </a>
  );
};