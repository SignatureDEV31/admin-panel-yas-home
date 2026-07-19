import { api } from "@/lib/axios";

export interface PropertyUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Property {
  id: string;
  _id?: string;
  title: string;
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
  images?: string[];
  mainImage?: string;
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

  let total = items.length;
  if (typeof resData?.total === "number") total = resData.total;
  else if (typeof resData?.totalItems === "number") total = resData.totalItems;
  else if (typeof resData?.count === "number") total = resData.count;

  let page = defaultPage;
  if (typeof resData?.page === "number") page = resData.page;
  else if (typeof resData?.currentPage === "number") page = resData.currentPage;

  let limit = defaultLimit;
  if (typeof resData?.limit === "number") limit = resData.limit;
  else if (typeof resData?.perPage === "number") limit = resData.perPage;

  let totalPages = Math.ceil(total / (limit || 1)) || 1;
  if (typeof resData?.totalPages === "number") totalPages = resData.totalPages;

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
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
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

/**
 * Updates main image via PATCH /properties/{propertyId}/update-main-image
 */
export async function updatePropertyMainImage(propertyId: string, imageId: string): Promise<any> {
  try {
    const response = await api.patch(`/properties/${propertyId}/update-main-image`, {
      imageId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating main image for property ${propertyId}:`, error);
    throw error;
  }
}
