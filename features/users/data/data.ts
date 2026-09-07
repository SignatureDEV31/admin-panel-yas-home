import { Users, UserCheck, BadgeCheck, LucideIcon } from "lucide-react";

export interface UserStatItem {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  descriptionClass: string;
}

export interface UserStatsInput {
  total: number;
  activeCount: number;
  certifiedCount?: number;
}

export function getUserStatItems(stats: UserStatsInput): UserStatItem[] {
  return [
    {
      title: "Total Users",
      value: stats.total,
      description: "Registered platform user accounts",
      icon: Users,
      iconBg: "bg-primary/10 text-primary",
      descriptionClass: "text-muted-foreground",
    },
    {
      title: "Active Users",
      value: stats.activeCount,
      description: "Enabled & active accounts",
      icon: UserCheck,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      descriptionClass: "text-emerald-600 dark:text-emerald-400 font-medium",
    },
    {
      title: "Certified Profiles",
      value: stats.certifiedCount || 0,
      description: "Verified promoters & agencies",
      icon: BadgeCheck,
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      descriptionClass: "text-violet-600 dark:text-violet-400 font-medium",
    },
  ];
}

export const userRoleOptions = [
  { value: "all", label: "All Roles" },
  { value: "regular", label: "Regular User" },
  { value: "agence", label: "Agency (Agence)" },
  { value: "promoter", label: "Promoter / Developer" },
  { value: "admin", label: "Administrator" },
];

export const userCertifyOptions = [
  { value: "all", label: "All Profiles" },
  { value: "certified", label: "Certified Only" },
  { value: "uncertified", label: "Uncertified Only" },
];

export const userVerifiedOptions = [
  { value: "all", label: "All Verification" },
  { value: "verified", label: "Verified Emails" },
  { value: "unverified", label: "Unverified Emails" },
];
