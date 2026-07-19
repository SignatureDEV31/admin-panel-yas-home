import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FilterX, Plus } from "lucide-react";

interface AmenitiesEmptyStateProps {
  type: "all" | "filtered";
  onAddClick?: () => void;
  onClearFilters?: () => void;
}

export const AmenitiesEmptyState: React.FC<AmenitiesEmptyStateProps> = ({
  type,
  onAddClick,
  onClearFilters,
}) => {
  if (type === "all") {
    return (
      <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
        <div className="h-12 w-12 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No amenities yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
          Create your first amenity to make it available for properties and projects.
        </p>
        {onAddClick && (
          <Button
            onClick={onAddClick}
            className="cursor-pointer bg-main text-white hover:bg-main/90 flex items-center gap-1.5 font-bold h-10 px-4 rounded-md transition-all text-sm"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Amenity</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
      <div className="h-12 w-12 rounded-full bg-muted/10 text-muted-foreground/50 flex items-center justify-center mb-4">
        <FilterX className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">No matching amenities</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
        Try changing your search term or category filter.
      </p>
      {onClearFilters && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="cursor-pointer border-border hover:bg-muted/30 flex items-center gap-1.5 font-bold h-10 px-4 rounded-md transition-all text-sm bg-card text-foreground"
        >
          <span>Clear filters</span>
        </Button>
      )}
    </div>
  );
};
