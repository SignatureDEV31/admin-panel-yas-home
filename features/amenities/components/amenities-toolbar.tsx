"use client";

import React from "react";
import { Search, X, Filter } from "lucide-react";

import { amenitySortOptions } from "../data/data";

export interface AmenitiesToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  categories: string[];
  resultsCount: number;
  onResetFilters?: () => void;
}

export function AmenitiesToolbar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  resultsCount,
  onResetFilters,
}: AmenitiesToolbarProps) {
  const isFiltered = searchQuery !== "" || selectedCategory !== "all";

  const handleClearFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      setSearchQuery("");
      setSelectedCategory("all");
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-border/80 bg-card p-4 rounded-xl shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: Search and Category Filter */}
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
              placeholder="Search by title, key or category..."
              className="pl-9 pr-8 h-10 w-full rounded-lg border border-input bg-background text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground/60 hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline-flex items-center gap-1">
              <Filter className="h-3 w-3" /> Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat || "Uncategorized"}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline-flex items-center gap-1">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {amenitySortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Total Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
          <div className="text-xs text-muted-foreground font-medium">
            Total: <span className="text-foreground font-bold">{resultsCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar Footer: Results count & clear filters option */}
      {isFiltered && (
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-1 border-t border-border/40">
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-yashomePink hover:underline font-bold cursor-pointer transition-all"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
