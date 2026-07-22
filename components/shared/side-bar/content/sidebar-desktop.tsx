"use client";

import React from "react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { SidebarNavContent } from "./sidebar-nav-content";

export const SidebarDesktop = () => {
  const { theme } = useTheme();
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const mounted = useMounted();

  const isDark = mounted && theme === "dark";

  return (
    <aside
      className={cn(
        "relative h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Toggle Button in the vertical center of the sidebar border */}
      <button
        onClick={toggleCollapsed}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-50 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground transition-all duration-200 cursor-pointer",
          "right-0 translate-x-1/2",
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Desktop Header */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border/80">
        <div
          className={cn(
            "flex items-center gap-2 transition-all",
            isCollapsed && "mx-auto",
          )}
        >
          {!isCollapsed ? (
            <Image
              src={
                isDark
                  ? "/logo/white-yas-logo.svg"
                  : "/logo/dark-yas-logo.svg"
              }
              alt="Logo"
              width={125}
              height={125}
            />
          ) : (
            <Image
              src={
                isDark
                  ? "/logo/yas-home-logo-y-white.svg"
                  : "/logo/yas-home-logo-y.svg"
              }
              alt="Logo"
              width={40}
              height={40}
            />
          )}
        </div>
      </div>

      {/* Navigation list */}
      <SidebarNavContent isCollapsed={isCollapsed} />
    </aside>
  );
};
