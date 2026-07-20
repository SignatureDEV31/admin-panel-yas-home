import { api } from "@/lib/axios";

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

  let total = items.length;
  if (typeof metaSource?.total === "number") { total = metaSource.total; }
  else if (typeof resData?.total === "number") { total = resData.total; }
  else if (typeof metaSource?.totalProperties === "number") { total = metaSource.totalProperties; }
  else if (typeof resData?.totalProperties === "number") { total = resData.totalProperties; }
  else if (typeof metaSource?.total_properties === "number") { total = metaSource.total_properties; }
  else if (typeof resData?.total_properties === "number") { total = resData.total_properties; }
  else if (typeof metaSource?.totalItems === "number") { total = metaSource.totalItems; }
  else if (typeof resData?.totalItems === "number") { total = resData.totalItems; }
  else if (typeof metaSource?.total_items === "number") { total = metaSource.total_items; }
  else if (typeof resData?.total_items === "number") { total = resData.total_items; }
  else if (typeof metaSource?.totalCount === "number") { total = metaSource.totalCount; }
  else if (typeof resData?.totalCount === "number") { total = resData.totalCount; }
  else if (typeof metaSource?.total_count === "number") { total = metaSource.total_count; }
  else if (typeof resData?.total_count === "number") { total = resData.total_count; }
  else if (typeof metaSource?.count === "number") { total = metaSource.count; }
  else if (typeof resData?.count === "number") { total = resData.count; }
  else if (typeof metaSource?.meta?.total === "number") { total = metaSource.meta.total; }
  else if (typeof resData?.meta?.total === "number") { total = resData.meta.total; }
  else if (typeof metaSource?.meta?.totalItems === "number") { total = metaSource.meta.totalItems; }
  else if (typeof resData?.meta?.totalItems === "number") { total = resData.meta.totalItems; }
  else if (typeof metaSource?.pagination?.total === "number") { total = metaSource.pagination.total; }
  else if (typeof resData?.pagination?.total === "number") { total = resData.pagination.total; }

  let page = defaultPage;
  if (typeof metaSource?.page === "number") page = metaSource.page;
  else if (typeof resData?.page === "number") page = resData.page;
  else if (typeof metaSource?.currentPage === "number") page = metaSource.currentPage;
  else if (typeof resData?.currentPage === "number") page = resData.currentPage;
  else if (typeof metaSource?.meta?.page === "number") page = metaSource.meta.page;
  else if (typeof resData?.meta?.page === "number") page = resData.meta.page;

  let limit = defaultLimit;
  if (typeof metaSource?.limit === "number") limit = metaSource.limit;
  else if (typeof resData?.limit === "number") limit = resData.limit;
  else if (typeof metaSource?.perPage === "number") limit = metaSource.perPage;
  else if (typeof resData?.perPage === "number") limit = resData.perPage;
  else if (typeof metaSource?.meta?.limit === "number") limit = resData.meta.limit;
  else if (typeof resData?.meta?.limit === "number") limit = resData.meta.limit;

  let totalPages = Math.ceil(total / (limit || 1)) || 1;
  if (typeof metaSource?.totalPages === "number") totalPages = metaSource.totalPages;
  else if (typeof resData?.totalPages === "number") totalPages = resData.totalPages;
  else if (typeof metaSource?.meta?.totalPages === "number") totalPages = metaSource.meta.totalPages;
  else if (typeof resData?.meta?.totalPages === "number") totalPages = resData.meta.totalPages;

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
