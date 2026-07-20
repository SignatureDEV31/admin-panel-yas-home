"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  getUnifiedSearchPaginated,
  createProperty,
  updateProperty,
  deleteProperty,
  CreatePropertyPayload,
} from "@/services/properties/properties.service";
import { getAdminStats } from "@/services/admin/admin.service";
import { AdminStats } from "@/services/types/admin.types";
import { Property } from "@/features/properties/types/property";

export function useProperties() {
  const [data, setData] = useState<Property[] | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog & Mutation States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "price" || field === "surface" ? "desc" : "asc");
    }
    setPage(1);
  };

  // Fetch admin stats
  const fetchStats = useCallback(async () => {
    try {
      const stats = await getAdminStats();
      setAdminStats(stats);
    } catch (err) {
      console.warn("Could not fetch admin stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch properties with batching
  const fetchAllProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const firstBatch = await getUnifiedSearchPaginated({
        searchIn: "properties",
        page: 1,
        limit: 50,
        keyword: debouncedSearchQuery.trim() || undefined,
        propertyType: selectedType !== "all" ? selectedType : undefined,
      });

      let allProps = firstBatch.data || [];
      const totalFromApi = firstBatch.total || adminStats?.properties || 314;

      if (firstBatch.data?.length === 50 && totalFromApi > 50) {
        const totalBatches = Math.ceil(totalFromApi / 50);
        const batchPromises = [];
        for (let p = 2; p <= totalBatches; p++) {
          batchPromises.push(
            getUnifiedSearchPaginated({
              searchIn: "properties",
              page: p,
              limit: 50,
              keyword: debouncedSearchQuery.trim() || undefined,
              propertyType: selectedType !== "all" ? selectedType : undefined,
            })
          );
        }

        const additionalBatches = await Promise.all(batchPromises);
        additionalBatches.forEach((batch) => {
          if (batch.data && batch.data.length > 0) {
            allProps = [...allProps, ...batch.data];
          }
        });
      }

      const seenIds = new Set<string>();
      const uniqueProps = allProps.filter((p) => {
        const id = String(p.id || p._id || "");
        if (!id || seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });

      setData(uniqueProps);
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
  }, [debouncedSearchQuery, selectedType, adminStats]);

  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedType]);

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
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
      await fetchStats();
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

  const handleDeleteProperty = async (id: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const toastId = toast.loading("Deleting property...");
    try {
      await deleteProperty(id);
      toast.success("Property deleted successfully!", { id: toastId });
      await fetchStats();
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

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      if (sortField === "title") {
        valA = (a.title || a.propertyName || String(a.id || a._id || "")).toLowerCase();
        valB = (b.title || b.propertyName || String(b.id || b._id || "")).toLowerCase();
      } else if (sortField === "propertyType") {
        valA = (a.propertyType || "").toLowerCase();
        valB = (b.propertyType || "").toLowerCase();
      } else if (sortField === "price") {
        valA = Number(a.price) || 0;
        valB = Number(b.price) || 0;
      } else if (sortField === "surface") {
        valA = Number(a.surface) || 0;
        valB = Number(b.surface) || 0;
      } else if (sortField === "location") {
        valA = (a.city || a.state || a.wilaya || a.address || "").toLowerCase();
        valB = (b.city || b.state || b.wilaya || b.address || "").toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setPage(1);
  };

  const overallKpiCount =
    adminStats?.properties !== undefined ? adminStats.properties : totalItems;

  return {
    data,
    adminStats,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedData,
    searchQuery,
    selectedType,
    sortField,
    sortOrder,
    handleSort,
    handleTypeChange,
    handleSearchChange,
    clearFilters,
    fetchAllProperties,
    // Dialog state & handlers
    isDialogOpen,
    editingProperty,
    isSubmitting,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseDialog,
    handleFormSubmit,
    handleDeleteProperty,
    overallKpiCount,
  };
}
