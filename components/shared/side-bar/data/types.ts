import { type LucideIcon } from "lucide-react";

export interface SidebarSubItem {
  labelKey: string;
  href: string;
  disabled?: boolean;
}

export interface SidebarItem {
  labelKey: string;
  icon: LucideIcon;
  href?: string;
  disabled?: boolean;
  children?: SidebarSubItem[];
}

export interface SidebarCategory {
  categoryKey: string;
  items: SidebarItem[];
}
