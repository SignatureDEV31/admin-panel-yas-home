import { api } from "@/lib/axios";
import {
  User,
  UserQueryParams,
  PaginatedUsersResponse,
} from "@/features/users/types/user";
import { AdminBulkActionDto } from "../types/admin.types";

/**
 * Fetch paginated users from backend admin endpoint: GET /admin/users
 */
export async function getUsers(
  params?: UserQueryParams
): Promise<PaginatedUsersResponse> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  try {
    const response = await api.get<any>("/admin/users", {
      params: {
        page,
        limit,
        search: params?.search || undefined,
        role: params?.role && params.role !== "all" ? params.role : undefined,
        status: params?.status && params.status !== "all" ? params.status : undefined,
        emailVerified: params?.emailVerified,
        certify: params?.certify,
        startDate: params?.startDate,
        endDate: params?.endDate,
        sortBy: params?.sortBy || "createdAt",
        sortOrder: params?.sortOrder ? params.sortOrder.toUpperCase() : "DESC",
      },
    });

    const data = response.data;

    // Handle standard backend structure: { data: User[], meta: { totalItems, totalPages, currentPage, itemsPerPage } }
    if (data && Array.isArray(data.data) && data.meta) {
      return {
        data: data.data,
        total: data.meta.totalItems,
        page: data.meta.currentPage,
        limit: data.meta.itemsPerPage,
        totalPages: data.meta.totalPages,
      };
    }

    if (data && Array.isArray(data.data)) {
      return {
        data: data.data,
        total: data.total || data.data.length,
        page: data.page || page,
        limit: data.limit || limit,
        totalPages:
          data.totalPages || Math.ceil((data.total || data.data.length) / limit),
      };
    }

    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }

    return {
      data: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 1,
    };
  } catch (error: any) {
    console.error("Error fetching users via /admin/users:", error);
    throw error;
  }
}

/**
 * Get user by ID via GET /admin/users/{id}
 */
export async function getUserById(id: string): Promise<User> {
  try {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new user via POST /admin/users
 */
export async function createUser(payload: Partial<User> & { password?: string }): Promise<User> {
  try {
    const response = await api.post<User>("/admin/users", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating user via /admin/users:", error);
    throw error;
  }
}

/**
 * Update an existing user via PATCH /admin/users/{id}
 */
export async function updateUser(
  id: string,
  payload: Partial<User> & { password?: string }
): Promise<User> {
  try {
    const response = await api.patch<User>(`/admin/users/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id} via /admin/users/${id}:`, error);
    throw error;
  }
}

/**
 * Toggle user certification status via PATCH /admin/users/{id}/toggle-certify
 */
export async function toggleUserCertification(
  id: string,
  certify?: boolean
): Promise<{ message: string; certified: boolean }> {
  try {
    const response = await api.patch(`/admin/users/${id}/toggle-certify`, {
      certify,
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling certification for user ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a user by ID via DELETE /admin/users/{id}
 */
export async function deleteUser(id: string): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id} via /admin/users/${id}:`, error);
    throw error;
  }
}

/**
 * Execute bulk action on users (delete, certify, uncertify, change_role, verify_email) via POST /admin/users/bulk
 */
export async function bulkUserAction(
  dto: AdminBulkActionDto
): Promise<{ message: string; affected: number }> {
  try {
    const response = await api.post("/admin/users/bulk", dto);
    return response.data;
  } catch (error) {
    console.error("Error executing bulk user action:", error);
    throw error;
  }
}

/**
 * Helper to toggle user status (or update role/profile)
 */
export async function toggleUserStatus(
  id: string,
  newStatus: string
): Promise<User> {
  return updateUser(id, { status: newStatus });
}
