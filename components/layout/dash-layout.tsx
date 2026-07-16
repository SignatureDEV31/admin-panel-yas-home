"use client";

import { cn } from "@/lib/utils";
import { Header } from "../shared/header/header";
import { Sidebar } from "../shared/side-bar/sidebar";
import { SidebarProvider, useSidebar } from "../shared/side-bar/sidebar-context";

export const DashboardLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SidebarProvider>
  );
};

const DashboardLayoutInner: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen flex bg-background">

      {/* Sidebar (fixed width but participates logically in layout) */}
      <div className={cn(
        "hidden md:block transition-all duration-300",
        "shrink-0",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <Sidebar />
      </div>

      {/* Main content takes remaining space */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header />

        <div className="md:px-8 px-4 py-6 bg-muted/20 flex-1">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
};