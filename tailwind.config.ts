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
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          dim: "rgb(var(--color-surface-dim) / <alpha-value>)",
          bright: "rgb(var(--color-surface-bright) / <alpha-value>)",
          "container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
          "container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
          container: "rgb(var(--color-surface-container) / <alpha-value>)",
          "container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
          "container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
          variant: "rgb(var(--color-surface-variant) / <alpha-value>)",
          tint: "rgb(var(--color-surface-tint) / <alpha-value>)",
        },
        "on-surface": {
          DEFAULT: "rgb(var(--color-on-surface) / <alpha-value>)",
          variant: "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        },
        "inverse-surface": "rgb(var(--color-inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--color-inverse-on-surface) / <alpha-value>)",
        outline: {
          DEFAULT: "rgb(var(--color-outline) / <alpha-value>)",
          variant: "rgb(var(--color-outline-variant) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          container: "rgb(var(--color-primary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-primary-fixed) / <alpha-value>)",
          "fixed-dim": "rgb(var(--color-primary-fixed-dim) / <alpha-value>)",
        },
        "on-primary": {
          DEFAULT: "rgb(var(--color-on-primary) / <alpha-value>)",
          container: "rgb(var(--color-on-primary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-on-primary-fixed) / <alpha-value>)",
          "fixed-variant": "rgb(var(--color-on-primary-fixed-variant) / <alpha-value>)",
        },
        "inverse-primary": "rgb(var(--color-inverse-primary) / <alpha-value>)",
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          container: "rgb(var(--color-secondary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-secondary-fixed) / <alpha-value>)",
          "fixed-dim": "rgb(var(--color-secondary-fixed-dim) / <alpha-value>)",
        },
        "on-secondary": {
          DEFAULT: "rgb(var(--color-on-secondary) / <alpha-value>)",
          container: "rgb(var(--color-on-secondary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-on-secondary-fixed) / <alpha-value>)",
          "fixed-variant": "rgb(var(--color-on-secondary-fixed-variant) / <alpha-value>)",
        },
        tertiary: {
          DEFAULT: "rgb(var(--color-tertiary) / <alpha-value>)",
          container: "rgb(var(--color-tertiary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-tertiary-fixed) / <alpha-value>)",
          "fixed-dim": "rgb(var(--color-tertiary-fixed-dim) / <alpha-value>)",
        },
        "on-tertiary": {
          DEFAULT: "rgb(var(--color-on-tertiary) / <alpha-value>)",
          container: "rgb(var(--color-on-tertiary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-on-tertiary-fixed) / <alpha-value>)",
          "fixed-variant": "rgb(var(--color-on-tertiary-fixed-variant) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          container: "rgb(var(--color-error-container) / <alpha-value>)",
        },
        "on-error": {
          DEFAULT: "rgb(var(--color-on-error) / <alpha-value>)",
          container: "rgb(var(--color-on-error-container) / <alpha-value>)",
        },
        background: "rgb(var(--color-background) / <alpha-value>)",
        "on-background": "rgb(var(--color-on-background) / <alpha-value>)",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-hero": [
          "56px",
          {
            lineHeight: "64px",
            letterSpacing: "-0.03em",
            fontWeight: "800",
          },
        ],
        "display-hero-mobile": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.02em",
            fontWeight: "800",
          },
        ],
        "headline-lg": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "headline-lg-mobile": [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "headline-md": [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "headline-sm": [
          "22px",
          {
            lineHeight: "30px",
            letterSpacing: "0",
            fontWeight: "600",
          },
        ],
        "title-md": [
          "18px",
          {
            lineHeight: "26px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-lg": [
          "16px",
          {
            lineHeight: "26px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        "body-md": [
          "14px",
          {
            lineHeight: "22px",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        "body-sm": [
          "12px",
          {
            lineHeight: "18px",
            letterSpacing: "0.01em",
            fontWeight: "400",
          },
        ],
        "label-tech": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.05em",
            fontWeight: "500",
          },
        ],
        "label-badge": [
          "11px",
          {
            lineHeight: "14px",
            letterSpacing: "0.06em",
            fontWeight: "700",
          },
        ],
        "telemetry-num": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.02em",
            fontWeight: "700",
          },
        ],
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-sm": "1rem",
        "gutter-lg": "2rem",
        margin: "1.5rem",
        "margin-md": "2.5rem",
        "margin-lg": "4rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "space-2xl": "4rem",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-glow": "var(--gradient-glow)",
      },
      boxShadow: {
        "cyan-glow": "var(--cyan-glow)",
        "cyan-glow-lg": "var(--cyan-glow-lg)",
        glass: "var(--glass-shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
