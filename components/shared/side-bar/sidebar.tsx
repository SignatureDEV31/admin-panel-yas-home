"use client";

import React from "react";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarDesktop } from "./sidebar-desktop";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const { isCollapsed } = useSidebar();

  return (
    <>
      {/* Mobile Drawer (placed outside the hidden container so it functions on mobile) */}
      <SidebarMobile />

      {/* Desktop Sidebar (fixed width but participates logically in layout) */}
      <div
        className={cn(
          "hidden md:block transition-all duration-300",
          "shrink-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarDesktop />
      </div>
    </>
  );
};
