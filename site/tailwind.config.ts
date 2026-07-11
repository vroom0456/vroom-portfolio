import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F5F0",
        surface: "#FFFFFF",
        surface2: "#EFEBE2",
        ink: "#16140F",
        muted: "#8A8270",
        gold: "#A8802E",
        rust: "#9C4A2C",
        line: "rgba(22,20,15,0.14)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
