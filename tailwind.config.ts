import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070b12",
        foreground: "#f1f5f9",
        medical: {
          dark: "#080d1a",
          darker: "#04070e",
          card: "rgba(11, 18, 32, 0.8)",
          cardHover: "rgba(15, 27, 48, 0.9)",
          border: "rgba(56, 189, 248, 0.2)",
          borderBright: "rgba(56, 189, 248, 0.6)",
          cyan: "#00f0ff",
          blue: "#38bdf8",
          sky: "#0ea5e9",
          neon: "#00ffcc",
          accent: "#22d3ee",
          muted: "#94a3b8",
        },
      },
      boxShadow: {
        "medical-glow": "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        "medical-panel": "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "cyan-sm": "0 0 10px rgba(0, 240, 255, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.98)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
