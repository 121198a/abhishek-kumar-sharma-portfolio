import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05030b",
        panel: "#0d0919",
        panel2: "#120d24",
        ink: "#f7f4ff",
        muted: "#aaa2bd",
        purple: "#a855f7",
        violet: "#7c3aed",
        pink: "#ec4899",
        line: "rgba(255,255,255,.09)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 50px rgba(168,85,247,.2)",
      },
      maxWidth: {
        shell: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
