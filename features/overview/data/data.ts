import {
  Users,
  TrendingUp,
  Building2,
  Briefcase,
  Globe,
  Smartphone,
  Contact,
  HardHat,
  Target,
  CheckCircle2,
  Clock,
  Coins,
  LucideIcon,
} from "lucide-react";
import { AdminDashboardStats } from "@/services/types/admin.types";

export const CHART_COLORS = {
  yashomePink: "#FF014F",
  main: "#151533",
  indigo: "#6366f1",
  emerald: "#10b981",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#64748b",
};

export const visitsTimeframeOptions = [
  { label: "Today", value: "today" as const },
  { label: "Week", value: "week" as const },
  { label: "Month", value: "month" as const },
];

export interface OverviewCoreCardItem {
  id: string;
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export function getOverviewCoreCards(
  stats: AdminDashboardStats,
  sumTotalUsers: number
): OverviewCoreCardItem[] {
  const currentVisits = stats.analytics?.totalVisits || 0;
  const totalProperties = stats.properties?.total ?? stats.properties?.active ?? 0;
  const totalProjects = stats.projects?.total ?? 0;
  const totalUsers = stats.users?.total ?? sumTotalUsers ?? 0;

  return [
    {
      id: "users",
      title: "Total Users",
      value: totalUsers,
      description: stats.users?.verified
        ? `${stats.users.verified} verified`
        : "Registered platform accounts",
      icon: Users,
    },
    {
      id: "visits",
      title: "Total Visits",
      value: currentVisits,
      description: stats.analytics?.uniqueVisitors
        ? `${stats.analytics.uniqueVisitors} unique visitors`
        : "Aggregated page visits",
      icon: TrendingUp,
    },
    {
      id: "properties",
      title: "Properties",
      value: totalProperties,
      description: stats.properties?.available
        ? `${stats.properties.available} available listings`
        : "Active listings on portal",
      icon: Building2,
    },
    {
      id: "projects",
      title: "Real Estate Projects",
      value: totalProjects,
      description: stats.projects?.published
        ? `${stats.projects.published} published developments`
        : "Promoter development complexes",
      icon: Briefcase,
    },
  ];
}

export interface PlatformStatusItem {
  title: string;
  subtitle: string;
  value: number;
  icon: LucideIcon;
}

export function getPlatformStakeholderItems(
  stats?: AdminDashboardStats | null
): PlatformStatusItem[] {
  const totalAgents = stats?.users?.agency ?? 0;
  const totalDevelopers = stats?.users?.promoter ?? 0;
  const totalVisits = stats?.analytics?.totalVisits ?? 0;
  const uniqueVisitors = stats?.analytics?.uniqueVisitors ?? 0;
  const certifiedPromoters = stats?.users?.certified ?? 0;

  return [
    {
      title: "Total Platform Visits",
      subtitle: "Aggregated page views across web & mobile",
      value: totalVisits,
      icon: Globe,
    },
    {
      title: "Unique Visitors",
      subtitle: "Distinct IP audience reached",
      value: uniqueVisitors,
      icon: Smartphone,
    },
    {
      title: "Real Estate Agencies",
      subtitle: "Registered broker partners",
      value: totalAgents,
      icon: Contact,
    },
    {
      title: "Promoters & Developers",
      subtitle:
        certifiedPromoters > 0
          ? `${certifiedPromoters} verified certified profiles`
          : "Development companies",
      value: totalDevelopers,
      icon: HardHat,
    },
  ];
}

export function getPlatformPipelineItems(
  stats?: AdminDashboardStats | null
): PlatformStatusItem[] {
  const publishedListings = stats?.properties?.active ?? 0;
  const pendingPublications = stats?.projects?.unpublished ?? 0;
  const generatedLeads = stats?.requests?.total ?? 0;
  const featuredTotal =
    (stats?.marketing?.featuredProperties || 0) +
    (stats?.marketing?.featuredPromoters || 0);

  return [
    {
      title: "Buyer Inquiries & Needs",
      subtitle: "Customer demand and lead requests",
      value: generatedLeads,
      icon: Target,
    },
    {
      title: "Active Property Listings",
      subtitle: "Published real estate catalog",
      value: publishedListings,
      icon: CheckCircle2,
    },
    {
      title: "Unpublished Projects",
      subtitle: "Projects awaiting review or draft",
      value: pendingPublications,
      icon: Clock,
    },
    {
      title: "Featured Showcase",
      subtitle: `${stats?.marketing?.featuredProperties || 0} properties, ${stats?.marketing?.featuredPromoters || 0} promoters`,
      value: featuredTotal,
      icon: Coins,
    },
  ];
}
