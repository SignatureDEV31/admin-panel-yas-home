import { useState, useCallback } from "react";
import { SidebarItem } from "../data/types";

export const useSidebarNavigation = (pathname: string) => {
  // Track open accordion sections in expanded state
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const isItemActive = useCallback((item: SidebarItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    return !!item.children?.some((child) => pathname === child.href);
  }, [pathname]);

  const isAccordionOpen = useCallback((item: SidebarItem) => {
    if (!item.children) return false;
    const defaultOpen = item.children.some((child) => pathname === child.href);
    return expandedMenus[item.labelKey] !== undefined
      ? expandedMenus[item.labelKey]
      : defaultOpen;
  }, [expandedMenus, pathname]);

  const toggleAccordion = useCallback((item: SidebarItem) => {
    if (!item.children) return;
    const defaultOpen = item.children.some((child) => pathname === child.href);
    const key = item.labelKey;
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : !defaultOpen,
    }));
  }, [pathname]);

  return {
    isItemActive,
    isAccordionOpen,
    toggleAccordion,
  };
};
