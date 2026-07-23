import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Building2, Briefcase } from "lucide-react";
import { AdminStats } from "@/services/types/admin.types";

interface OverviewCoreCardsProps {
  stats: AdminStats;
  sumTotalUsers: number;
  visitsTimeframe: 'today' | 'week' | 'month';
  setVisitsTimeframe: (timeframe: 'today' | 'week' | 'month') => void;
  formatNumber: (num: number) => string;
}

export const OverviewCoreCards: React.FC<OverviewCoreCardsProps> = ({
  stats,
  sumTotalUsers,
  visitsTimeframe,
  setVisitsTimeframe,
  formatNumber,
}) => {
  const currentVisits =
    visitsTimeframe === 'today'
      ? stats.visitStats?.today || 0
      : visitsTimeframe === 'week'
      ? stats.visitStats?.thisWeek || 0
      : stats.visitStats?.thisMonth || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1: Total Users */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total Users
          </span>
          <Users className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {formatNumber(sumTotalUsers)}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            Sum of all registered platform roles
          </p>
        </CardContent>
      </Card>

      {/* KPI 2: Total Visits */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total Visits
          </span>
          <TrendingUp className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {formatNumber(currentVisits)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setVisitsTimeframe('today')}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                visitsTimeframe === 'today'
                  ? 'bg-main text-white'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setVisitsTimeframe('week')}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                visitsTimeframe === 'week'
                  ? 'bg-main text-white'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setVisitsTimeframe('month')}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                visitsTimeframe === 'month'
                  ? 'bg-main text-white'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
            >
              Month
            </button>
          </div>
        </CardContent>
      </Card>

      {/* KPI 3: Total Properties */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Properties
          </span>
          <Building2 className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {formatNumber(stats.properties || 0)}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            Active real estate listings on portal
          </p>
        </CardContent>
      </Card>

      {/* KPI 4: Total Projects */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Real Estate Projects
          </span>
          <Briefcase className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {formatNumber(stats.projects || 0)}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            Promoter development complexes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
