import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0b",
        panel: "#111113",
        panel2: "#17171a",
        ink: "#f5f5f2",
        muted: "#a1a1a6",
        purple: "#6f93ff",
        violet: "#3f66f5",
        pink: "#a9bfff",
        line: "rgba(255,255,255,.09)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 50px rgba(111,147,255,.18)",
        "glow-lg": "0 0 80px rgba(111,147,255,.28)",
        "glow-cyan": "0 0 60px rgba(56,189,248,.22)",
        "3d": "0 25px 50px -12px rgba(0,0,0,.7), 0 0 30px rgba(111,147,255,.15)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      maxWidth: {
        shell: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
