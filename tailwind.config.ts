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
      },
      maxWidth: {
        shell: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
