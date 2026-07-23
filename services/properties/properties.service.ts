import { api } from "@/lib/axios";
import { paginationMetaSchema } from "./properties.schema";

export interface PropertyUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface PropertyImageItem {
  id: string;
  url: string;
}

export interface Property {
  id: string;
  _id?: string;
  title: string;
  propertyName?: string;
  description?: string;
  price?: number | string;
  surface?: number | string;
  propertyType?: "VENTE" | "LOCATION" | string;
  category?: string | { name?: string; title?: string };
  projectStatus?: "ANNOUNCEMENT" | "UNDER_CONSTRUCTION" | "FINISHED" | string;
  state?: string;
  wilaya?: string;
  city?: string;
  address?: string;
  adress?: string;
  country?: string;
  latitude?: string | number;
  longitude?: string | number;
  beds?: number;
  propertyEtage?: number;
  apartmentsNumber?: number;
  capaciteMax?: number;
  pricingDeal?: string;
  pricingMethode?: string;
  pricingType?: string;
  securityDeposit?: number | string;
  discount?: number | string;
  rentalPeriod?: string;
  descriptionPaiement?: string;
  availableStatus?: boolean;
  availableDate?: string;
  videoLink?: string;
  images?: (string | PropertyImageItem)[];
  mainImage?: string | PropertyImageItem;
  typeVendeur?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: PropertyUser;
}

export interface UnifiedSearchQueryParams {
  limit?: number;
  page?: number;
  searchIn?: "all" | "properties" | "projects" | string;
  sortOrder?: "ASC" | "DESC" | string;
  sortBy?: "price" | "surface" | "createdAt" | "vues" | string;
  createdBefore?: string;
  createdAfter?: string;
  typeVendeur?: string | string[];
  financementPrixMax?: number | string;
  financementPrixMin?: number | string;
  financementType?: string;
  projectSousType?: string;
  projectType?: string;
  projectStatus?: string | string[];
  bedsMax?: number | string;
  bedsMin?: number | string;
  surfaceMax?: number | string;
  surfaceMin?: number | string;
  priceMax?: number | string;
  priceMin?: number | string;
  category?: string | string[];
  propertyType?: string | string[];
  country?: string;
  city?: string;
  state?: string;
  keyword?: string;
}

export type PropertyQueryParams = UnifiedSearchQueryParams;

export interface PropertiesResponse {
  data?: Property[];
  properties?: Property[];
  items?: Property[];
  results?: Property[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  price: number | string;
  surface: number | string;
  propertyType: "VENTE" | "LOCATION" | string;
  category: string;
  state: string;
  city?: string;
  address?: string;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function extractArrayFromResponse(resData: any): Property[] {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;

  if (Array.isArray(resData.properties)) return resData.properties;
  if (Array.isArray(resData.projects)) return resData.projects;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.items)) return resData.items;
  if (Array.isArray(resData.results)) return resData.results;

  if (resData.properties && typeof resData.properties === "object") {
    const nestedProps = extractArrayFromResponse(resData.properties);
    if (nestedProps.length > 0) return nestedProps;
  }
  if (resData.data && typeof resData.data === "object") {
    const nestedData = extractArrayFromResponse(resData.data);
    if (nestedData.length > 0) return nestedData;
  }

  return [];
}

