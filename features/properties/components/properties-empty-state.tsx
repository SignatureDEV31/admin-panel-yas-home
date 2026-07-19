import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, FilterX } from "lucide-react";

interface PropertiesEmptyStateProps {
  type: "all" | "filtered";
  onClearFilters?: () => void;
}

export const PropertiesEmptyState: React.FC<PropertiesEmptyStateProps> = ({
  type,
  onClearFilters,
}) => {
  if (type === "all") {
    return (
      <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
        <div className="h-12 w-12 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No properties found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
          There are currently no real estate property listings registered in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
      <div className="h-12 w-12 rounded-full bg-muted/10 text-muted-foreground/50 flex items-center justify-center mb-4">
        <FilterX className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">No matching properties</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
        Try changing your search term or filter parameters.
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
