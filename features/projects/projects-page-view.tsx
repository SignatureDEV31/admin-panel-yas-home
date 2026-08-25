"use client";

import React from "react";
import { useProjects } from "./hooks/use-projects";
import { ProjectsHeader } from "./components/projects-header";
import { ProjectsToolbar } from "./components/projects-toolbar";
import { ProjectsStats } from "./components/projects-stats";
import { ProjectsTable } from "./components/projects-table";
import { ProjectsEmptyState } from "./components/projects-empty-state";
import { ProjectsLoading } from "./components/projects-loading";
import { ProjectDialog } from "./components/project-dialog";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";

export const ProjectsPageView: React.FC = () => {
  const {
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
    selectedProjectIds,
    isBulkActing,
    handleSelectAll,
    handleSelectProject,
    handleBulkAction,
    handleExport,
    isDialogOpen,
    editingProject,
    isSubmitting,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmitProject,
    handleTogglePublish,
    handleDeleteProject,
  } = useProjects();

  const isFiltered =
    searchQuery !== "" || selectedStatus !== "all" || selectedPublish !== "all";

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
        selectedPublish={selectedPublish}
        setSelectedPublish={setSelectedPublish}
        resultsCount={totalItems}
        onResetFilters={resetFilters}
        onExport={handleExport}
      />

      {/* Content State: Loading, Error, Empty, or Table */}
      {loading && !data.length ? (
        <ProjectsLoading />
      ) : error && !data.length ? (
        <div className="flex flex-col items-center justify-center bg-card border border-border/80 p-8 rounded-xl text-center shadow-xs">
          <p className="text-sm text-destructive font-semibold mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-md transition-colors cursor-pointer"
          >
            Retry Request
          </button>
        </div>
      ) : data.length === 0 && isFiltered ? (
        <ProjectsEmptyState searchQuery={searchQuery} onReset={resetFilters} />
      ) : data.length === 0 ? (
        <ProjectsEmptyState searchQuery={searchQuery} onReset={resetFilters} />
      ) : (
        <div className="space-y-4">
          <ProjectsTable
            projects={data}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProject}
            onTogglePublish={handleTogglePublish}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedIds={selectedProjectIds}
            onSelectAll={handleSelectAll}
            onSelectProject={handleSelectProject}
            onBulkAction={handleBulkAction}
            isBulkActing={isBulkActing}
          />

          {/* Pagination Controls */}
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
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
