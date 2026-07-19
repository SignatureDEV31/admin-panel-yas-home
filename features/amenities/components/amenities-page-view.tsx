"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { getAmenities, createAmenity } from "@/services/amenities/amenities.service";
import { Amenity, CreateAmenityPayload } from "@/features/amenities/types/amenity";
import { useMounted } from "@/hooks/use-mounted";

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

import {
  computeAmenityCategories,
  filterAndSortAmenities,
} from "@/features/amenities/utils/amenities-utils";

export function AmenitiesPageView() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const isMounted = useMounted();

  // State Management
  const [data, setData] = useState<Amenity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch amenities
  const fetchAmenities = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAmenities();
      setData(result || []);
    } catch (err: any) {
      console.error("Error in amenities page loader:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch amenities list from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Compute Categories from returned data
  const categories = useMemo(() => {
    return computeAmenityCategories(data || []);
  }, [data]);

  // Handle Search, Filters, and Sorting
  const filteredAndSortedData = useMemo(() => {
    return filterAndSortAmenities(data || [], searchQuery, selectedCategory, sortBy);
  }, [data, searchQuery, selectedCategory, sortBy]);

  // Paginated View Slice
  const totalFilteredCount = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;

  const paginatedAmenities = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, page, pageSize]);

  // Handle Submission Creation Flow
  const handleCreateAmenity = async (payload: CreateAmenityPayload) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating amenity...");
    try {
      const newAmenity = await createAmenity(payload);

      setData((prev) => (prev ? [newAmenity, ...prev] : [newAmenity]));

      toast.success("Amenity created successfully!", { id: toastId });
      setIsDrawerOpen(false);
    } catch (err: any) {
      console.error("Failed to create amenity:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create amenity. Please verify your fields and try again.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const existingKeys = useMemo(() => {
    if (!data) return [];
    return data.map((a) => (a.key || "").trim().toLowerCase()).filter(Boolean);
  }, [data]);

  // Render Logic
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
          onClearFilters={() => {
            setSearchQuery("");
            setSelectedCategory("all");
          }}
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
