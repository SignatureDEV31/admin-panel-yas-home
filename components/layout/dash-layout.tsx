"use client";

import { cn } from "@/lib/utils";
import { Header } from "../shared/header/header";
import { Sidebar } from "../shared/side-bar/sidebar";
import { SidebarProvider } from "../../contexts/sidebar/sidebar-context";

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

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      {/* Main content takes remaining space */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header />

        <div className="md:px-8 px-4 py-6 bg-background flex-1">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
};