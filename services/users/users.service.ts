import { api } from "@/lib/axios";
import { User, UserQueryParams, PaginatedUsersResponse } from "@/features/users/types/user";

// Initial mock dataset matching user schema
const INITIAL_MOCK_USERS: User[] = [
  {
    id: "usr-1",
    _id: "668aa12b4f1234567890abc1",
    fullName: "imad lallali",
    phoneNumber: "+966509793578",
    email: "imadlallali101@gmail.com",
    emailVerified: true,
    googleId: null,
    appleId: null,
    role: "regular",
    status: "active",
    createdAt: "2026-07-07T13:49:46.165Z",
  },
  {
    id: "usr-2",
    _id: "668aa12b4f1234567890abc2",
    fullName: "Amine Belkacem",
    phoneNumber: "+213555123456",
    email: "amine.belkacem@yashome.dz",
    emailVerified: true,
    googleId: "google-10928374",
    appleId: null,
    role: "admin",
    status: "active",
    createdAt: "2026-06-15T09:12:00.000Z",
  },
  {
    id: "usr-3",
    _id: "668aa12b4f1234567890abc3",
    fullName: "Yassine Promoter Group",
    phoneNumber: "+213770987654",
    email: "contact@yassine-promoter.dz",
    emailVerified: true,
    googleId: null,
    appleId: null,
    role: "promoter",
    status: "active",
    createdAt: "2026-06-20T14:30:10.000Z",
  },
  {
    id: "usr-4",
    _id: "668aa12b4f1234567890abc4",
    fullName: "Agence Immobiliere El-Bahi",
    phoneNumber: "+21321456789",
    email: "info@elbahi-immo.dz",
    emailVerified: false,
    googleId: null,
    appleId: null,
    role: "agence",
    status: "suspended",
    createdAt: "2026-05-10T11:05:44.000Z",
  },
  {
    id: "usr-5",
    _id: "668aa12b4f1234567890abc5",
    fullName: "Karim Zerrouki",
    phoneNumber: "+213661112233",
    email: "karim.zerrouki@gmail.com",
    emailVerified: true,
    googleId: null,
    appleId: "apple-987123",
    role: "regular",
    status: "active",
    createdAt: "2026-07-01T08:22:15.000Z",
  },
];

let mockUsersMemoryState = [...INITIAL_MOCK_USERS];

/**
 * Fetch paginated users via GET /users
 */
export async function getUsers(params?: UserQueryParams): Promise<PaginatedUsersResponse> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  try {
    const response = await api.get<any>("/users", { params });
    const data = response.data;
    if (data && Array.isArray(data.data)) {
      return {
        data: data.data,
        total: data.total || data.data.length,
        page: data.page || page,
        limit: data.limit || limit,
        totalPages: data.totalPages || Math.ceil((data.total || data.data.length) / limit),
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
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn("GET /users endpoint not yet available, serving mock dataset:", error?.message);
  }

  // Filter in mock state
  let filtered = [...mockUsersMemoryState];
  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phoneNumber && u.phoneNumber.includes(q))
    );
  }
  if (params?.role && params.role !== "all") {
    filtered = filtered.filter((u) => u.role === params.role);
  }
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);

  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Create user via POST /users
 */
export async function createUser(payload: Partial<User>): Promise<User> {
  try {
    const response = await api.post<User>("/users", payload);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn("POST /users endpoint unavailable, creating user in mock state.");
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    _id: `668aa12b${Date.now()}`,
    fullName: payload.fullName || "User",
    phoneNumber: payload.phoneNumber || "",
    email: payload.email || "",
    emailVerified: payload.emailVerified ?? false,
    googleId: payload.googleId || null,
    appleId: payload.appleId || null,
    role: payload.role || "regular",
    status: payload.status || "active",
    createdAt: new Date().toISOString(),
  };

  mockUsersMemoryState.unshift(newUser);
  return newUser;
}

/**
 * Update user via PATCH /users/{id}
 */
export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  try {
    const response = await api.patch<User>(`/users/${id}`, payload);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn(`PATCH /users/${id} unavailable, updating user in mock state.`);
  }

  const index = mockUsersMemoryState.findIndex((u) => u.id === id || u._id === id);
  if (index !== -1) {
    mockUsersMemoryState[index] = {
      ...mockUsersMemoryState[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return mockUsersMemoryState[index];
  }

  throw new Error(`User with ID ${id} not found.`);
}

/**
 * Toggle user status (Activate / Suspend) via PATCH /users/{id}/status
 */
export async function toggleUserStatus(id: string, newStatus: string): Promise<User> {
  try {
    const response = await api.patch<User>(`/users/${id}/status`, { status: newStatus });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn(`PATCH /users/${id}/status unavailable, updating status in mock state.`);
  }

  return updateUser(id, { status: newStatus });
}

/**
 * Delete user via DELETE /users/{id}
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
    return;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      throw error;
    }
    console.warn(`DELETE /users/${id} unavailable, removing user from mock state.`);
  }

  mockUsersMemoryState = mockUsersMemoryState.filter((u) => u.id !== id && u._id !== id);
}
