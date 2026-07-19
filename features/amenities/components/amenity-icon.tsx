import React from "react";
import {
  Waves,
  Wifi,
  Car,
  Building,
  ShieldCheck,
  Dumbbell,
  Trees,
  Sun,
  AirVent,
  Flame,
  Utensils,
  Eye,
  Zap,
  Droplet,
  Gamepad2,
  Bell,
  Tv,
  Sparkles,
  LucideIcon,
} from "lucide-react";

/**
 * Returns a relevant Lucide icon based on amenity key, title, or category
 */
export const getAmenityIcon = (key?: string, title?: string, category?: string): LucideIcon => {
  const combined = `${key || ""} ${title || ""} ${category || ""}`.toLowerCase();

  if (combined.match(/pool|piscine|swimming|bassin|waves/)) return Waves;
  if (combined.match(/wifi|internet|connection|fibre/)) return Wifi;
  if (combined.match(/park|garage|car|stationnement|voiture/)) return Car;
  if (combined.match(/elevat|ascenseur|lift/)) return Building;
  if (combined.match(/secur|gardien|camera|surveillance|alarme|lock/)) return ShieldCheck;
  if (combined.match(/gym|fitness|sport|musculation/)) return Dumbbell;
  if (combined.match(/garden|jardin|parc|espace vert|trees|nature/)) return Trees;
  if (combined.match(/balcon|terrass|balcony|patio|sun/)) return Sun;
  if (combined.match(/ac|climat|air|cooling/)) return AirVent;
  if (combined.match(/heat|chauffage|chaudiere|flame/)) return Flame;
  if (combined.match(/kitchen|cuisine|cook/)) return Utensils;
  if (combined.match(/sea|mer|panoram|mountain|view|vue/)) return Eye;
  if (combined.match(/electr|generat|groupe|power|zap/)) return Zap;
  if (combined.match(/water|eau|bache|reservoir/)) return Droplet;
  if (combined.match(/play|game|child|enfant|jeux/)) return Gamepad2;
  if (combined.match(/intercom|phone|sonnette|bell/)) return Bell;
  if (combined.match(/tv|television|cable|sat/)) return Tv;

  return Sparkles;
};

interface AmenityIconProps {
  amenityKey?: string;
  title?: string;
  category?: string;
  className?: string;
}

export const AmenityIcon: React.FC<AmenityIconProps> = ({
  amenityKey,
  title,
  category,
  className = "h-4.5 w-4.5",
}) => {
  const IconComponent = getAmenityIcon(amenityKey, title, category);
  return <IconComponent className={className} />;
};
