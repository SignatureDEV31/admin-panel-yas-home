"use client";

import React, { createContext, useState, useEffect } from "react";

type SidebarContextType = {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  toggleMobileOpen: () => void;
};

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile drawer when resizing back to desktop sizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const toggleMobileOpen = () => setMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setCollapsed,
        isMobileOpen,
        setMobileOpen,
        toggleCollapsed,
        toggleMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { useSidebar } from "../hooks/use-sidebar";

