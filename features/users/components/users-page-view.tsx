"use client";

import React from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useUsers } from "../hooks/use-users";

import { UsersHeader } from "./users-header";
import { UsersStats } from "./users-stats";
import { UsersToolbar } from "./users-toolbar";
import { UsersTable } from "./users-table";
import { UsersLoading } from "./users-loading";
import { UsersEmptyState } from "./users-empty-state";
import { UserDialog } from "./user-dialog";
import { UserForm } from "./user-form";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";

export function UsersPageView() {
  const isMounted = useMounted();
  const {
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
    isDialogOpen,
    editingUser,
    isSubmitting,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveUser,
    handleToggleStatus,
    handleDeleteUser,
  } = useUsers();

  const isFiltered = searchQuery !== "" || selectedRole !== "all" || selectedStatus !== "all";
  const hasData = users && users.length > 0;

  if (loading && !users.length) {
    return <UsersLoading />;
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <UsersHeader onAddClick={handleOpenAddModal} />

      {/* Summary KPI Stats */}
      {isMounted && <UsersStats stats={stats} />}

      {/* Toolbar Filters */}
      <UsersToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        resultsCount={totalItems}
        onResetFilters={clearFilters}
      />

      {/* Main Content Area */}
      {error && !users.length ? (
        <div className="flex flex-col items-center justify-center bg-card border border-border/80 p-8 rounded-xl text-center shadow-xs">
          <p className="text-sm text-destructive font-semibold mb-4">{error}</p>
          <button
            onClick={fetchUsersList}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs rounded-md transition-colors cursor-pointer"
          >
            Retry Request
          </button>
        </div>
      ) : !hasData && !isFiltered ? (
        <UsersEmptyState type="all" onAddUser={handleOpenAddModal} />
      ) : !hasData && isFiltered ? (
        <UsersEmptyState type="filtered" onClearFilters={clearFilters} />
      ) : (
        isMounted && (
          <div className="space-y-4">
            <UsersTable
              users={users}
              onEdit={handleOpenEditModal}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteUser}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

            {/* Pagination Controls */}
            <PaginationControl
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        )
      )}

      {/* Add / Edit User Modal Dialog */}
      <UserDialog
        isOpen={isDialogOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit User Profile" : "Add New User"}
        subtitle={
          editingUser
            ? `Update details for user ${editingUser.fullName}`
            : "Create a new user account entry in the platform database"
        }
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleSaveUser}
          isSubmitting={isSubmitting}
          onCancel={handleCloseModal}
        />
      </UserDialog>
    </div>
  );
}
