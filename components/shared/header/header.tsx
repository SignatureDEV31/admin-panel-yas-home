"use client";

import React from "react";
import { Menu, Bell } from "lucide-react";
import { useSidebar } from "../side-bar/content/sidebar-context";
import { useAuth } from "@/contexts/auth-context";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  const { toggleMobileOpen } = useSidebar();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border/60 bg-background/90 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
      {/* Mobile Toggle & Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileOpen}
          aria-label="Toggle Menu"
          className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Dashboard
          </span>
        </div>
      </div>

      {/* Right Side / Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button
          className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </button>
        <ModeToggle />

        {/* User Name & Profile Avatar */}
        <div className="flex items-center gap-3 border-s ps-3 border-border/60">
          <div className="h-9 w-9 rounded-full  text-black border font-semibold flex items-center justify-center shadow-xs">
            {user?.fullName ? user.fullName[0].toUpperCase() : "A"}
          </div>
          <div className="hidden sm:flex flex-col text-end">
            <span className="text-sm font-semibold text-foreground leading-none">
              {user?.fullName || "Admin User"}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
              {user?.role || "Administrator"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
