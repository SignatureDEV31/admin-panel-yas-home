import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, Tag, KeyRound, MapPin } from "lucide-react";
import { Property } from "@/features/properties/types/property";
import { calculatePropertyStats } from "@/features/properties/utils/properties-utils";

import { AdminStats } from "@/services/types/admin.types";

interface PropertiesStatsProps {
  properties: Property[];
  totalCount?: number;
  adminStats?: AdminStats | null;
}

export const PropertiesStats: React.FC<PropertiesStatsProps> = ({
  properties,
  totalCount,
  adminStats,
}) => {
  const { total, forSale, forRent, uniqueStatesCount } = useMemo(
    () => calculatePropertyStats(properties),
    [properties]
  );

  const displayTotal = totalCount !== undefined ? totalCount : (adminStats?.properties ?? total);

  const displayForSale = useMemo(() => {
    if (adminStats?.propertiesByType) {
      const match = adminStats.propertiesByType.find((p) => (p.type || "").toUpperCase() === "VENTE");
      if (match) return Number(match.count || 0);
    }
    return forSale;
  }, [adminStats, forSale]);

  const displayForRent = useMemo(() => {
    if (adminStats?.propertiesByType) {
      const match = adminStats.propertiesByType.find((p) => (p.type || "").toUpperCase() === "LOCATION");
      if (match) return Number(match.count || 0);
    }
    return forRent;
  }, [adminStats, forRent]);

  const displayWilayas = useMemo(() => {
    if (adminStats?.propertiesByWilaya && adminStats.propertiesByWilaya.length > 0) {
      return adminStats.propertiesByWilaya.length;
    }
    return uniqueStatesCount;
  }, [adminStats, uniqueStatesCount]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Properties */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total Properties
          </span>
          <Building2 className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {displayTotal}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Active real estate catalog entries
          </p>
        </CardContent>
      </Card>

      {/* For Sale */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            For Sale (Vente)
          </span>
          <Tag className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {displayForSale}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Properties listed for purchase
          </p>
        </CardContent>
      </Card>

      {/* For Rent */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            For Rent (Location)
          </span>
          <KeyRound className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {displayForRent}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Properties listed for rental
          </p>
        </CardContent>
      </Card>

      {/* Locations Count */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Active Wilayas
          </span>
          <MapPin className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {displayWilayas}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Distinct geographical regions covered
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
