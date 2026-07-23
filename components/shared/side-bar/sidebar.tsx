"use client";

import React from "react";
import { SidebarMobile } from "./content/sidebar-mobile";
import { SidebarDesktop } from "./content/sidebar-desktop";
import { useSidebar } from "../../../contexts/sidebar/sidebar-context";
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
