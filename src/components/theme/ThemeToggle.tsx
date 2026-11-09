"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={[
        "relative flex items-center justify-center gap-2 rounded-xl transition-all duration-300",
        "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-primary",
        showLabel ? "px-3 py-2 text-body-md w-full justify-between" : "p-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        <span
          className={[
            "material-symbols-outlined text-[20px] transition-all duration-300",
            isDark
              ? "opacity-100 rotate-0 text-amber-300"
              : "opacity-0 -rotate-90 pointer-events-none absolute text-primary",
          ].join(" ")}
        >
          light_mode
        </span>
        <span
          className={[
            "material-symbols-outlined text-[20px] transition-all duration-300",
            !isDark
              ? "opacity-100 rotate-0 text-cyan-700"
              : "opacity-0 rotate-90 pointer-events-none absolute text-on-surface-variant",
          ].join(" ")}
        >
          dark_mode
        </span>
      </div>

      {showLabel && (
        <span className="font-medium text-body-md">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}

