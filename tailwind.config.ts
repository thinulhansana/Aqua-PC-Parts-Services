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
          DEFAULT: "#0b1229",
          dim: "#0b1229",
          bright: "#323851",
          "container-lowest": "#060d24",
          "container-low": "#141a32",
          container: "#181e36",
          "container-high": "#222941",
          "container-highest": "#2d344c",
          variant: "#2d344c",
          tint: "#4cd7f6",
        },
        "on-surface": {
          DEFAULT: "#dce1ff",
          variant: "#bcc9cd",
        },
        "inverse-surface": "#dce1ff",
        "inverse-on-surface": "#292f48",
        outline: {
          DEFAULT: "#869397",
          variant: "#3d494c",
        },
        primary: {
          DEFAULT: "#4cd7f6",
          container: "#06b6d4",
          fixed: "#acedff",
          "fixed-dim": "#4cd7f6",
        },
        "on-primary": {
          DEFAULT: "#003640",
          container: "#00424f",
          fixed: "#001f26",
          "fixed-variant": "#004e5c",
        },
        "inverse-primary": "#00687a",
        secondary: {
          DEFAULT: "#4fdbc8",
          container: "#04b4a2",
          fixed: "#71f8e4",
          "fixed-dim": "#4fdbc8",
        },
        "on-secondary": {
          DEFAULT: "#003731",
          container: "#003f38",
          fixed: "#00201c",
          "fixed-variant": "#005048",
        },
        tertiary: {
          DEFAULT: "#7bd0ff",
          container: "#23b2ec",
          fixed: "#c4e7ff",
          "fixed-dim": "#7bd0ff",
        },
        "on-tertiary": {
          DEFAULT: "#00354a",
          container: "#00415a",
          fixed: "#001e2c",
          "fixed-variant": "#004c69",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        "on-error": {
          DEFAULT: "#690005",
          container: "#ffdad6",
        },
        background: "#0b1229",
        "on-background": "#dce1ff",
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
        "gradient-primary":
          "linear-gradient(135deg, #06b6d4, #4cd7f6, #4fdbc8)",
        "gradient-glow":
          "radial-gradient(ellipse at center, rgba(76, 215, 246, 0.15), transparent 70%)",
      },
      boxShadow: {
        "cyan-glow": "0 0 20px rgba(76, 215, 246, 0.3), 0 0 60px rgba(76, 215, 246, 0.1)",
        "cyan-glow-lg": "0 0 30px rgba(76, 215, 246, 0.4), 0 0 80px rgba(76, 215, 246, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
