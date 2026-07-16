import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingBag,
  Settings as SettingsIcon,
} from "lucide-react";
import { SidebarCategory } from "./types";

export const menuGroups: SidebarCategory[] = [
  {
    categoryKey: "main",
    items: [
      {
        labelKey: "overview",
        icon: LayoutDashboard,
        href: "/overview",
      },
      {
        labelKey: "analytics",
        icon: BarChart3,
        href: "/analytics",
      },
    ],
  },
  {
    categoryKey: "management",
    items: [
      {
        labelKey: "users",
        icon: Users,
        children: [
          { labelKey: "allUsers", href: "/users" },
          { labelKey: "roles", href: "/users/roles" },
        ],
      },
      {
        labelKey: "products",
        icon: ShoppingBag,
        children: [
          { labelKey: "catalog", href: "/products/catalog" },
          { labelKey: "inventory", href: "/products/inventory" },
        ],
      },
    ],
  },
  {
    categoryKey: "settings",
    items: [
      {
        labelKey: "settings",
        icon: SettingsIcon,
        children: [
          { labelKey: "general", href: "/settings/general" },
          { labelKey: "security", href: "/settings/security" },
        ],
      },
    ],
  },
];
