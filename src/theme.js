// src/theme.js
// Light/dark theme: remembers the choice, applies it to <html data-theme="...">.

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";
export const DEFAULT_THEME = "dark"; // the blog ships dark by default

// Reads the saved theme, falling back to the default.
export function readTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage blocked (private mode) */
  }
  return DEFAULT_THEME;
}

// Writes the theme onto the document. The CSS reacts to [data-theme].
export function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#080a12" : "#f6f7fb");

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage blocked (private mode) */
  }
}

// Small hook used by the navbar toggle.
export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    []
  );

  return { theme, toggleTheme };
}
