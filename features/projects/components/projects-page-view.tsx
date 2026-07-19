"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getUnifiedSearchPaginated, Property as ProjectItem } from "@/services/properties/properties.service";
import { filterProjects } from "@/features/projects/utils/projects-utils";
import { useMounted } from "@/hooks/use-mounted";

import { ProjectsHeader } from "./projects-header";
import { ProjectsStats } from "./projects-stats";
import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsTable } from "./projects-table";
import { ProjectsLoading } from "./projects-loading";
import { ProjectsError } from "./projects-error";
import { ProjectsEmptyState } from "./projects-empty-state";
import { PaginationControl } from "@/components/shared/pagination/pagination-control";

export function ProjectsPageView() {
  const isMounted = useMounted();

  const [data, setData] = useState<ProjectItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUnifiedSearchPaginated({
        searchIn: "projects",
        limit: 50,
        page: 1,
      });
      setData(result.data || []);
    } catch (err: any) {
      console.error("Failed to load projects:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch projects list from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStatus]);

  const filteredProjects = useMemo(() => {
    return filterProjects(data || [], searchQuery, selectedStatus);
  }, [data, searchQuery, selectedStatus]);

  // Paginated View Slice
  const totalFilteredCount = filteredProjects.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, page, pageSize]);

  if (loading) {
    return (
      <div className="space-y-6">
        <ProjectsHeader />
        <ProjectsLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ProjectsHeader />
        <ProjectsError description={error} onRetry={fetchProjects} />
      </div>
    );
  }

  const hasData = data && data.length > 0;
  const hasSearchResults = filteredProjects.length > 0;

  return (
    <div className="space-y-6">
      <ProjectsHeader />

      {isMounted && <ProjectsStats projects={data || []} />}

      <ProjectsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        resultsCount={filteredProjects.length}
      />

      {!hasData ? (
        <ProjectsEmptyState type="all" />
      ) : !hasSearchResults ? (
        <ProjectsEmptyState
          type="filtered"
          onClearFilters={() => {
            setSearchQuery("");
            setSelectedStatus("all");
          }}
        />
      ) : (
        isMounted && (
          <div className="space-y-4">
            <ProjectsTable projects={paginatedProjects} />

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
    </div>
  );
}
