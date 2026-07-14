"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
  disableTransitionOnChange?: boolean;
};

function applyTheme(
  theme: Theme,
  options: { attribute: "class" | "data-theme"; enableSystem: boolean },
) {
  const root = document.documentElement;
  const resolvedTheme =
    theme === "system" && options.enableSystem
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  if (options.attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute("data-theme", resolvedTheme);
  }

  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = storedTheme ?? defaultTheme;

    applyTheme(initialTheme, { attribute, enableSystem });

    if (disableTransitionOnChange) {
      document.documentElement.classList.add("transition-none");
    }
  }, [
    attribute,
    defaultTheme,
    disableTransitionOnChange,
    enableSystem,
    storageKey,
  ]);

  return <>{children}</>;
}