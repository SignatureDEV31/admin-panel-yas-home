"use client";

import React from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useProperties } from "../hooks/use-properties";

import { PropertiesHeader } from "./properties-header";
import { PropertiesStats } from "./properties-stats";
import { PropertiesToolbar } from "./properties-toolbar";
import { PropertiesTable } from "./properties-table";
import { PropertiesLoading } from "./properties-loading";
import { PropertiesError } from "./properties-error";
import { PropertiesEmptyState } from "./properties-empty-state";
import { PropertyDialog } from "./property-dialog";
import { PropertyForm } from "./property-form";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";

export function PropertiesPageView() {
  const isMounted = useMounted();
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
    searchQuery,
    selectedType,
    selectedPricingType,
    setSelectedPricingType,
    selectedAvailability,
    setSelectedAvailability,
    showOnlyDeleted,
    setShowOnlyDeleted,
    sortField,
    sortOrder,
    handleSort,
    handleTypeChange,
    handleSearchChange,
    clearFilters,
    fetchAllProperties,
    selectedPropertyIds,
    isBulkActing,
    handleSelectAll,
    handleSelectProperty,
    handleBulkAction,
    handleExport,
    isDialogOpen,
    editingProperty,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseDialog,
    handleFormSubmit,
    handleDeleteProperty,
    handleRestoreProperty,
    handleToggleAvailability,
  } = useProperties();

  if (loading && !data.length) {
    return (
      <div className="space-y-6">
        <PropertiesHeader onAddClick={handleOpenAdd} />
        <PropertiesLoading />
      </div>
    );
  }

  if (error && !data.length) {
    return (
      <div className="space-y-6">
        <PropertiesHeader onAddClick={handleOpenAdd} />
        <PropertiesError description={error} onRetry={fetchAllProperties} />
      </div>
    );
  }

  const isFiltered =
    searchQuery !== "" ||
    selectedType !== "all" ||
    selectedPricingType !== "all" ||
    selectedAvailability !== "all" ||
    showOnlyDeleted;
  const hasData = data && data.length > 0;

  return (
    <div className="space-y-6">
      <PropertiesHeader onAddClick={handleOpenAdd} />

      {isMounted && (
        <PropertiesStats
          properties={data || []}
          totalCount={totalItems}
        />
      )}

      <PropertiesToolbar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        selectedType={selectedType}
        setSelectedType={handleTypeChange}
        selectedPricingType={selectedPricingType}
        setSelectedPricingType={setSelectedPricingType}
        selectedAvailability={selectedAvailability}
        setSelectedAvailability={setSelectedAvailability}
        showOnlyDeleted={showOnlyDeleted}
        setShowOnlyDeleted={setShowOnlyDeleted}
        resultsCount={totalItems}
        onResetFilters={clearFilters}
        onExport={handleExport}
      />

      {!hasData && !isFiltered ? (
        <PropertiesEmptyState type="all" />
      ) : !hasData && isFiltered ? (
        <PropertiesEmptyState
          type="filtered"
          onClearFilters={clearFilters}
        />
      ) : (
        isMounted && (
          <div className="space-y-4">
            <PropertiesTable
              properties={data}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteProperty}
              onRestore={handleRestoreProperty}
              onToggleAvailability={handleToggleAvailability}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              selectedIds={selectedPropertyIds}
              onSelectAll={handleSelectAll}
              onSelectProperty={handleSelectProperty}
              onBulkAction={handleBulkAction}
              isBulkActing={isBulkActing}
            />

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

      {/* Create / Edit Dialog */}
      <PropertyDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingProperty ? "Edit Property" : "Add Property"}
        subtitle={
          editingProperty
            ? "Update real estate listing details"
            : "Create a new property listing entry"
        }
      >
        <PropertyForm
          initialData={editingProperty}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      </PropertyDialog>
    </div>
  );
}
