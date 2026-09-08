"use client";

import React from "react";
import { Search, X, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportFormat } from "@/services/types/admin.types";
import { projectStatusOptions, projectPublishOptions } from "../data/data";

interface ProjectsToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedPublish?: string;
  setSelectedPublish?: (val: string) => void;
  resultsCount?: number;
  onResetFilters?: () => void;
  onExport?: (format?: ExportFormat) => void;
}

export const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPublish = "all",
  setSelectedPublish,
  resultsCount = 0,
  onResetFilters,
  onExport,
}) => {
  const isFiltered =
    searchQuery !== "" || selectedStatus !== "all" || selectedPublish !== "all";

  const handleClearFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      setSearchQuery("");
      setSelectedStatus("all");
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-border/80 bg-card p-4 rounded-xl shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: Search and Status Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground/60" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (#12), project title, city..."
              className="pl-9 pr-8 h-10 w-full rounded-lg border border-input bg-background text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground/60 hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline-flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {projectStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Select */}
          {setSelectedPublish && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedPublish}
                onChange={(e) => setSelectedPublish(e.target.value)}
                className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {projectPublishOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Side: Export Menu & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
          <div className="text-xs text-muted-foreground font-medium">
            Total: <span className="text-foreground font-bold">{resultsCount}</span>
          </div>

          {onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 text-xs font-semibold cursor-pointer border-border/80 hover:bg-muted"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => onExport(ExportFormat.CSV)}
                  className="cursor-pointer text-xs font-medium"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onExport(ExportFormat.JSON)}
                  className="cursor-pointer text-xs font-medium"
                >
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Toolbar Footer: Results count & clear filters option */}
      {isFiltered && (
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-1 border-t border-border/40">
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-yashomePink hover:underline font-bold cursor-pointer transition-all"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
