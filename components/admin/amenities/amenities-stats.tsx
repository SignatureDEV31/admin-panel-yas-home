import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Library, TrendingUp, AlertTriangle } from "lucide-react";
import { Amenity } from "@/types/amenity";

interface AmenitiesStatsProps {
  amenities: Amenity[];
}

export const AmenitiesStats: React.FC<AmenitiesStatsProps> = ({ amenities }) => {
  // 1. Total Amenities
  const totalAmenities = amenities.length;

  // 2. Total Categories (Normalized unique count)
  const totalCategories = useMemo(() => {
    const unique = new Set(
      amenities
        .map((a) => (a.category || "").trim().toLowerCase())
        .filter(Boolean)
    );
    return unique.size;
  }, [amenities]);

  // 3. Largest Category
  const largestCategory = useMemo(() => {
    if (amenities.length === 0) return "N/A";

    const counts: Record<string, number> = {};
    amenities.forEach((a) => {
      const cat = (a.category || "").trim();
      if (!cat) return;
      // Keep casing of first seen category
      const key = cat.toLowerCase();
      if (counts[key]) {
        counts[key]++;
      } else {
        counts[key] = 1;
      }
    });

    let maxKey = "";
    let maxVal = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (v > maxVal) {
        maxVal = v;
        maxKey = k;
      }
    });

    if (!maxKey) return "N/A";

    // Find original casing
    const original = amenities.find(
      (a) => (a.category || "").trim().toLowerCase() === maxKey
    );
    return original ? `${original.category.trim()} (${maxVal})` : `${maxKey} (${maxVal})`;
  }, [amenities]);

  // 4. Data Issues Count
  const dataIssuesCount = useMemo(() => {
    let count = 0;
    const seenKeys = new Set<string>();
    const duplicateKeys = new Set<string>();
    const seenTitles = new Set<string>();
    const duplicateTitles = new Set<string>();
    const seenCategories = new Set<string>(); // raw casing
    const normalizedCategories = new Set<string>(); // lowercase casing

    amenities.forEach((a) => {
      // Missing values
      if (!a.title || a.title.trim() === "") count++;
      if (!a.key || a.key.trim() === "") count++;
      if (!a.category || a.category.trim() === "") count++;

      // Normalized Title duplicates
      // TODO: Real normalization and unique constraints should eventually be enforced by the backend/database.
      if (a.title) {
        const normTitle = a.title.trim().toLowerCase().replace(/\s+/g, " ");
        if (seenTitles.has(normTitle)) {
          if (!duplicateTitles.has(normTitle)) {
            duplicateTitles.add(normTitle);
          }
          count++; // count duplicates
        } else {
          seenTitles.add(normTitle);
        }
      }

      // Key duplicates
      if (a.key) {
        const normKey = a.key.trim().toLowerCase();
        if (seenKeys.has(normKey)) {
          if (!duplicateKeys.has(normKey)) {
            duplicateKeys.add(normKey);
          }
          count++; // count duplicate instances
        } else {
          seenKeys.add(normKey);
        }
      }

      // Inconsistent category casing
      if (a.category && a.category.trim() !== "") {
        const rawCat = a.category.trim();
        const lowerCat = rawCat.toLowerCase();
        if (normalizedCategories.has(lowerCat)) {
          if (!seenCategories.has(rawCat)) {
            count++;
          }
        } else {
          normalizedCategories.add(lowerCat);
          seenCategories.add(rawCat);
        }
      }
    });

    return count;
  }, [amenities]);

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
