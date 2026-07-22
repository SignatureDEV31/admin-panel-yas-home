"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarItem } from "../data/types";

interface SidebarNavItemExpandedProps {
  item: SidebarItem;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarNavItemExpanded = ({
  item,
  isActive,
  isOpen,
  onToggle,
}: SidebarNavItemExpandedProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();
  const hasChildren = !!item.children;

  return (
    <li>
      {hasChildren ? (
        <div>
          {/* Parent Button */}
          <button
            onClick={onToggle}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden pr-1">
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate whitespace-nowrap">
                {t(`menu.${item.labelKey}`)}
              </span>
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
              isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0",
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
          <span className="truncate whitespace-nowrap">
            {t(`menu.${item.labelKey}`)}
          </span>
        </Link>
      )}
    </li>
  );
};
