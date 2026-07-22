"use client";

import React from "react";
import { SidebarItem } from "./data/types";
import { SidebarNavItemCollapsed } from "./sidebar-nav-item-collapsed";
import { SidebarNavItemExpanded } from "./sidebar-nav-item-expanded";

interface SidebarNavItemProps {
  item: SidebarItem;
  isCollapsed: boolean;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarNavItem = ({
  item,
  isCollapsed,
  isActive,
  isOpen,
  onToggle,
}: SidebarNavItemProps) => {
  if (isCollapsed) {
    return <SidebarNavItemCollapsed item={item} isActive={isActive} />;
  }

  return (
    <SidebarNavItemExpanded
      item={item}
      isActive={isActive}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};
