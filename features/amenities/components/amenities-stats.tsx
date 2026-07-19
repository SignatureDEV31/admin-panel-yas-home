import React, { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Sparkles, Library, TrendingUp, AlertTriangle } from "lucide-react";
import { Amenity } from "@/features/amenities/types/amenity";
import { calculateAmenityStats } from "@/features/amenities/utils/amenities-utils";

interface AmenitiesStatsProps {
  amenities: Amenity[];
}

export const AmenitiesStats: React.FC<AmenitiesStatsProps> = ({ amenities }) => {
  const {
    totalAmenities,
    totalCategories,
    largestCategory,
    dataIssuesCount,
  } = useMemo(() => calculateAmenityStats(amenities), [amenities]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Amenities */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total Amenities
          </span>
          <Sparkles className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {totalAmenities}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Active amenity attributes in system
          </p>
        </CardContent>
      </Card>

      {/* Total Categories */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Total Categories
          </span>
          <Library className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {totalCategories}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Unique category definitions
          </p>
        </CardContent>
      </Card>

      {/* Largest Category */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Largest Category
          </span>
          <TrendingUp className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-xl font-bold tracking-tight text-foreground line-clamp-1 h-9 flex items-center">
            {largestCategory}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Group containing most amenities
          </p>
        </CardContent>
      </Card>

      {/* Data Issues */}
      <Card className="hover:border-border/100 hover:-translate-y-0.5 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Data Issues
          </span>
          <AlertTriangle className="h-6 w-6 text-yashomePink shrink-0" />
        </CardHeader>
        <CardContent className="mt-1">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {dataIssuesCount}
          </span>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            Missing fields or duplicate entries detected
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
