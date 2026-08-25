import { api } from "@/lib/axios";
import { AdminBulkActionDto, PaginatedResult } from "../types/admin.types";

export interface PropertyUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profile?: {
    raison_social?: string;
    city?: string;
    state?: string;
    certify?: boolean;
  };
}

export interface PropertyImageItem {
  id: string | number;
  url: string;
}

export interface Property {
  id: number | string;
  _id?: string;
  title?: string;
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
  vues?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: PropertyUser;
  project?: {
    id: number;
    title?: string;
  };
  amenities?: any[];
  featuredProperties?: any;
}

export interface PropertyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: string;
  pricingType?: string;
  availableStatus?: boolean;
  withDeleted?: boolean;
  onlyDeleted?: boolean;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  projectId?: number;
  userId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | "ASC" | "DESC";
}

export interface CreatePropertyPayload {
  propertyName?: string;
  title?: string;
  description?: string;
  price?: number | string;
  surface?: number | string;
  propertyType?: "VENTE" | "LOCATION" | string;
  category?: string;
  state?: string;
  city?: string;
  address?: string;
  adress?: string;
  country?: string;
  beds?: number;
  availableStatus?: boolean;
  pricingType?: string;
  projectId?: number;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

/**
 * Fetch paginated properties from backend admin endpoint: GET /admin/properties
 */
export async function getProperties(
  params?: PropertyQueryParams
): Promise<PaginatedResult<Property>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  try {
    const response = await api.get<any>("/admin/properties", {
      params: {
        page,
        limit,
        search: params?.search || undefined,
        propertyType:
          params?.propertyType && params.propertyType !== "all"
            ? params.propertyType
            : undefined,
        pricingType:
          params?.pricingType && params.pricingType !== "all"
            ? params.pricingType
            : undefined,
        availableStatus: params?.availableStatus,
        withDeleted: params?.withDeleted,
        onlyDeleted: params?.onlyDeleted,
        city: params?.city,
        state: params?.state,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        projectId: params?.projectId,
        userId: params?.userId,
        sortBy: params?.sortBy || "createdAt",
        sortOrder: params?.sortOrder ? params.sortOrder.toUpperCase() : "DESC",
      },
    });

    const data = response.data;
    if (data && Array.isArray(data.data) && data.meta) {
      return {
        data: data.data,
        meta: data.meta,
      };
    }

    if (Array.isArray(data)) {
      return {
        data,
        meta: {
          totalItems: data.length,
          itemCount: data.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(data.length / limit) || 1,
          currentPage: page,
        },
      };
    }

    return {
      data: [],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: limit,
        totalPages: 1,
        currentPage: page,
      },
    };
  } catch (error: any) {
    console.error("Error fetching properties via /admin/properties:", error);
    throw error;
  }
}

/**
 * Fetches a single property by ID from GET /admin/properties/{id}
 */
export async function getPropertyById(id: string | number): Promise<Property> {
  try {
    const response = await api.get<Property>(`/admin/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id} via /admin/properties/${id}:`, error);
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
 * Updates an existing property via PATCH /admin/properties/{id}
 */
export async function updateProperty(
  id: string | number,
  payload: UpdatePropertyPayload
): Promise<Property> {
  try {
    const response = await api.patch<Property>(`/admin/properties/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
}

/**
 * Soft-deletes a property via DELETE /admin/properties/{id}
 */
export async function deleteProperty(id: string | number): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/admin/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw error;
  }
}

/**
 * Restores a soft-deleted property via PATCH /admin/properties/{id}/restore
 */
export async function restoreProperty(id: string | number): Promise<{ message: string }> {
  try {
    const response = await api.patch(`/admin/properties/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error(`Error restoring property ${id}:`, error);
    throw error;
  }
}

/**
 * Execute bulk action on properties (delete, restore, set_available, set_unavailable)
 */
export async function bulkPropertyAction(
  dto: AdminBulkActionDto
): Promise<{ message: string; affected: number }> {
  try {
    const response = await api.post("/admin/properties/bulk", dto);
    return response.data;
  } catch (error) {
    console.error("Error executing bulk property action:", error);
    throw error;
  }
}

/**
 * Uploads images to a property via POST /r2/{id}/multiple/upload-images
 */
export async function uploadPropertyImages(
  id: string | number,
  formData: FormData
): Promise<any> {
  try {
    const response = await api.post(`/r2/${id}/multiple/upload-images`, formData, {
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
export async function deletePropertyImage(imageId: string | number): Promise<any> {
  try {
    const response = await api.delete(`/properties/${imageId}/images`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    throw error;
  }
}

/**
 * Updates property main image via PATCH /properties/{propertyId}/update-main-image
 */
export async function updatePropertyMainImage(
  propertyId: string | number,
  imageId: string | number
): Promise<any> {
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

// Backward compatibility alias for legacy callers
export async function getUnifiedSearchPaginated(params?: any) {
  const result = await getProperties(params);
  return {
    data: result.data,
    total: result.meta.totalItems,
    page: result.meta.currentPage,
    limit: result.meta.itemsPerPage,
    totalPages: result.meta.totalPages,
  };
}
