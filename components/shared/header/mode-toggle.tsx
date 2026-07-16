"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { useMounted } from "@/hooks/use-mounted";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const mounted = useMounted();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = mounted && theme === "dark";

  return (
    <Button
      className="cursor-pointer rounded-full"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? t("light") : t("dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">
        {isDark ? t("light") : t("dark")}
      </span>
    </Button>
  );
}
