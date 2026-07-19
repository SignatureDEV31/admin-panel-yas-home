import React from "react";
import { Search, X } from "lucide-react";

interface AmenitiesToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  categories: string[];
  resultsCount: number;
}

export const AmenitiesToolbar: React.FC<AmenitiesToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  resultsCount,
}) => {
  const isFiltered = searchQuery !== "" || selectedCategory !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="flex flex-col gap-4 border border-border/80 bg-card p-4 rounded-xl shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Search and Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-muted-foreground/60" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, key or category..."
              className="pl-9 pr-3 h-9 w-full rounded-md border border-input bg-card text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
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

          {/* Category Select */}
          <div className="w-full sm:w-48 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 w-full rounded-md border border-input bg-card text-sm text-foreground shadow-xs transition-colors focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat || "Uncategorized"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Sort Select */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-start">
          <div className="w-full sm:w-44 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 w-full rounded-md border border-input bg-card text-sm text-foreground shadow-xs transition-colors focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-az">Title A–Z</option>
              <option value="title-za">Title Z–A</option>
              <option value="category-az">Category A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toolbar Footer: Results count & clear filters option */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-1 border-t border-border/40">
        <div>
          Showing {resultsCount} {resultsCount === 1 ? "amenity" : "amenities"}
        </div>
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-yashomePink hover:underline font-bold cursor-pointer transition-all"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
