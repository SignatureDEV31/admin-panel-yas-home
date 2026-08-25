"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  togglePublishProject,
  bulkProjectAction,
  Project,
} from "@/services/projects/projects.service";
import { exportData } from "@/services/admin/admin.service";
import { AdminBulkActionType, ExportFormat, ExportResource } from "@/services/types/admin.types";
import { ProjectFormData } from "../schemas/project.schema";
import { calculateProjectStats } from "@/features/projects/utils/projects-utils";

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
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
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPublish, setSelectedPublish] = useState<string>("all");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Bulk Actions State
  const [selectedProjectIds, setSelectedProjectIds] = useState<(string | number)[]>([]);
  const [isBulkActing, setIsBulkActing] = useState(false);

  // Modal Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search query
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

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProjects({
        page,
        limit: pageSize,
        search: debouncedSearchQuery.trim() || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        isPublished:
          selectedPublish === "published"
            ? true
            : selectedPublish === "unpublished"
            ? false
            : undefined,
        sortBy: sortField || "createdAt",
        sortOrder: sortOrder.toUpperCase() as "ASC" | "DESC",
      });

      setData(result.data || []);
      setTotalItems(result.meta?.totalItems || result.data.length || 0);
      setTotalPages(result.meta?.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to load projects:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch real-estate projects from server."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    debouncedSearchQuery,
    selectedStatus,
    selectedPublish,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStatus, selectedPublish]);

  // Stats calculation
  const stats = useMemo(() => {
    return calculateProjectStats(data);
  }, [data]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  const handleSubmitProject = async (formData: ProjectFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      editingProject ? "Updating project..." : "Creating project..."
    );

    try {
      const payload = {
        title: formData.title.trim(),
        projectStatus: formData.projectStatus,
        price:
          formData.price !== "" && formData.price !== undefined
            ? Number(formData.price)
            : undefined,
        surface:
          formData.surface !== "" && formData.surface !== undefined
            ? Number(formData.surface)
            : undefined,
        category: formData.category?.trim() || undefined,
        state: formData.state?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        description: formData.description?.trim() || undefined,
      };

      if (editingProject) {
        await updateProject(String(editingProject.id || editingProject._id), payload);
        toast.success("Project updated successfully!", { id: toastId });
      } else {
        await createProject(payload as any);
        toast.success("Project created successfully!", { id: toastId });
      }

      handleCloseModal();
      await fetchProjects();
    } catch (err: any) {
      console.error("Error saving project:", err);
      const errMsg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(", ")
          : null) ||
        err?.message ||
        "Failed to save project. Please try again.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (project: Project) => {
    const projId = project.id || project._id || "";
    const newPublish = !project.isPublished;
    const toastId = toast.loading(
      newPublish ? "Publishing project..." : "Unpublishing project..."
    );

    try {
      await togglePublishProject(projId, newPublish);
      toast.success(
        `Project ${newPublish ? "published" : "unpublished"} successfully!`,
        { id: toastId }
      );
      await fetchProjects();
    } catch (err: any) {
      console.error(`Failed to toggle publish status for project ${projId}:`, err);
      toast.error("Failed to update project publish status.", { id: toastId });
    }
  };

  const handleDeleteProject = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting project...");
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully!", { id: toastId });
      setSelectedProjectIds((prev) => prev.filter((i) => String(i) !== String(id)));
      await fetchProjects();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project.", { id: toastId });
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((p) => p.id || p._id || "").filter(Boolean);
      setSelectedProjectIds(allIds);
    } else {
      setSelectedProjectIds([]);
    }
  };

  const handleSelectProject = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedProjectIds((prev) => [...prev, id]);
    } else {
      setSelectedProjectIds((prev) => prev.filter((i) => String(i) !== String(id)));
    }
  };

  // Bulk action handler
  const handleBulkAction = async (action: AdminBulkActionType) => {
    if (!selectedProjectIds.length) return;
    if (action === AdminBulkActionType.DELETE) {
      if (!window.confirm(`Are you sure you want to delete ${selectedProjectIds.length} projects?`)) return;
    }

    setIsBulkActing(true);
    const toastId = toast.loading(`Executing bulk action on ${selectedProjectIds.length} projects...`);

    try {
      await bulkProjectAction({
        ids: selectedProjectIds,
        action,
      });
      toast.success(`Bulk action completed successfully!`, { id: toastId });
      setSelectedProjectIds([]);
      await fetchProjects();
    } catch (err: any) {
      console.error("Bulk action failed:", err);
      toast.error("Failed to complete bulk action.", { id: toastId });
    } finally {
      setIsBulkActing(false);
    }
  };

  // Export dataset
  const handleExport = async (format: ExportFormat = ExportFormat.CSV) => {
    const toastId = toast.loading(`Exporting projects as ${format.toUpperCase()}...`);
    try {
      await exportData(ExportResource.PROJECTS, format);
      toast.success(`Projects export downloaded!`, { id: toastId });
    } catch (err: any) {
      console.error("Export failed:", err);
      toast.error("Failed to export projects.", { id: toastId });
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedPublish("all");
    setPage(1);
  };

  return {
    data,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    stats,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedPublish,
    setSelectedPublish,
    sortField,
    sortOrder,
    handleSort,
    resetFilters,
    fetchProjects,
    // Selection & Bulk Actions
    selectedProjectIds,
    isBulkActing,
    handleSelectAll,
    handleSelectProject,
    handleBulkAction,
    handleExport,
    // Modal states and handlers
    isDialogOpen,
    editingProject,
    isSubmitting,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmitProject,
    handleTogglePublish,
    handleDeleteProject,
  };
}
