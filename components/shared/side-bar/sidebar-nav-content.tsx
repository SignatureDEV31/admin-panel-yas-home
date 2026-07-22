"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSidebar } from "./sidebar-context";
import { useSidebarNavigation } from "./hooks/use-sidebar-navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { menuGroups } from "./data/data";

interface SidebarNavContentProps {
  isCollapsed: boolean;
}

export const SidebarNavContent = ({ isCollapsed }: SidebarNavContentProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  const { isItemActive, isAccordionOpen, toggleAccordion } =
    useSidebarNavigation(pathname);

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto overflow-x-hidden select-none">
      {menuGroups.map((group) => (
        <div key={group.categoryKey} className="mb-6">
          {/* Category Title */}
          <div className="h-6 flex items-center px-4 mb-2">
            {!isCollapsed ? (
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 transition-all duration-200">
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
                            ? "bg-primary/10 text-primary"
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
                            ? "bg-primary/10 text-primary"
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
                      <div className="px-2.5 py-1.5 text-sm font-semibold text-foreground/80 border-b border-border/50 mb-1">
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
                                  "block px-2.5 py-1.5 text-sm rounded-md transition-colors",
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
                        <div className="px-2.5 py-1 text-sm text-muted-foreground">
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
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden pr-1">
                          <item.icon className="h-4.5 w-4.5 shrink-0" />
                          <span className="truncate whitespace-nowrap">{t(`menu.${item.labelKey}`)}</span>
                        </div>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 shrink-0 opacity-75 ml-1" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 opacity-75 ml-1" />
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
                                    "block py-1.5 px-3 text-sm font-medium rounded-md transition-colors truncate whitespace-nowrap",
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
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate whitespace-nowrap">{t(`menu.${item.labelKey}`)}</span>
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
