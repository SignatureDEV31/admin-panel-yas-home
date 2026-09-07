import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { AdminDashboardStats } from "@/services/types/admin.types";
import {
  getPlatformStakeholderItems,
  getPlatformPipelineItems,
} from "../data/data";

interface OverviewPlatformStatusProps {
  stats?: AdminDashboardStats | null;
  formatNumber: (num: number) => string;
}

export const OverviewPlatformStatus: React.FC<OverviewPlatformStatusProps> = ({
  stats,
  formatNumber,
}) => {
  const stakeholderItems = getPlatformStakeholderItems(stats);
  const pipelineItems = getPlatformPipelineItems(stats);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
          <Activity className="h-4.5 w-4.5 text-yashomePink" />
          Platform Status & Operations
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Live channels traffic distribution and operational pipelines from backend.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Column 1: User Channels & Actors */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
              Channels & Key Stakeholders
            </h3>

            {stakeholderItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-foreground">
                    {formatNumber(item.value)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Column 2: Operations & Funnels */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
              Pipelines & Inventory
            </h3>

            {pipelineItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-foreground">
                    {formatNumber(item.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
