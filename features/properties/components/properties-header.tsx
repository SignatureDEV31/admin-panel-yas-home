import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

interface PropertiesHeaderProps {
  onAddClick?: () => void;
}

export const PropertiesHeader: React.FC<PropertiesHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Building2 className="h-7 w-7 text-yashomePink" />
          <span>Properties</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Browse and manage active real estate listings.
        </p>
      </div>

      {onAddClick && (
        <Button
          onClick={onAddClick}
          className="cursor-pointer bg-main text-white hover:bg-main/90 self-start sm:self-auto flex items-center gap-1.5 font-bold shadow-sm h-10 px-4 rounded-md transition-all text-sm shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Property</span>
        </Button>
      )}
    </div>
  );
};
