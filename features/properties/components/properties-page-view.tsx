"use client";

import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  getUnifiedSearchPaginated,
  createProperty,
  updateProperty,
  deleteProperty,
  CreatePropertyPayload,
} from "@/services/properties/properties.service";
import { Property } from "@/features/properties/types/property";
import { filterProperties } from "@/features/properties/utils/properties-utils";
import { useMounted } from "@/hooks/use-mounted";

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

  const [data, setData] = useState<Property[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Dialog & Mutation States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const fetchAllProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUnifiedSearchPaginated({
        searchIn: "properties",
        limit: 50,
        page: 1,
      });
      setData(result.data || []);
      setTotalItems(result.total || result.data?.length || 0);
    } catch (err: any) {
      console.error("Failed to load properties:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch properties list from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedType]);

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (payload: CreatePropertyPayload) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      editingProperty ? "Updating property..." : "Creating property..."
    );

    try {
      if (editingProperty) {
        const targetId = editingProperty.id || editingProperty._id || "";
        const updated = await updateProperty(targetId, payload);

        setData((prev) =>
          prev
            ? prev.map((p) => ((p.id || p._id) === targetId ? { ...p, ...updated } : p))
            : [updated]
        );
        toast.success("Property updated successfully!", { id: toastId });
      } else {
        const created = await createProperty(payload);
        setData((prev) => (prev ? [created, ...prev] : [created]));
        toast.success("Property created successfully!", { id: toastId });
      }
      setIsDialogOpen(false);
      setEditingProperty(null);
    } catch (err: any) {
      console.error("Property operation failed:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save property. Please check inputs and try again.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const toastId = toast.loading("Deleting property...");
    try {
      await deleteProperty(id);
      setData((prev) => (prev ? prev.filter((p) => (p.id || p._id) !== id) : []));
      toast.success("Property deleted successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete property. Please try again.";
      toast.error(errMsg, { id: toastId });
    }
  };

  const filteredProperties = useMemo(() => {
    return filterProperties(data || [], searchQuery, selectedType, "all");
  }, [data, searchQuery, selectedType]);

  // Paginated View Slice
  const totalFilteredCount = filteredProperties.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;

  const paginatedProperties = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, page, pageSize]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PropertiesHeader onAddClick={handleOpenAdd} />
        <PropertiesLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PropertiesHeader onAddClick={handleOpenAdd} />
        <PropertiesError description={error} onRetry={fetchAllProperties} />
      </div>
    );
  }

  const hasData = data && data.length > 0;
  const hasSearchResults = filteredProperties.length > 0;

  return (
    <div className="space-y-6">
      <PropertiesHeader onAddClick={handleOpenAdd} />

      {isMounted && <PropertiesStats properties={data || []} />}

      <PropertiesToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        resultsCount={filteredProperties.length}
      />

      {!hasData ? (
        <PropertiesEmptyState type="all" />
      ) : !hasSearchResults ? (
        <PropertiesEmptyState
          type="filtered"
          onClearFilters={() => {
            setSearchQuery("");
            setSelectedType("all");
          }}
        />
      ) : (
        isMounted && (
          <div className="space-y-4">
            <PropertiesTable
              properties={paginatedProperties}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteProperty}
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

      {/* Create / Edit Dialog */}
      <PropertyDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingProperty(null);
        }}
        title={editingProperty ? "Edit Property" : "Add Property"}
        subtitle={
          editingProperty
            ? "Update real estate listing details via PATCH /properties/{id}"
            : "Create a new property listing via POST /properties"
        }
      >
        <PropertyForm
          initialData={editingProperty}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => {
            setIsDialogOpen(false);
            setEditingProperty(null);
          }}
        />
      </PropertyDialog>
    </div>
  );
}
