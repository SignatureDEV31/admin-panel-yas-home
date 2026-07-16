import { type LucideIcon } from "lucide-react";

export interface SidebarSubItem {
  labelKey: string;
  href: string;
}

export interface SidebarItem {
  labelKey: string;
  icon: LucideIcon;
  href?: string;
  children?: SidebarSubItem[];
}

export interface SidebarCategory {
  categoryKey: string;
  items: SidebarItem[];
}
