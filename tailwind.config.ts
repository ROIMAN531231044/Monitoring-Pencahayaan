import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        iot: {
          bg: "#070b12",
          card: "#0c1322",
          cardBorder: "#1e293b",
          neonCyan: "#06b6d4",
          neonAmber: "#f59e0b",
          glowYellow: "#fbbf24",
          danger: "#f43f5e",
          surface: "#0f131c",
          surfaceLow: "#181c24",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
        "glow-cyan": "0 0 20px -5px rgba(6, 182, 212, 0.25)",
        "glow-emerald": "0 0 20px -5px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

