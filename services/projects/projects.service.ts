import { api } from "@/lib/axios";
import { PropertyImageItem } from "@/services/properties/properties.service";
import { AdminBulkActionDto, PaginatedResult } from "../types/admin.types";

export type ProjectStatusType = "ANNOUNCEMENT" | "UNDER_CONSTRUCTION" | "FINISHED";

export interface Project {
  id: number | string;
  _id?: string;
  title?: string;
  propertyName?: string;
  description?: string;
  price?: number | string;
  surface?: number | string;
  surfaceMin?: number | string;
  surfaceMax?: number | string;
  status?: ProjectStatusType | string;
  projectStatus?: ProjectStatusType | string;
  type?: string;
  sousType?: string;
  category?: string | { name?: string; title?: string };
  state?: string;
  wilaya?: string;
  city?: string;
  address?: string;
  adress?: string;
  country?: string;
  latitude?: string | number;
  longitude?: string | number;
  isPublished?: boolean;
  vues?: number;
  nombre_logements?: number;
  nombre_locaux?: number;
  financementPrix?: number;
  financementType?: string;
  mainImage?: string | PropertyImageItem;
  planImage?: string | PropertyImageItem;
  images?: (string | PropertyImageItem)[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
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
  };
  properties?: any[];
  ilots?: any[];
  amenities?: any[];
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isPublished?: boolean;
  city?: string;
  state?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | "ASC" | "DESC";
}

export interface CreateProjectPayload {
  title: string;
  projectStatus?: ProjectStatusType | string;
  status?: ProjectStatusType | string;
  price?: number;
  surface?: number | string;
  surfaceMin?: number;
  surfaceMax?: number;
  category?: string;
  type?: string;
  sousType?: string;
  state?: string;
  wilaya?: string;
  city?: string;
  address?: string;
  adress?: string;
  description?: string;
  isPublished?: boolean;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

/**
 * Fetch paginated projects from backend admin endpoint: GET /admin/projects
 */
export async function getProjects(
  params?: ProjectQueryParams
): Promise<PaginatedResult<Project>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  try {
    const response = await api.get<any>("/admin/projects", {
      params: {
        page,
        limit,
        search: params?.search || undefined,
        status: params?.status && params.status !== "all" ? params.status : undefined,
        isPublished: params?.isPublished,
        city: params?.city,
        state: params?.state,
        userId: params?.userId,
        startDate: params?.startDate,
        endDate: params?.endDate,
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
    console.error("Error fetching projects from /admin/projects:", error);
    throw error;
  }
}

/**
 * Fetch a single project by ID via GET /admin/projects/{id}
 */
export async function getProjectById(id: string | number): Promise<Project> {
  try {
    const response = await api.get<Project>(`/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${id} via /admin/projects/${id}:`, error);
    throw error;
  }
}

/**
 * Create a new project via POST /projects
 */
export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  try {
    const response = await api.post<Project>("/projects", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

/**
 * Update project by ID via PATCH /admin/projects/{id}
 */
export async function updateProject(
  id: string | number,
  payload: UpdateProjectPayload
): Promise<Project> {
  try {
    const response = await api.patch<Project>(`/admin/projects/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
}

/**
 * Toggle project publish status via PATCH /admin/projects/{id}/toggle-publish
 */
export async function togglePublishProject(
  id: string | number,
  isPublished?: boolean
): Promise<{ message: string; isPublished: boolean }> {
  try {
    const response = await api.patch(`/admin/projects/${id}/toggle-publish`, {
      isPublished,
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling publish status for project ${id}:`, error);
    throw error;
  }
}

/**
 * Delete project by ID via DELETE /admin/projects/{id}
 */
export async function deleteProject(id: string | number): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
}

/**
 * Execute bulk action on projects (publish, unpublish, delete) via POST /admin/projects/bulk
 */
export async function bulkProjectAction(
  dto: AdminBulkActionDto
): Promise<{ message: string; affected: number }> {
  try {
    const response = await api.post("/admin/projects/bulk", dto);
    return response.data;
  } catch (error) {
    console.error("Error executing bulk project action:", error);
    throw error;
  }
}

/**
 * Upload images to project by ID via POST /r2/{id}/multiple/upload-images
 */
export async function uploadProjectImages(
  id: string | number,
  formData: FormData
): Promise<any> {
  try {
    const response = await api.post(`/r2/${id}/multiple/upload-images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading images for project ${id}:`, error);
    throw error;
  }
}

/**
 * Delete image by ID via DELETE /projects/{imageId}/images
 */
export async function deleteProjectImage(imageId: string | number): Promise<void> {
  try {
    await api.delete(`/projects/${imageId}/images`);
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    throw error;
  }
}

/**
 * Update main image via PATCH /projects/{projectId}/update-main-image
 */
export async function updateProjectMainImage(
  projectId: string | number,
  imageId: string | number
): Promise<any> {
  try {
    const response = await api.patch(`/projects/${projectId}/update-main-image`, {
      imageId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error setting main image for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Update plan image via PATCH /projects/{projectId}/update-plan-image
 */
export async function updateProjectPlanImage(
  projectId: string | number,
  imageId: string | number
): Promise<any> {
  try {
    const response = await api.patch(`/projects/${projectId}/update-plan-image`, {
      imageId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error setting plan image for project ${projectId}:`, error);
    throw error;
  }
}
