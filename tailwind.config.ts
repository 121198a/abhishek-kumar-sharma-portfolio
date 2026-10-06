import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        panel2: "var(--panel2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        purple: "var(--purple)",
        violet: "var(--violet)",
        pink: "var(--pink)",
        line: "var(--line)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(59, 130, 246, 0.12)",
        "glow-lg": "0 0 60px rgba(59, 130, 246, 0.20)",
        "glow-cyan": "0 0 50px rgba(56, 189, 248, 0.16)",
        "3d": "0 20px 40px -15px rgba(0,0,0,0.6)",
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
