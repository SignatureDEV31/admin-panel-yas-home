"use client";


import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Header } from "../shared/header/header";
import { Sidebar } from "../shared/side-bar/sidebar";

export const DashboardLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { locale } = useParams();
  const isRTL = locale === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen flex">

      {/* Sidebar (fixed width but participates logically in layout) */}
      <div className={cn(
        "hidden md:block transition-all duration-500",
        "shrink-0"
      )}>
        <Sidebar />
      </div>

      {/* Main content takes remaining space */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <div className="md:px-8 px-4 py-6 bg-muted/40 flex-1">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
};