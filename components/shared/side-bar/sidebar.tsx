"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSidebar } from "./sidebar-context";
import { useSidebarNavigation } from "./hooks/use-sidebar-navigation";
import { ModeToggle } from "../header/mode-toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { menuGroups } from "./data/data";

import { useMounted } from "@/hooks/use-mounted";

export const Sidebar = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } =
    useSidebar();
  const mounted = useMounted();

  const { isItemActive, isAccordionOpen, toggleAccordion } =
    useSidebarNavigation(pathname);

  const isDark = mounted && theme === "dark";


  const renderNavContent = () => {
    return (
      <div className="flex-1 flex flex-col py-4 overflow-y-auto overflow-x-hidden select-none">
        {menuGroups.map((group) => (
          <div key={group.categoryKey} className="mb-6">
            {/* Category Title */}
            <div className="h-6 flex items-center px-4 mb-2">
              {!isCollapsed ? (
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase transition-all duration-200">
                  {t(`categories.${group.categoryKey}`)}
                </span>
              ) : (
                <div className="w-full border-b border-sidebar-border/60 mx-auto" />
              )}
            </div>

            {/* Category Items */}
            <ul className="space-y-1 px-3">
              {group.items.map((item) => {
                const hasChildren = !!item.children;
                const isActive = isItemActive(item);
                const isOpen = isAccordionOpen(item);

                if (isCollapsed) {
                  // Collapsed View (Icons + Hover Floating Panels)
                  return (
                    <li
                      key={item.labelKey}
                      className="relative group flex justify-center"
                    >
                      {item.href ? (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-white text-primary-foreground shadow-md shadow-primary/20"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </Link>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-lg cursor-pointer transition-all duration-200",
                            isActive
                              ? "bg-white text-primary"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                      )}

                      {/* Floating Panel on Hover */}
                      <div
                        className={cn(
                          "absolute hidden group-hover:flex flex-col bg-popover border border-border shadow-lg rounded-xl p-2 w-48 z-[100] transition-all",
                          "left-full top-0 ml-3",
                          "animate-in fade-in slide-in-from-left-2 duration-150",
                        )}
                      >
                        <div className="px-2.5 py-1.5 text-xs font-semibold text-foreground/80 border-b border-border/50 mb-1">
                          {t(`menu.${item.labelKey}`)}
                        </div>

                        {hasChildren ? (
                          <div className="space-y-0.5">
                            {item.children!.map((child) => {
                              const isChildActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "block px-2.5 py-1.5 text-xs rounded-md transition-colors",
                                    isChildActive
                                      ? "bg-accent text-accent-foreground font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                                  )}
                                >
                                  {t(`menu.${child.labelKey}`)}
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 text-xs text-muted-foreground">
                            {t("overview")}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                }

                // Expanded View (Accordion & Regular Links)
                return (
                  <li key={item.labelKey}>
                    {hasChildren ? (
                      <div>
                        {/* Parent Button */}
                        <button
                          onClick={() => toggleAccordion(item)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{t(`menu.${item.labelKey}`)}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-75" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-75" />
                          )}
                        </button>

                        {/* Child Links */}
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isOpen
                              ? "max-h-40 opacity-100 mt-1"
                              : "max-h-0 opacity-0",
                          )}
                        >
                          <ul className="pl-9 space-y-1 border-l border-border/50 ml-5">
                            {item.children!.map((child) => {
                              const isChildActive = pathname === child.href;
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                      "block py-1.5 px-3 text-xs rounded-md transition-colors",
                                      isChildActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                                    )}
                                  >
                                    {t(`menu.${child.labelKey}`)}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      /* Plain Link */
                      <Link
                        href={item.href!}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          isActive
                            ? cn(
                              "font-medium shadow-md shadow-primary/15",
                              isDark
                                ? "bg-white text-black"
                                : "bg-main text-primary-foreground",
                            )
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{t(`menu.${item.labelKey}`)}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* ==================== MOBILE PORTRAIT DRAWER ==================== */}
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

        {/* Content */}
        {renderNavContent()}

        <div
          className={cn(
            "border-t border-sidebar-border/80 p-3 mt-auto",
            isCollapsed ? "flex justify-center" : "flex justify-start",
          )}
        >
          <ModeToggle />
        </div>
      </aside>

      {/* ==================== DESKTOP PERSISTENT / COLLAPSED SIDEBAR ==================== */}
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
          {isCollapsed ?
            (
              <ChevronRight className="h-3.5 w-3.5" />
            )
            : (
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
        {renderNavContent()}
      </aside>
    </>
  );
};
