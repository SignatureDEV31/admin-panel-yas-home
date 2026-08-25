"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  restoreProperty,
  bulkPropertyAction,
  CreatePropertyPayload,
  Property,
} from "@/services/properties/properties.service";
import { exportData } from "@/services/admin/admin.service";
import { AdminBulkActionType, ExportFormat, ExportResource } from "@/services/types/admin.types";

export function useProperties() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog & Mutation States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPricingType, setSelectedPricingType] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [showOnlyDeleted, setShowOnlyDeleted] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Bulk Action States
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<(string | number)[]>([]);
  const [isBulkActing, setIsBulkActing] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "price" || field === "surface" ? "desc" : "asc");
    }
    setPage(1);
  };

  const fetchAllProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProperties({
        page,
        limit: pageSize,
        search: debouncedSearchQuery.trim() || undefined,
        propertyType: selectedType !== "all" ? selectedType : undefined,
        pricingType: selectedPricingType !== "all" ? selectedPricingType : undefined,
        availableStatus:
          selectedAvailability === "available"
            ? true
            : selectedAvailability === "unavailable"
            ? false
            : undefined,
        onlyDeleted: showOnlyDeleted ? true : undefined,
        withDeleted: showOnlyDeleted ? true : undefined,
        sortBy: sortField || "createdAt",
        sortOrder: sortOrder.toUpperCase() as "ASC" | "DESC",
      });

      setData(result.data || []);
      setTotalItems(result.meta?.totalItems || result.data.length || 0);
      setTotalPages(result.meta?.totalPages || 1);
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
  }, [
    page,
    pageSize,
    debouncedSearchQuery,
    selectedType,
    selectedPricingType,
    selectedAvailability,
    showOnlyDeleted,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);



  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProperty(null);
  };

  const handleFormSubmit = async (payload: CreatePropertyPayload) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      editingProperty ? "Updating property..." : "Creating property..."
    );

    try {
      if (editingProperty) {
        const targetId = editingProperty.id || editingProperty._id || "";
        await updateProperty(targetId, payload);
        toast.success("Property updated successfully!", { id: toastId });
      } else {
        await createProperty(payload);
        toast.success("Property created successfully!", { id: toastId });
      }
      setIsDialogOpen(false);
      setEditingProperty(null);
      await fetchAllProperties();
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

  const handleDeleteProperty = async (id: string | number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to soft-delete this property?")) return;

    const toastId = toast.loading("Deleting property...");
    try {
      await deleteProperty(id);
      toast.success("Property deleted successfully!", { id: toastId });
      setSelectedPropertyIds((prev) => prev.filter((i) => String(i) !== String(id)));
      await fetchAllProperties();
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete property. Please try again.";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleRestoreProperty = async (id: string | number) => {
    if (!id) return;
    const toastId = toast.loading("Restoring property...");
    try {
      await restoreProperty(id);
      toast.success("Property restored successfully!", { id: toastId });
      await fetchAllProperties();
    } catch (err: any) {
      console.error("Failed to restore property:", err);
      toast.error("Failed to restore property.", { id: toastId });
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (property: Property) => {
    const propId = property.id || property._id || "";
    const newStatus = !property.availableStatus;
    const toastId = toast.loading(
      newStatus ? "Marking as available..." : "Marking as unavailable..."
    );

    try {
      await updateProperty(propId, { availableStatus: newStatus });
      toast.success(
        `Property marked as ${newStatus ? "available" : "unavailable"}!`,
        { id: toastId }
      );
      await fetchAllProperties();
    } catch (err: any) {
      console.error("Failed to update availability:", err);
      toast.error("Failed to update availability status.", { id: toastId });
    }
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((p) => p.id || p._id || "").filter(Boolean);
      setSelectedPropertyIds(allIds);
    } else {
      setSelectedPropertyIds([]);
    }
  };

  const handleSelectProperty = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedPropertyIds((prev) => [...prev, id]);
    } else {
      setSelectedPropertyIds((prev) => prev.filter((i) => String(i) !== String(id)));
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: AdminBulkActionType) => {
    if (!selectedPropertyIds.length) return;
    if (action === AdminBulkActionType.DELETE) {
      if (!window.confirm(`Are you sure you want to soft-delete ${selectedPropertyIds.length} properties?`)) return;
    }

    setIsBulkActing(true);
    const toastId = toast.loading(`Executing bulk action on ${selectedPropertyIds.length} properties...`);

    try {
      await bulkPropertyAction({
        ids: selectedPropertyIds,
        action,
      });
      toast.success(`Bulk action completed successfully!`, { id: toastId });
      setSelectedPropertyIds([]);
      await fetchAllProperties();
    } catch (err: any) {
      console.error("Bulk action failed:", err);
      toast.error("Failed to complete bulk action.", { id: toastId });
    } finally {
      setIsBulkActing(false);
    }
  };

  // Export dataset
  const handleExport = async (format: ExportFormat = ExportFormat.CSV) => {
    const toastId = toast.loading(`Exporting properties as ${format.toUpperCase()}...`);
    try {
      await exportData(ExportResource.PROPERTIES, format);
      toast.success(`Properties export downloaded!`, { id: toastId });
    } catch (err: any) {
      console.error("Export failed:", err);
      toast.error("Failed to export properties.", { id: toastId });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedPricingType("all");
    setSelectedAvailability("all");
    setShowOnlyDeleted(false);
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
    searchQuery,
    selectedType,
    selectedPricingType,
    setSelectedPricingType: (val: string) => { setSelectedPricingType(val); setPage(1); },
    selectedAvailability,
    setSelectedAvailability: (val: string) => { setSelectedAvailability(val); setPage(1); },
    showOnlyDeleted,
    setShowOnlyDeleted: (val: boolean) => { setShowOnlyDeleted(val); setPage(1); },
    sortField,
    sortOrder,
    handleSort,
    handleTypeChange,
    handleSearchChange,
    clearFilters,
    fetchAllProperties,
    // Selection & Bulk
    selectedPropertyIds,
    isBulkActing,
    handleSelectAll,
    handleSelectProperty,
    handleBulkAction,
    handleExport,
    // Dialog state & handlers
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
  };
}
