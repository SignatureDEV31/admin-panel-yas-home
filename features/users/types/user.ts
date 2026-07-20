export type UserRole = "regular" | "agence" | "promoter" | "admin" | string;
export type UserStatus = "active" | "suspended" | "pending" | string;

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  phoneNumber?: string;
  email: string;
  emailVerified?: boolean;
  googleId?: string | null;
  appleId?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
