"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { User, UserRole, UserStatus } from "../types/user";
import { UserFormData } from "../schemas/user.schema";
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "@/services/users/users.service";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const fetchUsersList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUsers({
        page,
        limit: pageSize,
        search: debouncedSearchQuery.trim() || undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        sortBy: sortField || undefined,
        sortOrder,
      });

      setUsers(result.data || []);
      setTotalItems(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch users list from server."
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearchQuery, selectedRole, selectedStatus, sortField, sortOrder]);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedRole, selectedStatus]);

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData: UserFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      editingUser ? "Updating user profile..." : "Creating new user..."
    );

    try {
      if (editingUser) {
        const targetId = editingUser.id || editingUser._id || "";
        await updateUser(targetId, formData);
        toast.success("User updated successfully!", { id: toastId });
      } else {
        await createUser(formData);
        toast.success("User created successfully!", { id: toastId });
      }

      handleCloseModal();
      await fetchUsersList();
    } catch (err: any) {
      console.error("Error saving user:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save user details. Please try again.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Activate / Suspend status
  const handleToggleStatus = async (user: User) => {
    const targetId = user.id || user._id || "";
    const newStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    const actionText = newStatus === "active" ? "activating" : "suspending";
    const toastId = toast.loading(`User status ${actionText}...`);

    try {
      await toggleUserStatus(targetId, newStatus);
      toast.success(
        `User successfully ${newStatus === "active" ? "activated" : "suspended"}!`,
        { id: toastId }
      );
      await fetchUsersList();
    } catch (err: any) {
      console.error(`Failed to update status for user ${targetId}:`, err);
      toast.error("Failed to update user status.", { id: toastId });
    }
  };

  // Delete user handler
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const toastId = toast.loading("Deleting user...");
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!", { id: toastId });
      await fetchUsersList();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.", { id: toastId });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setPage(1);
  };

  // Compute local KPI stats breakdown
  const stats = useMemo(() => {
    const total = totalItems || users.length;
    const activeCount = users.filter((u) => u.status === "active").length;
    const suspendedCount = users.filter((u) => u.status === "suspended").length;
    const regularCount = users.filter((u) => u.role === "regular").length;
    const agencyCount = users.filter((u) => u.role === "agence").length;
    const promoterCount = users.filter((u) => u.role === "promoter").length;
    const adminCount = users.filter((u) => u.role === "admin").length;

    return {
      total,
      activeCount,
      suspendedCount,
      regularCount,
      agencyCount,
      promoterCount,
      adminCount,
    };
  }, [totalItems, users]);

  return {
    users,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    sortField,
    sortOrder,
    handleSort,
    clearFilters,
    fetchUsersList,
    stats,
    // Modal & Action handlers
    isDialogOpen,
    editingUser,
    isSubmitting,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveUser,
    handleToggleStatus,
    handleDeleteUser,
  };
}
