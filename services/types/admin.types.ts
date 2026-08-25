export type RoleType = "regular" | "promoter" | "agence" | "admin" | "unknown";

export enum AdminBulkActionType {
  DELETE = "delete",
  PUBLISH = "publish",
  UNPUBLISH = "unpublish",
  CERTIFY = "certify",
  UNCERTIFY = "uncertify",
  CHANGE_ROLE = "change_role",
  VERIFY_EMAIL = "verify_email",
  RESTORE = "restore",
  SET_AVAILABLE = "set_available",
  SET_UNAVAILABLE = "set_unavailable",
}

export interface AdminBulkActionDto {
  ids: (string | number)[];
  action: AdminBulkActionType | string;
  value?: string;
}

export enum ExportFormat {
  JSON = "json",
  CSV = "csv",
}

export enum ExportResource {
  USERS = "users",
  PROJECTS = "projects",
  PROPERTIES = "properties",
  REQUESTS = "requests",
}

export interface AdminExportDto {
  format?: ExportFormat;
}

export enum StatsPeriod {
  LAST_7_DAYS = "7d",
  LAST_30_DAYS = "30d",
  LAST_90_DAYS = "90d",
  LAST_12_MONTHS = "12m",
  ALL = "all",
}

export interface AdminStatsFilterDto {
  period?: StatsPeriod | string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// 1. Dashboard Stats
export interface AdminDashboardStats {
  users: {
    total: number;
    regular: number;
    promoter: number;
    agency: number;
    admin: number;
    unknown: number;
    verified: number;
    certified: number;
  };
  projects: {
    total: number;
    published: number;
    unpublished: number;
    byStatus: {
      announcement: number;
      underConstruction: number;
      finished: number;
    };
  };
  properties: {
    total: number;
    active: number;
    deleted: number;
    available: number;
    unavailable: number;
  };
  marketing: {
    featuredProperties: number;
    featuredPromoters: number;
  };
  requests: {
    total: number;
  };
  analytics: {
    totalVisits: number;
    uniqueVisitors: number;
  };
}

// Alias for backward compatibility
export type AdminStats = AdminDashboardStats;

// 2. Growth Trends
export interface GrowthTrendItem {
  date: string;
  count: string | number;
}

export interface GrowthTrendsResponse {
  period: string;
  userRegistrations: GrowthTrendItem[];
  projectCreations: GrowthTrendItem[];
  propertyCreations: GrowthTrendItem[];
  pageVisits: GrowthTrendItem[];
}

// 3. Breakdowns
export interface BreakdownItem {
  propertyType?: string;
  pricingType?: string;
  status?: string;
  role?: string;
  state?: string;
  count: string | number;
}

export interface BreakdownsResponse {
  propertiesByType: BreakdownItem[];
  propertiesByPricing: BreakdownItem[];
  projectsByStatus: BreakdownItem[];
  usersByRole: BreakdownItem[];
  topWilayas: {
    properties: BreakdownItem[];
    projects: BreakdownItem[];
  };
}

// 4. Recent Activity
export interface RecentActivityResponse {
  recentUsers: any[];
  recentProjects: any[];
  recentProperties: any[];
  topViewedProjects: any[];
  topViewedProperties: any[];
}

// 5. Global Search
export interface GlobalSearchResult {
  users: any[];
  projects: any[];
  properties: any[];
}

// 6. Featured Items
export interface FeaturedPropertyItem {
  id: number;
  propertyProject?: {
    id: number;
    propertyName?: string;
    city?: string;
    state?: string;
    price?: number;
    images?: Array<{ id: string; url: string }>;
    user?: {
      id: string;
      fullName?: string;
      email?: string;
    };
  };
}

export interface FeaturedPromoterItem {
  id: number;
  user?: {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    profile?: {
      raison_social?: string;
      city?: string;
      state?: string;
      certify?: boolean;
    };
  };
}

// Master Data Types
export interface WilayaEntity {
  id: number;
  code: number;
  nom: string;
  nom_ar?: string;
  communes?: CommuneEntity[];
}

export interface CommuneEntity {
  id: number;
  code: number;
  nom: string;
  nom_ar?: string;
  wilaya_id?: number;
}

export interface PropertyTypeEntity {
  id: number;
  name: string;
}
