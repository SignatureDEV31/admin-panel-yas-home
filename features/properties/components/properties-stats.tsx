import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, Tag, KeyRound, MapPin } from "lucide-react";
import { Property } from "@/features/properties/types/property";
import { calculatePropertyStats } from "@/features/properties/utils/properties-utils";

interface PropertiesStatsProps {
  properties: Property[];
}

export const PropertiesStats: React.FC<PropertiesStatsProps> = ({ properties }) => {
  const { total, forSale, forRent, uniqueStatesCount } = useMemo(
    () => calculatePropertyStats(properties),
    [properties]
  );

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
            {total}
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
            {forSale}
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
            {forRent}
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
            {uniqueStatesCount}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Distinct geographical regions covered
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
