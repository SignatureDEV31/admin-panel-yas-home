"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { getAdminStats } from "@/services/admin/admin.service";
import { AdminStats } from "@/services/types/admin.types";
import {
  CHART_COLORS,
  normalizeCityName,
} from "@/features/overview/utils/overview-utils";

export function useOverview() {
  const t = useTranslations();
  const pageTitle = t ? t("overview") : "Overview";

  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitsTimeframe, setVisitsTimeframe] = useState<'today' | 'week' | 'month'>('month');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getAdminStats();
      setData(stats);
    } catch (err: any) {
      console.error("Failed to load admin stats:", err);
      const errorDetail = err.message || "Unknown error";
      setError(`Failed to fetch admin dashboard stats from server. Details: ${errorDetail}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const sumTotalUsers = useMemo(() => {
    if (!data?.userStats?.byRole) return 0;
    return data.userStats.byRole.reduce((sum, item) => sum + Number(item.count || 0), 0);
  }, [data]);

  const monthlyUsersData = useMemo(() => {
    if (!data?.monthlyUsers) return [];
    return data.monthlyUsers.map((item) => {
      let monthName = "Unknown";
      try {
        const date = new Date(item.month);
        monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
      } catch {}
      return {
        Month: monthName,
        "Number of users": Number(item.count || 0),
      };
    });
  }, [data]);

  const propertyDistribution = useMemo(() => {
    if (!data?.propertiesByType) return [];

    return data.propertiesByType
      .map((item) => {
        const typeLabel =
          item.type === "VENTE" ? "Sale" : item.type === "LOCATION" ? "Rent" : item.type;
        return {
          name: typeLabel,
          value: Number(item.count || 0),
          fill: item.type === "VENTE" ? CHART_COLORS.yashomePink : CHART_COLORS.main,
        };
      })
      .filter((item) => ["sale", "rent"].includes(item.name.toLowerCase()));
  }, [data]);

  const userRolesData = useMemo(() => {
    if (!data?.userStats?.byRole) return [];

    const roleMapping: Record<string, { label: string; fill: string }> = {
      regular: { label: "Regular", fill: CHART_COLORS.indigo },
      agence: { label: "Agency", fill: CHART_COLORS.blue },
      promoter: { label: "Promoter", fill: CHART_COLORS.violet },
      admin: { label: "Admin", fill: CHART_COLORS.emerald },
      unknown: { label: "Unknown", fill: CHART_COLORS.slate },
    };

    return data.userStats.byRole
      .map((item) => {
        const roleKey = (item.role || "").toLowerCase().trim();
        const config = roleMapping[roleKey] || { label: item.role, fill: CHART_COLORS.slate };
        return {
          name: config.label,
          value: Number(item.count || 0),
          fill: config.fill,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const topWilayas = useMemo(() => {
    if (!data?.propertiesByWilaya) return [];

    const cityCounts: Record<string, number> = {};
    data.propertiesByWilaya.forEach((item) => {
      if (!item || !item.city || item.city.trim() === "") return;
      const normalized = normalizeCityName(item.city);
      cityCounts[normalized] = (cityCounts[normalized] || 0) + Number(item.count || 0);
    });

    return Object.entries(cityCounts)
      .map(([cityName, count]) => ({ name: cityName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const visitsThisMonthData = useMemo(() => {
    if (!data?.visitStats?.thisMonthByDay) return [];
    return data.visitStats.thisMonthByDay.map((item) => ({
      Day: String(item.day),
      Visits: item.count,
    }));
  }, [data]);

  const todayVisitsData = useMemo(() => {
    if (!data?.visitStats?.todayByHour) return [];
    return data.visitStats.todayByHour.map((item) => ({
      Hour: `${String(item.hour).padStart(2, "0")}:00`,
      Visits: item.count,
    }));
  }, [data]);

  return {
    pageTitle,
    data,
    loading,
    error,
    visitsTimeframe,
    setVisitsTimeframe,
    fetchStats,
    sumTotalUsers,
    monthlyUsersData,
    propertyDistribution,
    userRolesData,
    topWilayas,
    visitsThisMonthData,
    todayVisitsData,
  };
}
