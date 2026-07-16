"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { getAmenities, createAmenity } from "@/services/amenities.service";
import { Amenity, CreateAmenityPayload } from "@/types/amenity";
import { useMounted } from "@/hooks/use-mounted";

// UI Components
import { AmenitiesHeader } from "@/components/admin/amenities/amenities-header";
import { AmenitiesStats } from "@/components/admin/amenities/amenities-stats";
import { AmenitiesToolbar } from "@/components/admin/amenities/amenities-toolbar";
import { AmenitiesTable } from "@/components/admin/amenities/amenities-table";
import { AmenitiesEmptyState } from "@/components/admin/amenities/amenities-empty-state";
import { AmenitiesLoading } from "@/components/admin/amenities/amenities-loading";
import { AmenitiesError } from "@/components/admin/amenities/amenities-error";
import { AmenityDialog } from "@/components/admin/amenities/amenity-dialog";
import { AmenityForm } from "@/components/admin/amenities/amenity-form";

export default function AmenitiesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";

  const isMounted = useMounted();

  // State Management
  const [data, setData] = useState<Amenity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Compute Categories from returned data
  const categories = useMemo(() => {
    if (!data) return [];
    const unique = new Set(
      data.map((a) => (a.category || "").trim()).filter(Boolean)
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [data]);

  // Handle Search, Filters, and Sorting
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // 1. Search Query Filter (Title, Key, Category)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.key || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (item) => (item.category || "").trim() === selectedCategory
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === "title-az") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title-za") {
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortBy === "category-az") {
        return (a.category || "").localeCompare(b.category || "");
      }
      return 0;
    });

    return result;
  }, [data, searchQuery, selectedCategory, sortBy]);

  // Handle Submission Creation Flow
  const handleCreateAmenity = async (payload: CreateAmenityPayload) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating amenity...");
    try {
      const newAmenity = await createAmenity(payload);
      
      // Update local state instantly so UI updates without full refresh
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
          <AmenitiesTable
            amenities={filteredAndSortedData}
            locale={locale}
          />
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
