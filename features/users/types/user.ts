export type UserRole = "regular" | "agence" | "promoter" | "admin" | "unknown" | string;
export type UserStatus = "active" | "suspended" | "pending" | string;

export interface UserProfile {
  id?: number;
  raison_social?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  about?: string;
  certify?: boolean;
  image?: string | null;
}

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  phoneNumber?: string;
  fax?: string;
  email: string;
  emailVerified?: boolean;
  googleId?: string | null;
  appleId?: string | null;
  role: UserRole;
  status?: UserStatus;
  createdAt: string;
  updatedAt?: string;
  profile?: UserProfile;
  projects?: any[];
  properties?: any[];
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
  certify?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | "ASC" | "DESC";
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
