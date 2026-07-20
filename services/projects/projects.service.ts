import { api } from "@/lib/axios";
import { PropertyImageItem } from "@/services/properties/properties.service";

export type ProjectStatusType = "ANNOUNCEMENT" | "UNDER_CONSTRUCTION" | "FINISHED";

export interface Project {
  id: string;
  _id?: string;
  title?: string;
  propertyName?: string;
  description?: string;
  price?: number | string;
  surface?: number | string;
  status?: ProjectStatusType | string;
  projectStatus?: ProjectStatusType | string;
  category?: string | { name?: string; title?: string };
  state?: string;
  wilaya?: string;
  city?: string;
  address?: string;
  adress?: string;
  country?: string;
  latitude?: string | number;
  longitude?: string | number;
  mainImage?: string | PropertyImageItem;
  planImage?: string | PropertyImageItem;
  images?: (string | PropertyImageItem)[];
  typeVendeur?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

export interface CreateProjectPayload {
  title: string;
  projectStatus: ProjectStatusType | string;
  price?: number;
  surface?: number | string;
  category?: string;
  state?: string;
  wilaya?: string;
  city?: string;
  address?: string;
  description?: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

/**
 * Fetch all projects via GET /projects or GET /home/unified-search
 */
export async function getProjects(params?: Record<string, any>): Promise<Project[]> {
  try {
    const response = await api.get<any>("/projects", { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.items)) return data.items;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn("GET /projects failed, falling back to unified-search:", error);
  }

  // Fallback to unified search
  try {
    const response = await api.get<any>("/home/unified-search", {
      params: { searchIn: "projects", ...params },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  } catch (error) {
    console.error("Failed to fetch projects via unified-search:", error);
    throw error;
  }
}

/**
 * Fetch a single project by ID via GET /projects/{id}
 */
export async function getProjectById(id: string): Promise<Project> {
  try {
    const response = await api.get<any>(`/projects/${id}`);
    const resData = response.data;
    const item = resData?.project || resData?.data || resData;
    if (item) return item;
  } catch (error) {
    console.warn(`GET /projects/${id} failed:`, error);
  }

  // Search fallback
  const all = await getProjects();
  const match = all.find((p) => String(p.id) === String(id) || String(p._id) === String(id));
  if (match) return match;

  throw new Error(`Project with ID #${id} not found.`);
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
 * Update project by ID via PATCH /projects/{id}
 */
export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
  try {
    const response = await api.patch<Project>(`/projects/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
}

/**
 * Delete project by ID via DELETE /projects/{id}
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
}

/**
 * Upload images to project by ID via POST /projects/{id}/upload-images
 */
export async function uploadProjectImages(id: string, formData: FormData): Promise<any> {
  try {
    const response = await api.post(`/projects/${id}/upload-images`, formData, {
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
export async function deleteProjectImage(imageId: string): Promise<void> {
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
export async function updateProjectMainImage(projectId: string, imageId: string): Promise<any> {
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
export async function updateProjectPlanImage(projectId: string, imageId: string): Promise<any> {
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
