"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "aqua-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage or document class on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyTheme(stored);
      } else {
        const hasDark = document.documentElement.classList.contains("dark");
        const initial = hasDark ? "dark" : "light";
        setThemeState(initial);
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    setMounted(true);
  }, []);

  const applyTheme = (nextTheme: Theme) => {
    const root = document.documentElement;
    if (nextTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    }
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: mounted ? theme : "dark",
        toggleTheme,
        setTheme,
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

