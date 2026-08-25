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
  toggleUserCertification,
  bulkUserAction,
} from "@/services/users/users.service";
import { exportData } from "@/services/admin/admin.service";
import { AdminBulkActionType, ExportFormat, ExportResource } from "@/services/types/admin.types";

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
  const [selectedCertify, setSelectedCertify] = useState<string>("all");
  const [selectedVerified, setSelectedVerified] = useState<string>("all");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Bulk Actions State
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkActing, setIsBulkActing] = useState(false);

  // Modal Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
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
        certify:
          selectedCertify === "certified"
            ? true
            : selectedCertify === "uncertified"
            ? false
            : undefined,
        emailVerified:
          selectedVerified === "verified"
            ? true
            : selectedVerified === "unverified"
            ? false
            : undefined,
        sortBy: sortField || "createdAt",
        sortOrder: sortOrder.toUpperCase() as "ASC" | "DESC",
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
  }, [
    page,
    pageSize,
    debouncedSearchQuery,
    selectedRole,
    selectedStatus,
    selectedCertify,
    selectedVerified,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);



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

  // Toggle Certification status
  const handleToggleCertification = async (user: User) => {
    const targetId = user.id || user._id || "";
    const currentCert = !!user.profile?.certify;
    const toastId = toast.loading(
      currentCert ? "Revoking certification..." : "Certifying profile..."
    );

    try {
      await toggleUserCertification(targetId, !currentCert);
      toast.success(
        `Profile certification ${!currentCert ? "granted" : "revoked"} successfully!`,
        { id: toastId }
      );
      await fetchUsersList();
    } catch (err: any) {
      console.error(`Failed to toggle certification for user ${targetId}:`, err);
      toast.error("Failed to update certification status.", { id: toastId });
    }
  };

  // Delete user handler
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting user...");
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!", { id: toastId });
      setSelectedUserIds((prev) => prev.filter((i) => i !== id));
      await fetchUsersList();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.", { id: toastId });
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = users.map((u) => u.id || u._id || "").filter(Boolean);
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, id]);
    } else {
      setSelectedUserIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Bulk Action Execution
  const handleBulkAction = async (action: AdminBulkActionType, value?: string) => {
    if (!selectedUserIds.length) return;
    if (action === AdminBulkActionType.DELETE) {
      if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.length} users?`)) return;
    }

    setIsBulkActing(true);
    const toastId = toast.loading(`Executing bulk action on ${selectedUserIds.length} users...`);

    try {
      await bulkUserAction({
        ids: selectedUserIds,
        action,
        value,
      });
      toast.success(`Bulk action completed successfully!`, { id: toastId });
      setSelectedUserIds([]);
      await fetchUsersList();
    } catch (err: any) {
      console.error("Bulk action failed:", err);
      toast.error("Failed to complete bulk action.", { id: toastId });
    } finally {
      setIsBulkActing(false);
    }
  };

  // Export dataset
  const handleExport = async (format: ExportFormat = ExportFormat.CSV) => {
    const toastId = toast.loading(`Exporting users data as ${format.toUpperCase()}...`);
    try {
      await exportData(ExportResource.USERS, format);
      toast.success(`Users data export downloaded!`, { id: toastId });
    } catch (err: any) {
      console.error("Export failed:", err);
      toast.error("Failed to export users data.", { id: toastId });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setSelectedCertify("all");
    setSelectedVerified("all");
    setPage(1);
  };

  // Compute local KPI stats breakdown
  const stats = useMemo(() => {
    const total = totalItems || users.length;
    const activeCount = users.filter((u) => u.status === "active").length;
    const regularCount = users.filter((u) => u.role === "regular").length;
    const agencyCount = users.filter((u) => u.role === "agence").length;
    const promoterCount = users.filter((u) => u.role === "promoter").length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    const certifiedCount = users.filter((u) => !!u.profile?.certify).length;

    return {
      total,
      activeCount,
      regularCount,
      agencyCount,
      promoterCount,
      adminCount,
      certifiedCount,
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
    setSelectedRole: (val: string) => { setSelectedRole(val); setPage(1); },
    selectedStatus,
    setSelectedStatus: (val: string) => { setSelectedStatus(val); setPage(1); },
    selectedCertify,
    setSelectedCertify: (val: string) => { setSelectedCertify(val); setPage(1); },
    selectedVerified,
    setSelectedVerified: (val: string) => { setSelectedVerified(val); setPage(1); },
    sortField,
    sortOrder,
    handleSort,
    clearFilters,
    fetchUsersList,
    stats,
    // Selection & Bulk Actions
    selectedUserIds,
    isBulkActing,
    handleSelectAll,
    handleSelectUser,
    handleBulkAction,
    handleExport,
    // Modal & Action handlers
    isDialogOpen,
    editingUser,
    isSubmitting,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveUser,
    handleToggleStatus,
    handleToggleCertification,
    handleDeleteUser,
  };
}
