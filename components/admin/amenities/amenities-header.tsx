import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AmenitiesHeaderProps {
  onAddClick: () => void;
}

export const AmenitiesHeader: React.FC<AmenitiesHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Amenities</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Manage the amenities available for properties and projects.
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="cursor-pointer bg-main text-white hover:bg-main/90 self-start sm:self-auto flex items-center gap-1.5 font-bold shadow-sm h-10 px-4 rounded-md transition-all text-sm shrink-0"
      >
        <Plus className="h-4.5 w-4.5" />
        <span>Add Amenity</span>
      </Button>
    </div>
  );
};
