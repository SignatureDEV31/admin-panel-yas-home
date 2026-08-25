import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building2,
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
          { labelKey: "roles", href: "/users/roles", disabled: true },
        ],
      },
    ],
  },
  {
    categoryKey: "propertyManagement",
    items: [
      {
        labelKey: "propertyMgmt",
        icon: Building2,
        children: [
          { labelKey: "properties", href: "/properties" },
          { labelKey: "projects", href: "/projects" },
          { labelKey: "amenities", href: "/amenities" },
        ],
      },
    ],
  },
];
