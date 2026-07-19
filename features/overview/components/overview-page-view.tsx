"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, RotateCw } from "lucide-react";
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { getAdminStats } from "@/services/admin/admin.service";
import { AdminStats } from "@/services/types/admin.types";

import { OverviewKpiCards } from "./overview-kpi-cards";
import { OverviewCharts } from "./overview-charts";
import { OverviewRecentActivity } from "./overview-recent-activity";

import {
  CHART_COLORS,
  formatNumber,
  formatDate,
  getInitials,
  normalizeCityName,
} from "@/features/overview/utils/overview-utils";

export function OverviewPageView() {
  const isMounted = useMounted();
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
    return data.monthlyUsers.map(item => {
      let monthName = "Unknown";
      try {
        const date = new Date(item.month);
        monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
      } catch {}
      return {
        Month: monthName,
        "Number of users": Number(item.count || 0)
      };
    });
  }, [data]);

  const propertyDistribution = useMemo(() => {
    if (!data?.propertiesByType) return [];
    
    return data.propertiesByType.map(item => {
      const typeLabel = item.type === "VENTE" ? "Sale" : item.type === "LOCATION" ? "Rent" : item.type;
      return {
        name: typeLabel,
        value: Number(item.count || 0),
        fill: item.type === "VENTE" ? CHART_COLORS.yashomePink : CHART_COLORS.main
      };
    }).filter(item => ["sale", "rent"].includes(item.name.toLowerCase()));
  }, [data]);

  const userRolesData = useMemo(() => {
    if (!data?.userStats?.byRole) return [];
    
    const roleMapping: Record<string, { label: string; fill: string }> = {
      regular: { label: "Regular", fill: CHART_COLORS.indigo },
      agence: { label: "Agency", fill: CHART_COLORS.blue },
      promoter: { label: "Promoter", fill: CHART_COLORS.violet },
      admin: { label: "Admin", fill: CHART_COLORS.emerald },
      unknown: { label: "Unknown", fill: CHART_COLORS.slate }
    };

    return data.userStats.byRole.map(item => {
      const roleKey = (item.role || "").toLowerCase().trim();
      const config = roleMapping[roleKey] || { label: item.role, fill: CHART_COLORS.slate };
      return {
        name: config.label,
        value: Number(item.count || 0),
        fill: config.fill
      };
    }).filter(item => item.value > 0);
  }, [data]);

  const topWilayas = useMemo(() => {
    if (!data?.propertiesByWilaya) return [];
    
    const cityCounts: Record<string, number> = {};
    data.propertiesByWilaya.forEach(item => {
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
    return data.visitStats.thisMonthByDay.map(item => ({
      Day: String(item.day),
      Visits: item.count
    }));
  }, [data]);

  const todayVisitsData = useMemo(() => {
    if (!data?.visitStats?.todayByHour) return [];
    return data.visitStats.todayByHour.map(item => ({
      Hour: `${String(item.hour).padStart(2, "0")}:00`,
      Visits: item.count
    }));
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
        </div>
        <div className="flex items-center justify-center min-h-[450px] w-full">
          <Card className="max-w-md w-full border-destructive/20 bg-destructive/5/10 dark:bg-destructive/5 shadow-xs">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground mb-2">Connection Error</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                {error}
              </CardDescription>
              <div className="flex gap-3 w-full justify-center">
                <Button variant="default" className="px-6 cursor-pointer w-full" onClick={fetchStats}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between h-[116px]">
              <div className="flex items-center justify-between pb-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
      </div>

      <OverviewKpiCards
        stats={data}
        sumTotalUsers={sumTotalUsers}
        visitsTimeframe={visitsTimeframe}
        setVisitsTimeframe={setVisitsTimeframe}
        formatNumber={formatNumber}
      />

      <OverviewCharts
        isMounted={isMounted}
        monthlyUsersData={monthlyUsersData}
        propertyDistribution={propertyDistribution}
        userRolesData={userRolesData}
        topWilayas={topWilayas}
        visitsThisMonthData={visitsThisMonthData}
        todayVisitsData={todayVisitsData}
        sumTotalUsers={sumTotalUsers}
        formatNumber={formatNumber}
      />

      <OverviewRecentActivity
        recentPromoters={data.userStats?.promoters?.recent || []}
        getInitials={getInitials}
        formatDate={formatDate}
      />
    </div>
  );
}
