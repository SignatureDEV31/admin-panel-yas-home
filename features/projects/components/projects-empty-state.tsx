import React from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, FilterX } from "lucide-react";

interface ProjectsEmptyStateProps {
  type?: "all" | "filtered";
  searchQuery?: string;
  onClearFilters?: () => void;
  onReset?: () => void;
}

export const ProjectsEmptyState: React.FC<ProjectsEmptyStateProps> = ({
  type = "filtered",
  searchQuery,
  onClearFilters,
  onReset,
}) => {
  const handleReset = onClearFilters || onReset;

  if (type === "all" && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
        <div className="h-12 w-12 rounded-full bg-yashomePink/10 text-yashomePink flex items-center justify-center mb-4">
          <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No projects found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
          There are currently no real estate development projects registered in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[300px]">
      <div className="h-12 w-12 rounded-full bg-muted/10 text-muted-foreground/50 flex items-center justify-center mb-4">
        <FilterX className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">No matching projects</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 font-medium">
        {searchQuery ? `No results found for "${searchQuery}".` : "Try changing your search term or status filter."}
      </p>
      {handleReset && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="cursor-pointer border-border hover:bg-muted/30 flex items-center gap-1.5 font-bold h-10 px-4 rounded-md transition-all text-sm bg-card text-foreground"
        >
          <span>Clear filters</span>
        </Button>
      )}
    </div>
  );
};
