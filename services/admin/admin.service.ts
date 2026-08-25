import { api } from "@/lib/axios";
import {
  AdminDashboardStats,
  AdminStatsFilterDto,
  BreakdownsResponse,
  ExportFormat,
  ExportResource,
  FeaturedPromoterItem,
  FeaturedPropertyItem,
  GlobalSearchResult,
  GrowthTrendsResponse,
  PropertyTypeEntity,
  RecentActivityResponse,
  StatsPeriod,
  WilayaEntity,
} from "../types/admin.types";

/**
 * Fetches the aggregated admin dashboard statistics from GET /admin/stats.
 */
export async function getAdminStats(): Promise<AdminDashboardStats> {
  try {
    const response = await api.get<AdminDashboardStats>("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats in service:", error);
    throw error;
  }
}

/**
 * Fetches the comprehensive platform KPI counters from GET /admin/dashboard/stats.
 */
export async function getDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const response = await api.get<AdminDashboardStats>("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Fetches time-series growth trends for registrations, projects, properties, and visits.
 */
export async function getGrowthTrends(
  filter?: AdminStatsFilterDto
): Promise<GrowthTrendsResponse> {
  try {
    const response = await api.get<GrowthTrendsResponse>(
      "/admin/dashboard/growth-trends",
      {
        params: filter,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching growth trends:", error);
    throw error;
  }
}

/**
 * Fetches distribution breakdowns by property type, project status, roles, and top wilayas.
 */
export async function getBreakdowns(): Promise<BreakdownsResponse> {
  try {
    const response = await api.get<BreakdownsResponse>(
      "/admin/dashboard/breakdowns"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard breakdowns:", error);
    throw error;
  }
}

/**
 * Fetches recent activity feed across users, projects, and properties.
 */
export async function getRecentActivity(): Promise<RecentActivityResponse> {
  try {
    const response = await api.get<RecentActivityResponse>(
      "/admin/dashboard/recent-activity"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw error;
  }
}

/**
 * Performs cross-entity global search across users, projects, and properties.
 */
export async function globalSearch(query: string): Promise<GlobalSearchResult> {
  if (!query || query.trim().length < 2) {
    return { users: [], projects: [], properties: [] };
  }
  try {
    const response = await api.get<GlobalSearchResult>("/admin/search", {
      params: { q: query.trim() },
    });
    return response.data;
  } catch (error) {
    console.error("Error performing global search:", error);
    return { users: [], projects: [], properties: [] };
  }
}

/**
 * Exports data dataset (users, projects, properties, requests) as JSON or triggers CSV download.
 */
export async function exportData(
  resource: ExportResource,
  format: ExportFormat = ExportFormat.CSV
): Promise<any> {
  try {
    if (format === ExportFormat.CSV) {
      const response = await api.get(`/admin/export/${resource}`, {
        params: { format: "csv" },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${resource}_export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } else {
      const response = await api.get(`/admin/export/${resource}`, {
        params: { format: "json" },
      });
      return response.data;
    }
  } catch (error) {
    console.error(`Error exporting ${resource} data:`, error);
    throw error;
  }
}

/**
 * Marketing: Fetches all featured properties.
 */
export async function getFeaturedProperties(): Promise<FeaturedPropertyItem[]> {
  try {
    const response = await api.get<FeaturedPropertyItem[]>(
      "/admin/featured_properties"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    throw error;
  }
}

/**
 * Marketing: Adds a property to the featured showcase.
 */
export async function addFeaturedProperty(data: {
  propertyProject: any;
}): Promise<any> {
  try {
    const response = await api.post("/admin/featured_property", data);
    return response.data;
  } catch (error) {
    console.error("Error adding featured property:", error);
    throw error;
  }
}

/**
 * Marketing: Removes a property from featured showcase.
 */
export async function deleteFeaturedProperty(id: number): Promise<any> {
  try {
    const response = await api.delete(`/admin/featured_property/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting featured property ${id}:`, error);
    throw error;
  }
}

/**
 * Marketing: Fetches all featured promoters.
 */
export async function getFeaturedPromoters(): Promise<FeaturedPromoterItem[]> {
  try {
    const response = await api.get<FeaturedPromoterItem[]>(
      "/admin/featured_promoters"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching featured promoters:", error);
    throw error;
  }
}

/**
 * Marketing: Adds a promoter to the featured showcase.
 */
export async function addFeaturedPromoter(data: { user: any }): Promise<any> {
  try {
    const response = await api.post("/admin/featured_promoter", data);
    return response.data;
  } catch (error) {
    console.error("Error adding featured promoter:", error);
    throw error;
  }
}

/**
 * Marketing: Removes a promoter from featured showcase.
 */
export async function deleteFeaturedPromoter(id: number): Promise<any> {
  try {
    const response = await api.delete(`/admin/featured_promoter/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting featured promoter ${id}:`, error);
    throw error;
  }
}

/**
 * Master Data: Fetches all property types.
 */
export async function getPropertyTypes(): Promise<PropertyTypeEntity[]> {
  try {
    const response = await api.get<PropertyTypeEntity[]>(
      "/admin/all_properties_types"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching property types:", error);
    throw error;
  }
}

/**
 * Master Data: Fetches all Wilayas with communes.
 */
export async function getWilayas(): Promise<WilayaEntity[]> {
  try {
    const response = await api.get<WilayaEntity[]>("/admin/get_wilayas");
    return response.data;
  } catch (error) {
    console.error("Error fetching wilayas:", error);
    throw error;
  }
}

/**
 * Master Data: Fetches Wilayas only.
 */
export async function getWilayasOnly(): Promise<WilayaEntity[]> {
  try {
    const response = await api.get<WilayaEntity[]>("/admin/get_wilayas_only");
    return response.data;
  } catch (error) {
    console.error("Error fetching wilayas only:", error);
    throw error;
  }
}

/**
 * Master Data: Fetches communes for a given wilaya code.
 */
export async function getCommunesByWilayaCode(
  code: number
): Promise<WilayaEntity["communes"]> {
  try {
    const response = await api.get(`/admin/get_commune/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching communes for wilaya code ${code}:`, error);
    throw error;
  }
}
