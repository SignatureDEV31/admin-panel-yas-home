import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AdminDashboardStats } from "@/services/types/admin.types";
import { getOverviewCoreCards } from "../data/data";

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
  formatNumber,
}) => {
  const items = getOverviewCoreCards(stats, sumTotalUsers);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.id}
            className="hover:border-border/100 hover:-translate-y-0.5 transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </span>
              <Icon className="h-6 w-6 text-yashomePink shrink-0" />
            </CardHeader>
            <CardContent className="mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {formatNumber(item.value)}
              </span>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
