import { Amenity } from "@/features/amenities/types/amenity";

/**
 * Autogenerate system key from title
 */
export const generateSystemKey = (title: string): string => {
  if (!title) return "";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s-]/g, "")        // remove special chars
    .replace(/[\s-]+/g, "_")          // replace spaces/hyphens with single underscore
    .replace(/^_+|_+$/g, "");        // trim leading/trailing underscores
};

/**
 * Format ISO date string for display
 */
export const formatAmenityDate = (isoString: string, locale = "fr"): string => {
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
 * Extract unique sorted categories from amenities list
 */
export const computeAmenityCategories = (amenities: Amenity[]): string[] => {
  if (!amenities) return [];
  const unique = new Set(
    amenities.map((a) => (a.category || "").trim()).filter(Boolean)
  );
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
};

/**
 * Filter and sort amenities list
 */
export const filterAndSortAmenities = (
  amenities: Amenity[],
  searchQuery: string,
  selectedCategory: string,
  sortBy: string
): Amenity[] => {
  if (!amenities) return [];

  let result = [...amenities];

  // 1. Search Query Filter (Title, Key, Category)
  if (searchQuery.trim() !== "") {
    const rawQ = searchQuery.toLowerCase().trim();
    const q = rawQ.replace(/^#/, "");
    result = result.filter(
      (item) =>
        String((item as any).id || (item as any)._id || "").toLowerCase().includes(q) ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.key || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (selectedCategory !== "all") {
    result = result.filter(
      (item) => (item.category || "").trim() === selectedCategory
    );
  }

  // 3. Sorting
  result.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortBy === "title-az") {
      return (a.title || "").localeCompare(b.title || "");
    }
    if (sortBy === "title-za") {
      return (b.title || "").localeCompare(a.title || "");
    }
    if (sortBy === "category-az") {
      return (a.category || "").localeCompare(b.category || "");
    }
    return 0;
  });

  return result;
};

/**
 * Calculate KPI summary stats for amenities list
 */
export const calculateAmenityStats = (amenities: Amenity[]) => {
  const totalAmenities = amenities.length;

  const uniqueCategories = new Set(
    amenities
      .map((a) => (a.category || "").trim().toLowerCase())
      .filter(Boolean)
  );
  const totalCategories = uniqueCategories.size;

  let largestCategory = "N/A";
  if (amenities.length > 0) {
    const counts: Record<string, number> = {};
    amenities.forEach((a) => {
      const cat = (a.category || "").trim();
      if (!cat) return;
      const key = cat.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    let maxKey = "";
    let maxVal = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (v > maxVal) {
        maxVal = v;
        maxKey = k;
      }
    });

    if (maxKey) {
      const original = amenities.find(
        (a) => (a.category || "").trim().toLowerCase() === maxKey
      );
      largestCategory = original ? `${original.category.trim()} (${maxVal})` : `${maxKey} (${maxVal})`;
    }
  }

  let dataIssuesCount = 0;
  const seenKeys = new Set<string>();
  const duplicateKeys = new Set<string>();
  const seenTitles = new Set<string>();
  const duplicateTitles = new Set<string>();
  const seenCategories = new Set<string>();
  const normalizedCategories = new Set<string>();

  amenities.forEach((a) => {
    if (!a.title || a.title.trim() === "") dataIssuesCount++;
    if (!a.key || a.key.trim() === "") dataIssuesCount++;
    if (!a.category || a.category.trim() === "") dataIssuesCount++;

    if (a.title) {
      const normTitle = a.title.trim().toLowerCase().replace(/\s+/g, " ");
      if (seenTitles.has(normTitle)) {
        if (!duplicateTitles.has(normTitle)) {
          duplicateTitles.add(normTitle);
        }
        dataIssuesCount++;
      } else {
        seenTitles.add(normTitle);
      }
    }

    if (a.key) {
      const normKey = a.key.trim().toLowerCase();
      if (seenKeys.has(normKey)) {
        if (!duplicateKeys.has(normKey)) {
          duplicateKeys.add(normKey);
        }
        dataIssuesCount++;
      } else {
        seenKeys.add(normKey);
      }
    }

    if (a.category && a.category.trim() !== "") {
      const rawCat = a.category.trim();
      const lowerCat = rawCat.toLowerCase();
      if (normalizedCategories.has(lowerCat)) {
        if (!seenCategories.has(rawCat)) {
          dataIssuesCount++;
        }
      } else {
        normalizedCategories.add(lowerCat);
        seenCategories.add(rawCat);
      }
    }
  });

  return {
    totalAmenities,
    totalCategories,
    largestCategory,
    dataIssuesCount,
  };
};
