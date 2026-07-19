"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  Project,
} from "@/services/projects/projects.service";
import { ProjectFormData } from "../schemas/project.schema";
import { ProjectsHeader } from "./projects-header";
import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsStats } from "./projects-stats";
import { ProjectsTable } from "./projects-table";
import { ProjectsEmptyState } from "./projects-empty-state";
import { ProjectsLoading } from "./projects-loading";
import { ProjectDialog } from "./project-dialog";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";
import {
  calculateProjectStats,
  filterProjects,
} from "@/features/projects/utils/projects-utils";

export const ProjectsPageView: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProjects({ limit: 50 });
      setData(result || []);
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
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStatus]);

  // Client-side filtering & search
  const filteredData = useMemo(() => {
    return filterProjects(data, searchQuery, selectedStatus);
  }, [data, searchQuery, selectedStatus]);

  // Paginated Sliced Data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

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
        price: formData.price !== "" && formData.price !== undefined ? Number(formData.price) : undefined,
        surface: formData.surface !== "" && formData.surface !== undefined ? Number(formData.surface) : undefined,
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
        (Array.isArray(err?.response?.data?.message) ? err.response.data.message.join(", ") : null) ||
        err?.message ||
        "Failed to save project. Please try again.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const toastId = toast.loading("Deleting project...");
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully!", { id: toastId });
      await fetchProjects();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project.", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with "+ Add Project" button */}
      <ProjectsHeader onAddProject={handleOpenAddModal} />

      {/* Stats Cards */}
      <ProjectsStats stats={stats} />

      {/* Filter Toolbar */}
      <ProjectsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Content State: Loading, Error, Empty, or Table */}
      {loading ? (
        <ProjectsLoading />
      ) : error ? (
        <div className="flex flex-col items-center justify-center bg-card border border-border/80 p-8 rounded-xl text-center shadow-xs">
          <p className="text-sm text-destructive font-semibold mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-md transition-colors cursor-pointer"
          >
            Retry Request
          </button>
        </div>
      ) : filteredData.length === 0 ? (
        <ProjectsEmptyState
          searchQuery={searchQuery}
          onReset={() => {
            setSearchQuery("");
            setSelectedStatus("all");
          }}
        />
      ) : (
        <div className="space-y-4">
          <ProjectsTable
            projects={paginatedData}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProject}
          />

          {/* Pagination Controls */}
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredData.length}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}

      {/* Create / Edit Project Modal Dialog */}
      <ProjectDialog
        isOpen={isDialogOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
        editingProject={editingProject}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
