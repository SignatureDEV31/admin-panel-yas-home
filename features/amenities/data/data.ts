import { Sparkles, Library, TrendingUp, AlertTriangle, LucideIcon } from "lucide-react";

export interface AmenityStatItem {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  valueClassName?: string;
}

export interface AmenityStatsInput {
  totalAmenities: number;
  totalCategories: number;
  largestCategory: string;
  dataIssuesCount: number;
}

export function getAmenityStatItems(stats: AmenityStatsInput): AmenityStatItem[] {
  return [
    {
      title: "Total Amenities",
      value: stats.totalAmenities,
      description: "Active amenity attributes in system",
      icon: Sparkles,
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      description: "Unique category definitions",
      icon: Library,
    },
    {
      title: "Largest Category",
      value: stats.largestCategory,
      description: "Group containing most amenities",
      icon: TrendingUp,
      valueClassName:
        "text-xl font-bold tracking-tight text-foreground line-clamp-1 h-9 flex items-center",
    },
    {
      title: "Data Issues",
      value: stats.dataIssuesCount,
      description: "Missing fields or duplicate entries detected",
      icon: AlertTriangle,
    },
  ];
}

export const amenitySortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-az", label: "Title A–Z" },
  { value: "title-za", label: "Title Z–A" },
  { value: "category-az", label: "Category A–Z" },
];
