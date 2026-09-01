/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mono: {
          950: "#050505",
          900: "#0A0A0A",
          850: "#121212",
          800: "#171717",
          750: "#1F1F1F",
          700: "#262626",
          600: "#404040",
          500: "#525252",
          400: "#737373",
          300: "#A3A3A3",
          200: "#E5E5E5",
          100: "#F5F5F5",
          50: "#FAFAFA",
          white: "#FFFFFF",
        },
        techlo: {
          dark: "#080808",
          surface: "#101010",
          card: "#141414",
          border: "#242424",
          borderHover: "#404040",
          cyan: "#FFFFFF",
          sky: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "mono-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.8)",
        "mono-glow": "0 0 25px -5px rgba(255, 255, 255, 0.12)",
        "mono-card": "0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 20px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};
