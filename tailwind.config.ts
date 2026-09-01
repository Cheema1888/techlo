import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        techlo: {
          navy: "#0A1931",
          deep: "#060E1A",
          dark: "#081325",
          surface: "#0D2240",
          card: "#0F284B",
          border: "#1E3E6B",
          cyan: "#00A8FF",
          sky: "#00D2FF",
          glow: "#38BDF8",
          accent: "#2563EB",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 20px -3px rgba(0, 168, 255, 0.35)",
        "glow-cyan-lg": "0 0 35px -5px rgba(0, 168, 255, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
