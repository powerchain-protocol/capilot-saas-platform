"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { hydratePreferences, setThemePreference, useUiPreferences, type ThemePreference } from "@/store/preferences";

type Theme = ThemePreference;
type ResolvedTheme = Exclude<Theme, "system">;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preferences = useUiPreferences();
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const applyTheme = useCallback((nextTheme: Theme): void => {
    const nextResolved = resolveTheme(nextTheme);
    setResolvedTheme(nextResolved);
    document.documentElement.dataset.theme = nextResolved;
    document.documentElement.style.colorScheme = nextResolved;
  }, []);

  useEffect(() => {
    const hydrated = hydratePreferences();
    applyTheme(hydrated.theme);
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(preferences.theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = (): void => {
      if (preferences.theme === "system") applyTheme("system");
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [applyTheme, preferences.theme]);

  const setTheme = useCallback((nextTheme: Theme): void => {
    setThemePreference(nextTheme);
    applyTheme(nextTheme);
  }, [applyTheme]);

  const value = useMemo(() => ({ theme: preferences.theme, resolvedTheme, setTheme }), [preferences.theme, resolvedTheme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
