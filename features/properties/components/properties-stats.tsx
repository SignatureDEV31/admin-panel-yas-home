"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Property } from "@/features/properties/types/property";
import { calculatePropertyStats } from "@/features/properties/utils/properties-utils";
import { AdminStats } from "@/services/types/admin.types";
import { getPropertyStatItems } from "@/features/properties/data/data";

export interface PropertiesStatsProps {
  properties: Property[];
  totalCount?: number;
  adminStats?: AdminStats | null;
}

export function PropertiesStats({
  properties,
  totalCount,
  adminStats,
}: PropertiesStatsProps) {
  const { total, forSale, forRent, uniqueStatesCount } = useMemo(
    () => calculatePropertyStats(properties),
    [properties]
  );

  const displayTotal: number =
    totalCount !== undefined
      ? totalCount
      : typeof adminStats?.properties === "number"
      ? adminStats.properties
      : adminStats?.properties?.total ?? total;

  const displayForSale = useMemo(() => {
    if ((adminStats as any)?.propertiesByType) {
      const match = (adminStats as any).propertiesByType.find(
        (p: any) => (p.type || "").toUpperCase() === "VENTE"
      );
      if (match) return Number(match.count || 0);
    }
    return forSale;
  }, [adminStats, forSale]);

  const displayForRent = useMemo(() => {
    if ((adminStats as any)?.propertiesByType) {
      const match = (adminStats as any).propertiesByType.find(
        (p: any) => (p.type || "").toUpperCase() === "LOCATION"
      );
      if (match) return Number(match.count || 0);
    }
    return forRent;
  }, [adminStats, forRent]);

  const displayWilayas = useMemo(() => {
    if ((adminStats as any)?.propertiesByWilaya && (adminStats as any).propertiesByWilaya.length > 0) {
      return (adminStats as any).propertiesByWilaya.length;
    }
    return uniqueStatesCount;
  }, [adminStats, uniqueStatesCount]);

  const statItems = useMemo(
    () =>
      getPropertyStatItems({
        total: displayTotal,
        forSale: displayForSale,
        forRent: displayForRent,
        uniqueStatesCount: displayWilayas,
      }),
    [displayTotal, displayForSale, displayForRent, displayWilayas]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </span>
              <Icon className="h-6 w-6 text-yashomePink shrink-0" />
            </CardHeader>
            <CardContent className="mt-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {item.value}
              </span>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
