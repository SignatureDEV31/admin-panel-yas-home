import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Building2, Briefcase } from "lucide-react";
import { AdminDashboardStats } from "@/services/types/admin.types";

interface OverviewCoreCardsProps {
  stats: AdminDashboardStats;
  sumTotalUsers: number;
  visitsTimeframe: "today" | "week" | "month";
  setVisitsTimeframe: (timeframe: "today" | "week" | "month") => void;
  formatNumber: (num: number) => string;
}

export const OverviewCoreCards: React.FC<OverviewCoreCardsProps> = ({
  stats,
  sumTotalUsers,
  visitsTimeframe,
  setVisitsTimeframe,
  formatNumber,
}) => {
  const currentVisits = stats.analytics?.totalVisits || 0;
  const totalProperties = stats.properties?.total ?? stats.properties?.active ?? 0;
  const totalProjects = stats.projects?.total ?? 0;
  const totalUsers = stats.users?.total ?? sumTotalUsers ?? 0;

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
            {formatNumber(totalUsers)}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            {stats.users?.verified ? `${stats.users.verified} verified` : "Registered platform accounts"}
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
            <span className="text-xs text-muted-foreground">
              {stats.analytics?.uniqueVisitors
                ? `${formatNumber(stats.analytics.uniqueVisitors)} unique visitors`
                : "Aggregated page visits"}
            </span>
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
            {formatNumber(totalProperties)}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            {stats.properties?.available ? `${stats.properties.available} available listings` : "Active listings on portal"}
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
            {formatNumber(totalProjects)}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            {stats.projects?.published ? `${stats.projects.published} published developments` : "Promoter development complexes"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
