"use client";

import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useOverview } from "../hooks/use-overview";

import { OverviewKpiCards } from "./overview-kpi-cards";
import { OverviewCharts } from "./overview-charts";
import { OverviewRecentActivity } from "./overview-recent-activity";

import {
  formatNumber,
  formatDate,
  getInitials,
} from "@/features/overview/utils/overview-utils";

export function OverviewPageView() {
  const isMounted = useMounted();
  const {
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
  } = useOverview();

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
