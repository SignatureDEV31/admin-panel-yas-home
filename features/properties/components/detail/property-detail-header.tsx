import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/properties/utils/properties-utils";

interface PropertyDetailHeaderProps {
  id: string;
  locale: string;
  propertyName: string;
  category: string;
  price: string | number;
  saving: boolean;
  onDelete: () => void;
  onSave: (e: React.FormEvent) => void;
}

export const PropertyDetailHeader: React.FC<PropertyDetailHeaderProps> = ({
  id,
  locale,
  propertyName,
  category,
  price,
  saving,
  onDelete,
  onSave,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
    <div className="flex items-center gap-3">
      <Link
        href={`/${locale}/properties`}
        className="h-9 w-9 rounded-lg border border-border bg-card hover:bg-muted/30 flex items-center justify-center text-foreground transition-all shrink-0 shadow-xs"
        title="Back to Properties"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
      </Link>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight line-clamp-1">
            {propertyName || "Property Listing"}
          </h1>
          <code className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-muted border border-border/80 text-foreground select-all">
            #{id}
          </code>
        </div>
        <p className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center gap-2">
          <span>{category}</span>
          <span>•</span>
          <span className="text-yashomePink font-bold">{formatPrice(price)}</span>
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2.5 self-end sm:self-auto">
      <Button
        type="button"
        onClick={onDelete}
        variant="outline"
        className="cursor-pointer border-destructive/30 text-destructive hover:bg-destructive/10 font-bold h-10 px-3.5 rounded-md transition-all text-sm flex items-center gap-1.5"
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">Delete</span>
      </Button>

      <Button
        type="submit"
        onClick={onSave}
        disabled={saving}
        className="cursor-pointer bg-yashomePink text-white hover:bg-yashomePink/90 font-bold h-10 px-5 rounded-md transition-all text-sm flex items-center gap-1.5 shadow-sm"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>Save All Changes</span>
          </>
        )}
      </Button>
    </div>
  </div>
);
