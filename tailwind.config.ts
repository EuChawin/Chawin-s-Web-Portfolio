import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        "warm-white": "#FAFAF8",
        "warm-surface": "#F4F3F0",
        "warm-border": "#E8E6E1",
        "charcoal": "#1A1917",
        "charcoal-secondary": "#6B6863",
        "charcoal-tertiary": "#9E9B96",
        // Dark mode
        "dark-bg": "#111110",
        "dark-surface": "#1C1C1A",
        "dark-surface-2": "#252522",
        "dark-border": "#2E2E2B",
        "dark-text": "#F2F0EB",
        "dark-text-secondary": "#9A9793",
        "dark-text-tertiary": "#5C5A56",
        // Accent
        "accent": "#3B5BDB",
        "accent-dark": "#7B9EFF",
        "accent-muted": "#E8EDF8",
        "accent-muted-dark": "#1A2040",
        // Semantic
        "success": "#2D6A4F",
        "warning": "#B45309",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display": ["4.5rem", { lineHeight: "5rem", letterSpacing: "-0.03em" }],
        "h1": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.02em" }],
        "h2": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.015em" }],
        "h3": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "h4": ["1.125rem", { lineHeight: "1.75rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "body": ["1rem", { lineHeight: "1.625rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem" }],
        "caption": ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.05em" }],
        "label": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.1em" }],
      },
      spacing: {
        "xs": "0.25rem",
        "sm": "0.5rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "6rem",
        "5xl": "8rem",
        "6xl": "12rem",
      },
      borderRadius: {
        "sm": "6px",
        "md": "12px",
        "lg": "20px",
        "xl": "32px",
      },
      boxShadow: {
        "sm": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "md": "0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        "lg": "0 16px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        "apple": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "short": "200ms",
        "med": "400ms",
        "long": "700ms",
      },
      maxWidth: {
        "container": "1200px",
        "prose": "680px",
      },
    },
  },
  plugins: [],
};

export default config;
