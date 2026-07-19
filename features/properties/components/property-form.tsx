import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Property, CreatePropertyPayload } from "@/features/properties/types/property";
import { propertySchema, PropertyFormValues } from "@/features/properties/schemas/property.schema";

interface PropertyFormProps {
  initialData?: Property | null;
  onSubmit: (data: CreatePropertyPayload) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || "",
      propertyType: (initialData?.propertyType || "VENTE").toUpperCase() === "LOCATION" ? "LOCATION" : "VENTE",
      price: initialData?.price ? String(initialData.price) : "",
      surface: initialData?.surface ? String(initialData.surface) : "",
      category: typeof initialData?.category === "string" ? initialData.category : initialData?.category?.title || initialData?.category?.name || "Appartement",
      state: initialData?.state || initialData?.wilaya || "Oran",
      city: initialData?.city || "",
      address: initialData?.address || "",
      description: initialData?.description || "",
    },
  });

  const onFormSubmit = async (data: PropertyFormValues) => {
    await onSubmit({
      title: data.title.trim(),
      propertyType: data.propertyType,
      price: Number(data.price),
      surface: Number(data.surface),
      category: data.category.trim(),
      state: data.state.trim(),
      city: data.city ? data.city.trim() : undefined,
      address: data.address ? data.address.trim() : undefined,
      description: data.description ? data.description.trim() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Luxurious Apartment with Sea View"
          {...register("title")}
          className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${
            errors.title
              ? "border-destructive/80 focus:ring-destructive"
              : "border-input focus:ring-yashomePink focus:border-yashomePink"
          }`}
        />
        {errors.title && (
          <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Grid: Property Type & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Property Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Listing Type <span className="text-destructive">*</span>
          </label>
          <select
            {...register("propertyType")}
            className="h-10 px-3.5 w-full rounded-md border border-input bg-card text-sm font-semibold text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-yashomePink focus:border-yashomePink cursor-pointer"
          >
            <option value="VENTE">For Sale (Vente)</option>
            <option value="LOCATION">For Rent (Location)</option>
          </select>
          {errors.propertyType && (
            <p className="text-xs text-destructive font-medium">{errors.propertyType.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Appartement, Villa, Duplex..."
            {...register("category")}
            className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${
              errors.category
                ? "border-destructive/80 focus:ring-destructive"
                : "border-input focus:ring-yashomePink focus:border-yashomePink"
            }`}
          />
          {errors.category && (
            <p className="text-xs text-destructive font-medium">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Grid: Price & Surface */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Price (DZD) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 15000000"
            {...register("price")}
            className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${
              errors.price
                ? "border-destructive/80 focus:ring-destructive"
                : "border-input focus:ring-yashomePink focus:border-yashomePink"
            }`}
          />
          {errors.price && (
            <p className="text-xs text-destructive font-medium">{errors.price.message}</p>
          )}
        </div>

        {/* Surface */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Surface Area (m²) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 120"
            {...register("surface")}
            className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${
              errors.surface
                ? "border-destructive/80 focus:ring-destructive"
                : "border-input focus:ring-yashomePink focus:border-yashomePink"
            }`}
          />
          {errors.surface && (
            <p className="text-xs text-destructive font-medium">{errors.surface.message}</p>
          )}
        </div>
      </div>

      {/* Grid: State & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State / Wilaya */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            State / Wilaya <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Oran, Algiers..."
            {...register("state")}
            className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${
              errors.state
                ? "border-destructive/80 focus:ring-destructive"
                : "border-input focus:ring-yashomePink focus:border-yashomePink"
            }`}
          />
          {errors.state && (
            <p className="text-xs text-destructive font-medium">{errors.state.message}</p>
          )}
        </div>

        {/* City / Commune */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">City / Commune</label>
          <input
            type="text"
            placeholder="e.g. Aïn El Turk, Bir El Djir..."
            {...register("city")}
            className="flex h-10 w-full rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-yashomePink focus:border-yashomePink"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">Description</label>
        <textarea
          rows={3}
          placeholder="Brief description of the property attributes, view, amenities..."
          {...register("description")}
          className="flex w-full rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-yashomePink focus:border-yashomePink"
        />
      </div>

      {/* Form Buttons */}
      <div className="border-t border-border/40 pt-4 mt-4 flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="cursor-pointer bg-yasHomeBlue text-white hover:bg-yasHomeBlue/90 font-bold h-10 px-4 rounded-md transition-all text-sm w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer bg-yashomePink text-white hover:bg-yashomePink/90 font-bold h-10 px-4 rounded-md transition-all text-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isEditing ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>{isEditing ? "Update Property" : "Create Property"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};
