import { Building2, Tag, KeyRound, MapPin, LucideIcon } from "lucide-react";

export interface PropertyStatItem {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export interface PropertyStatsInput {
  total: number;
  forSale: number;
  forRent: number;
  uniqueStatesCount: number;
}

export function getPropertyStatItems(stats: PropertyStatsInput): PropertyStatItem[] {
  return [
    {
      title: "Total Properties",
      value: stats.total,
      description: "Active real estate catalog entries",
      icon: Building2,
    },
    {
      title: "For Sale (Vente)",
      value: stats.forSale,
      description: "Properties listed for purchase",
      icon: Tag,
    },
    {
      title: "For Rent (Location)",
      value: stats.forRent,
      description: "Properties listed for rental",
      icon: KeyRound,
    },
    {
      title: "Active Wilayas",
      value: stats.uniqueStatesCount,
      description: "Distinct geographical regions covered",
      icon: MapPin,
    },
  ];
}

export const propertyTypeOptions = [
  { value: "all", label: "All Deals (Sale & Rent)" },
  { value: "VENTE", label: "For Sale (Vente)" },
  { value: "LOCATION", label: "For Rent (Location)" },
];

export const propertyAvailabilityOptions = [
  { value: "all", label: "All Availability" },
  { value: "available", label: "Available Only" },
  { value: "unavailable", label: "Unavailable / Occupied" },
];
