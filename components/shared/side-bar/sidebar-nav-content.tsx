"use client";

import React from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSidebarNavigation } from "./hooks/use-sidebar-navigation";
import { menuGroups } from "./data/data";
import { SidebarNavItem } from "./sidebar-nav-item";

interface SidebarNavContentProps {
  isCollapsed: boolean;
}

export const SidebarNavContent = ({ isCollapsed }: SidebarNavContentProps) => {
  const t = useTranslations();
  const pathname = usePathname();

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
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.labelKey}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isItemActive(item)}
                isOpen={isAccordionOpen(item)}
                onToggle={() => toggleAccordion(item)}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
