import { Property } from "@/features/properties/types/property";

/**
 * Format price with DZD currency
 */
export const formatPrice = (price?: number | string): string => {
  if (price === undefined || price === null || price === "") return "N/A";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return String(price);
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format surface area in m²
 */
export const formatSurface = (surface?: number | string): string => {
  if (surface === undefined || surface === null || surface === "") return "N/A";
  const num = typeof surface === "string" ? parseFloat(surface) : surface;
  if (isNaN(num)) return String(surface);
  return `${num} m²`;
};

/**
 * Format date
 */
export const formatPropertyDate = (isoString?: string, locale = "fr"): string => {
  if (!isoString) return "-";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
    }).format(new Date(isoString));
  } catch (e) {
    return "-";
  }
};

/**
 * Extract category string from Property
 */
export const getPropertyCategory = (property: { category?: any }): string => {
  if (!property.category) return "General";
  if (typeof property.category === "string") return property.category;
  return property.category.title || property.category.name || "General";
};

/**
 * Extract state/wilaya/city string from Property or Project
 */
export const getPropertyLocation = (property: { state?: string; wilaya?: string; city?: string; address?: string; adress?: string }): string => {
  const parts = [property.state || property.wilaya, property.city, property.address || property.adress]
    .filter(Boolean)
    .map((s) => String(s).trim());
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

/**
 * Filter properties by search term, type, and state
 */
export const filterProperties = (
  properties: Property[],
  searchQuery: string,
  selectedType: string,
  selectedState: string
): Property[] => {
  if (!properties || !Array.isArray(properties)) return [];

  let result = [...properties];

  if (searchQuery.trim() !== "") {
    const rawQ = searchQuery.toLowerCase().trim();
    const q = rawQ.replace(/^#/, "");
    result = result.filter((p) => {
      const idStr = String(p.id || p._id || "").toLowerCase();
      const title = (p.title || p.propertyName || "").toLowerCase();
      const cat = getPropertyCategory(p).toLowerCase();
      const loc = getPropertyLocation(p).toLowerCase();
      return idStr.includes(q) || title.includes(q) || cat.includes(q) || loc.includes(q);
    });
  }

  if (selectedType !== "all") {
    result = result.filter(
      (p) => (p.propertyType || "").toUpperCase() === selectedType.toUpperCase()
    );
  }

  if (selectedState !== "all") {
    result = result.filter((p) => {
      const stateStr = (p.state || p.wilaya || p.city || "").toLowerCase();
      return stateStr.includes(selectedState.toLowerCase());
    });
  }

  return result;
};

/**
 * Calculate KPI summary stats for properties
 */
export const calculatePropertyStats = (properties: Property[]) => {
  const safeProps = Array.isArray(properties) ? properties : [];
  const total = safeProps.length;
  const forSale = safeProps.filter((p) => (p.propertyType || "").toUpperCase() === "VENTE").length;
  const forRent = safeProps.filter((p) => (p.propertyType || "").toUpperCase() === "LOCATION").length;

  const states = new Set(
    safeProps
      .map((p) => (p.state || p.wilaya || p.city || "").trim())
      .filter(Boolean)
  );

  return {
    total,
    forSale,
    forRent,
    uniqueStatesCount: states.size,
  };
};
