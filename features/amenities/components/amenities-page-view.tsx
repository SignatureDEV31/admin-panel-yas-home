"use client";

import React from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useAmenities } from "../hooks/use-amenities";

// UI Components
import { AmenitiesHeader } from "./amenities-header";
import { AmenitiesStats } from "./amenities-stats";
import { AmenitiesToolbar } from "./amenities-toolbar";
import { AmenitiesTable } from "./amenities-table";
import { AmenitiesEmptyState } from "./amenities-empty-state";
import { AmenitiesLoading } from "./amenities-loading";
import { AmenitiesError } from "./amenities-error";
import { AmenityDialog } from "./amenity-dialog";
import { AmenityForm } from "./amenity-form";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";

export function AmenitiesPageView() {
  const isMounted = useMounted();
  const {
    locale,
    data,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories,
    filteredAndSortedData,
    totalFilteredCount,
    totalPages,
    paginatedAmenities,
    existingKeys,
    isDrawerOpen,
    setIsDrawerOpen,
    isSubmitting,
    fetchAmenities,
    handleCreateAmenity,
    clearFilters,
  } = useAmenities();

  if (loading) {
    return (
      <div className="space-y-6">
        <AmenitiesHeader onAddClick={() => setIsDrawerOpen(true)} />
        <AmenitiesLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AmenitiesHeader onAddClick={() => setIsDrawerOpen(true)} />
        <AmenitiesError description={error} onRetry={fetchAmenities} />
      </div>
    );
  }

  const hasData = data && data.length > 0;
  const hasSearchResults = filteredAndSortedData.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <AmenitiesHeader onAddClick={() => setIsDrawerOpen(true)} />

      {/* Summary KPI Stats */}
      {isMounted && <AmenitiesStats amenities={data || []} />}

      {/* Search Toolbar */}
      <AmenitiesToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        resultsCount={filteredAndSortedData.length}
      />

      {/* Table List Section */}
      {!hasData ? (
        <AmenitiesEmptyState type="all" onAddClick={() => setIsDrawerOpen(true)} />
      ) : !hasSearchResults ? (
        <AmenitiesEmptyState
          type="filtered"
          onClearFilters={clearFilters}
        />
      ) : (
        isMounted && (
          <div className="space-y-4">
            <AmenitiesTable
              amenities={paginatedAmenities}
              locale={locale}
            />

            <PaginationControl
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalFilteredCount}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
            />
          </div>
        )
      )}

      {/* Add Amenity Dialog Popup */}
      <AmenityDialog
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <AmenityForm
          onSubmit={handleCreateAmenity}
          isSubmitting={isSubmitting}
          existingKeys={existingKeys}
          existingCategories={categories}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </AmenityDialog>
    </div>
  );
}
