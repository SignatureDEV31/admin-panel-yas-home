"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSidebar } from "../../../../contexts/sidebar/sidebar-context";
import { cn } from "@/lib/utils";
import { SidebarItem } from "../data/types";

interface SidebarNavItemCollapsedProps {
  item: SidebarItem;
  isActive: boolean;
}

export const SidebarNavItemCollapsed = ({
  item,
  isActive,
}: SidebarNavItemCollapsedProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();
  const hasChildren = !!item.children;

  return (
    <li className="relative group flex justify-center">
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
};