export function extractPaginatedResponse(
  resData: any,
  defaultPage = 1,
  defaultLimit = 12
): PaginatedResult<Property> {
  const items = extractArrayFromResponse(resData);

  // Check nested container objects if root doesn't have explicit metadata
  let metaSource = resData;
  if (resData?.properties && typeof resData.properties === "object" && !Array.isArray(resData.properties)) {
    metaSource = resData.properties;
  } else if (resData?.projects && typeof resData.projects === "object" && !Array.isArray(resData.projects)) {
    metaSource = resData.projects;
  } else if (resData?.data && typeof resData.data === "object" && !Array.isArray(resData.data)) {
    metaSource = resData.data;
  }

  // Parse the candidates using the Zod schema safely
  const parsedMeta = paginationMetaSchema.safeParse(metaSource).data || {};
  const parsedRoot = paginationMetaSchema.safeParse(resData).data || {};

  // Extract total using prioritized fallback checks
  const total = parsedMeta.total ?? parsedRoot.total
    ?? parsedMeta.totalProperties ?? parsedRoot.totalProperties
    ?? parsedMeta.total_properties ?? parsedRoot.total_properties
    ?? parsedMeta.totalItems ?? parsedRoot.totalItems
    ?? parsedMeta.total_items ?? parsedRoot.total_items
    ?? parsedMeta.totalCount ?? parsedRoot.totalCount
    ?? parsedMeta.total_count ?? parsedRoot.total_count
    ?? parsedMeta.count ?? parsedRoot.count
    ?? parsedMeta.meta?.total ?? parsedRoot.meta?.total
    ?? parsedMeta.meta?.totalItems ?? parsedRoot.meta?.totalItems
    ?? parsedMeta.pagination?.total ?? parsedRoot.pagination?.total
    ?? items.length;

  // Extract page
  const page = parsedMeta.page ?? parsedRoot.page
    ?? parsedMeta.currentPage ?? parsedRoot.currentPage
    ?? parsedMeta.meta?.page ?? parsedRoot.meta?.page
    ?? defaultPage;

  // Extract limit
  const limit = parsedMeta.limit ?? parsedRoot.limit
    ?? parsedMeta.perPage ?? parsedRoot.perPage
    ?? parsedMeta.meta?.limit ?? parsedRoot.meta?.limit
    ?? defaultLimit;

  // Extract totalPages
  const totalPages = parsedMeta.totalPages ?? parsedRoot.totalPages
    ?? parsedMeta.meta?.totalPages ?? parsedRoot.meta?.totalPages
    ?? (Math.ceil(total / (limit || 1)) || 1);

  return {
    data: items,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetches unified search results with pagination metadata via GET /home/unified-search
 */
export async function getUnifiedSearchPaginated(
  params?: UnifiedSearchQueryParams
): Promise<PaginatedResult<Property>> {
  try {
    const response = await api.get<any>("/home/unified-search", {
      params,
    });
    return extractPaginatedResponse(response.data, params?.page || 1, params?.limit || 12);
  } catch (error) {
    console.error("Error performing unified search via /home/unified-search:", error);
    throw error;
  }
}

/**
 * Fetches unified search results for properties & projects via GET /home/unified-search
 */
export async function getUnifiedSearch(params?: UnifiedSearchQueryParams): Promise<Property[]> {
  const paginated = await getUnifiedSearchPaginated(params);
  return paginated.data;
}

/**
 * Fetches properties via GET /home/unified-search
 */
export async function getProperties(params?: PropertyQueryParams): Promise<Property[]> {
  return getUnifiedSearch({ searchIn: "properties", ...params });
}

/**
 * Fetches a single property by ID from GET /properties/{id}
 */
export async function getPropertyById(id: string): Promise<Property> {
  try {
    const response = await api.get<any>(`/properties/${id}`);
    const resData = response.data;

    let item = resData;
    if (resData && resData.property) {
      item = {
        ...resData,
        ...resData.property,
        id: resData.property.id || resData.id || id,
        rawParent: resData,
      };
    } else if (resData && resData.data) {
      item = resData.data;
    }

    if (item) {
      return item;
    }
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn(`GET /properties/${id} failed, attempting search fallback for ID ${id}:`, error);
  }

  // Fallback: search unified search for the property by ID
  try {
    const all = await getProperties({ limit: 50 });
    const match = all.find((p) => String(p.id) === String(id) || String(p._id) === String(id));
    if (match) return match;
  } catch (err) {
    console.error(`Fallback search for property ${id} failed:`, err);
  }

  throw new Error(`Property with ID #${id} could not be retrieved from the server.`);
}

/**
 * Creates a new property via POST /properties
 */
export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  try {
    const response = await api.post<Property>("/properties", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

/**
 * Updates an existing property via PATCH /properties/{id}
 */
export async function updateProperty(id: string, payload: UpdatePropertyPayload): Promise<Property> {
  try {
    const response = await api.patch<Property>(`/properties/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a property via DELETE /properties/{id}
 */
export async function deleteProperty(id: string): Promise<void> {
  try {
    await api.delete(`/properties/${id}`);
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw error;
  }
}

/**
 * Uploads images to a property via POST /properties/{id}/upload-images
 */
export async function uploadPropertyImages(id: string, formData: FormData): Promise<any> {
  try {
    const response = await api.post(`/properties/${id}/upload-images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading images for property ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a property image via DELETE /properties/{imageId}/images
 */
export async function deletePropertyImage(imageId: string): Promise<any> {
  try {
    const response = await api.delete(`/properties/${imageId}/images`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    throw error;
  }
}

export async function updatePropertyMainImage(propertyId: string, imageId: string): Promise<any> {
  const numericId = !isNaN(Number(imageId)) ? Number(imageId) : imageId;

  try {
    const response = await api.patch(`/properties/${propertyId}/update-main-image`, {
      id: numericId,
      imageId: numericId,
      mainImage: imageId,
    });
    return response.data;
  } catch (error) {
    console.warn(`PATCH /properties/${propertyId}/update-main-image failed, trying fallback:`, error);
    try {
      const resp2 = await api.patch(`/properties/${propertyId}`, {
        mainImage: numericId,
      });
      return resp2.data;
    } catch (err2) {
      console.error(`Error updating main image for property ${propertyId}:`, error);
      throw error;
    }
  }
}
