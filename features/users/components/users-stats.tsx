"use client";

import React, { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUserStatItems } from "@/features/users/data/data";

export interface UsersStatsProps {
  stats: {
    total: number;
    activeCount: number;
    regularCount: number;
    agencyCount: number;
    promoterCount: number;
    adminCount: number;
    certifiedCount?: number;
  };
}

export function UsersStats({ stats }: UsersStatsProps) {
  const statItems = useMemo(() => getUserStatItems(stats), [stats]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="border-border/60 bg-card shadow-xs transition-all hover:border-border"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.title}
                </span>
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${item.iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {item.value}
                </span>
                <p className={`text-xs mt-1 ${item.descriptionClass}`}>
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Roles Breakdown */}
      <Card className="border-border/60 bg-card shadow-xs transition-all hover:border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Roles Breakdown
            </span>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{stats.regularCount}</span>
              <span className="text-muted-foreground">Regular</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{stats.agencyCount}</span>
              <span className="text-muted-foreground">Agency</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{stats.promoterCount}</span>
              <span className="text-muted-foreground">Promoter</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
