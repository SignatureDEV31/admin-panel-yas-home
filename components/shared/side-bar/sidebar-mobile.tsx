"use client";

import React from "react";
import { useSidebar } from "./sidebar-context";
import { ModeToggle } from "../header/mode-toggle";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SidebarNavContent } from "./sidebar-nav-content";

export const SidebarMobile = () => {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300",
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-50 w-64 bg-sidebar border-r border-sidebar-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out",
          "left-0",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/80">
          <div className="flex items-center gap-2"></div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - mobile navigation is never collapsed */}
        <SidebarNavContent isCollapsed={false} />

        <div
          className={cn(
            "border-t border-sidebar-border/80 p-3 mt-auto flex justify-start",
          )}
        >
          <ModeToggle />
        </div>
      </aside>
    </>
  );
};
