"use client";

import React from "react";
import { useProjects } from "../hooks/use-projects";
import { ProjectsHeader } from "./projects-header";
import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsStats } from "./projects-stats";
import { ProjectsTable } from "./projects-table";
import { ProjectsEmptyState } from "./projects-empty-state";
import { ProjectsLoading } from "./projects-loading";
import { ProjectDialog } from "./project-dialog";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";

export const ProjectsPageView: React.FC = () => {
  const {
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    filteredData,
    paginatedData,
    totalPages,
    stats,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    sortField,
    sortOrder,
    handleSort,
    resetFilters,
    fetchProjects,
    isDialogOpen,
    editingProject,
    isSubmitting,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmitProject,
    handleDeleteProject,
  } = useProjects();

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
          onReset={resetFilters}
        />
      ) : (
        <div className="space-y-4">
          <ProjectsTable
            projects={paginatedData}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProject}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
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
