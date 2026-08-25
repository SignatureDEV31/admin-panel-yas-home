"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  getDashboardStats,
  getGrowthTrends,
  getBreakdowns,
  getRecentActivity,
} from "@/services/admin/admin.service";
import {
  AdminDashboardStats,
  BreakdownsResponse,
  GrowthTrendsResponse,
  RecentActivityResponse,
  StatsPeriod,
} from "@/services/types/admin.types";
import {
  CHART_COLORS,
  normalizeCityName,
} from "@/features/overview/utils/overview-utils";

export function useOverview() {
  const t = useTranslations();
  const pageTitle = t ? t("overview") : "Overview";

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [growthTrends, setGrowthTrends] = useState<GrowthTrendsResponse | null>(null);
  const [breakdowns, setBreakdowns] = useState<BreakdownsResponse | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivityResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitsTimeframe, setVisitsTimeframe] = useState<"today" | "week" | "month">("month");
  const [growthPeriod, setGrowthPeriod] = useState<StatsPeriod>(StatsPeriod.LAST_30_DAYS);

  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, trendsData, breakdownsData, activityData] = await Promise.all([
        getDashboardStats().catch((e) => {
          console.warn("Error loading dashboard stats:", e);
          return null;
        }),
        getGrowthTrends({ period: growthPeriod }).catch((e) => {
          console.warn("Error loading growth trends:", e);
          return null;
        }),
        getBreakdowns().catch((e) => {
          console.warn("Error loading breakdowns:", e);
          return null;
        }),
        getRecentActivity().catch((e) => {
          console.warn("Error loading recent activity:", e);
          return null;
        }),
      ]);

      if (statsData) setStats(statsData);
      if (trendsData) setGrowthTrends(trendsData);
      if (breakdownsData) setBreakdowns(breakdownsData);
      if (activityData) setRecentActivity(activityData);

      if (!statsData && !trendsData && !breakdownsData && !activityData) {
        throw new Error("Unable to connect to backend admin services.");
      }
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      const errorDetail = err.message || "Network error";
      setError(`Failed to fetch admin dashboard data. Details: ${errorDetail}`);
    } finally {
      setLoading(false);
    }
  }, [growthPeriod]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  // 1. Total sum of users
  const sumTotalUsers = useMemo(() => {
    if (stats?.users?.total !== undefined) return stats.users.total;
    if (breakdowns?.usersByRole) {
      return breakdowns.usersByRole.reduce((sum, item) => sum + Number(item.count || 0), 0);
    }
    return 0;
  }, [stats, breakdowns]);

  // 2. Monthly / Daily User Growth from GrowthTrends
  const monthlyUsersData = useMemo(() => {
    if (!growthTrends?.userRegistrations) return [];
    return growthTrends.userRegistrations.map((item) => {
      let formattedDate = item.date;
      try {
        const dateObj = new Date(item.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(dateObj);
        }
      } catch {}
      return {
        Month: formattedDate,
        "Number of users": Number(item.count || 0),
      };
    });
  }, [growthTrends]);

  // 3. Property Distribution (Sale vs Rent)
  const propertyDistribution = useMemo(() => {
    if (!breakdowns?.propertiesByType) return [];

    return breakdowns.propertiesByType
      .map((item) => {
        const typeLabel =
          item.propertyType === "VENTE"
            ? "Sale"
            : item.propertyType === "LOCATION"
            ? "Rent"
            : item.propertyType || "Other";
        return {
          name: typeLabel,
          value: Number(item.count || 0),
          fill:
            item.propertyType === "VENTE"
              ? CHART_COLORS.yashomePink
              : item.propertyType === "LOCATION"
              ? CHART_COLORS.main
              : CHART_COLORS.indigo,
        };
      })
      .filter((item) => item.value > 0);
  }, [breakdowns]);

  // 4. User Roles Distribution
  const userRolesData = useMemo(() => {
    if (!breakdowns?.usersByRole) return [];

    const roleMapping: Record<string, { label: string; fill: string }> = {
      regular: { label: "Regular", fill: CHART_COLORS.indigo },
      agence: { label: "Agency", fill: CHART_COLORS.blue },
      promoter: { label: "Promoter", fill: CHART_COLORS.violet },
      admin: { label: "Admin", fill: CHART_COLORS.emerald },
      unknown: { label: "Unknown", fill: CHART_COLORS.slate },
    };

    return breakdowns.usersByRole
      .map((item) => {
        const roleKey = (item.role || "").toLowerCase().trim();
        const config = roleMapping[roleKey] || {
          label: item.role || "User",
          fill: CHART_COLORS.slate,
        };
        return {
          name: config.label,
          value: Number(item.count || 0),
          fill: config.fill,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [breakdowns]);

  // 5. Top Wilayas / Cities
  const topWilayas = useMemo(() => {
    if (!breakdowns?.topWilayas?.properties) return [];

    const cityCounts: Record<string, number> = {};
    breakdowns.topWilayas.properties.forEach((item) => {
      if (!item || !item.state || item.state.trim() === "") return;
      const normalized = normalizeCityName(item.state);
      cityCounts[normalized] =
        (cityCounts[normalized] || 0) + Number(item.count || 0);
    });

    return Object.entries(cityCounts)
      .map(([cityName, count]) => ({ name: cityName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [breakdowns]);

  // 6. Traffic / Page Visits Trends
  const visitsThisMonthData = useMemo(() => {
    if (!growthTrends?.pageVisits) return [];
    return growthTrends.pageVisits.map((item) => ({
      Day: item.date,
      Visits: Number(item.count || 0),
    }));
  }, [growthTrends]);

  const todayVisitsData = useMemo(() => {
    if (!growthTrends?.pageVisits) return [];
    return growthTrends.pageVisits.slice(-24).map((item) => ({
      Hour: item.date,
      Visits: Number(item.count || 0),
    }));
  }, [growthTrends]);

  return {
    pageTitle,
    data: stats,
    stats,
    growthTrends,
    breakdowns,
    recentActivity,
    loading,
    error,
    visitsTimeframe,
    setVisitsTimeframe,
    growthPeriod,
    setGrowthPeriod,
    fetchStats: fetchAllDashboardData,
    sumTotalUsers,
    monthlyUsersData,
    propertyDistribution,
    userRolesData,
    topWilayas,
    visitsThisMonthData,
    todayVisitsData,
  };
}
