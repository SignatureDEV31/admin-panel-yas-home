import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, Check } from "lucide-react";
import { CreateAmenityPayload } from "@/features/amenities/types/amenity";
import { createAmenitySchema, AmenityFormValues } from "@/features/amenities/schemas/amenity.schema";
import { generateSystemKey } from "@/features/amenities/utils/amenities-utils";

interface AmenityFormProps {
  onSubmit: (data: CreateAmenityPayload) => Promise<void>;
  isSubmitting: boolean;
  existingKeys: string[];
  existingCategories: string[];
  onCancel?: () => void;
}

export const AmenityForm: React.FC<AmenityFormProps> = ({
  onSubmit,
  isSubmitting,
  existingKeys,
  existingCategories,
  onCancel,
}) => {
  const schema = React.useMemo(() => createAmenitySchema(existingKeys), [existingKeys]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AmenityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      key: "",
      category: "",
    },
  });

  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const titleValue = watch("title");
  const categoryValue = watch("category");

  const filteredCategories = React.useMemo(() => {
    const q = (categoryValue || "").toLowerCase().trim();
    if (!q) return existingCategories;
    return existingCategories.filter((cat) =>
      cat.toLowerCase().includes(q)
    );
  }, [categoryValue, existingCategories]);

  useEffect(() => {
    if (isKeyManuallyEdited) return;

    if (!titleValue) {
      setValue("key", "");
      return;
    }

    const generated = generateSystemKey(titleValue);
    setValue("key", generated, { shouldValidate: true });
  }, [titleValue, isKeyManuallyEdited, setValue]);

  // Handler for manual key change
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeyManuallyEdited(true);
    setValue("key", e.target.value, { shouldValidate: true });
  };

  const handleCategorySelect = (category: string) => {
    setValue("category", category, { shouldValidate: true });
    setIsDropdownOpen(false);
  };

  const onFormSubmit = async (data: AmenityFormValues) => {
    await onSubmit({
      title: data.title.trim(),
      key: data.key.trim(),
      category: data.category.trim(),
    });
    setIsKeyManuallyEdited(false);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid gap-4 py-4">
        {/* Title */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <label htmlFor="title" className="text-right text-sm font-medium text-foreground">
            Title
          </label>
          <div>
            <input
              id="title"
              type="text"
              placeholder="e.g. Swimming Pool"
              {...register("title")}
              className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${errors.title
                  ? "border-destructive/80 focus:ring-destructive focus:border-destructive hover:border-destructive"
                  : "border-input focus:ring-yashomePink focus:border-yashomePink"
                }`}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Key */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <label htmlFor="key" className="text-right text-sm font-medium text-foreground">
            System Key
          </label>
          <div>
            <input
              id="key"
              type="text"
              placeholder="e.g. swimming_pool"
              {...register("key")}
              onChange={handleKeyChange}
              className={`flex h-10 w-full rounded-md border bg-card px-3.5 py-2 text-sm font-semibold font-mono text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${errors.key
                  ? "border-destructive/80 focus:ring-destructive focus:border-destructive hover:border-destructive"
                  : "border-input focus:ring-yashomePink focus:border-yashomePink"
                }`}
            />
            {errors.key && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.key.message}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-4">
          <label htmlFor="category" className="text-right text-sm font-medium text-foreground pt-2">
            Category
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                id="category"
                type="text"
                placeholder="e.g. Sports & Wellness"
                {...register("category")}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsDropdownOpen(false), 200);
                }}
                className={`flex h-10 w-full rounded-md border bg-card pl-3.5 pr-10 py-2 text-sm font-semibold text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 ${errors.category
                    ? "border-destructive/80 focus:ring-destructive focus:border-destructive hover:border-destructive"
                    : "border-input focus:ring-yashomePink focus:border-yashomePink"
                  }`}
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />

              {isDropdownOpen && existingCategories.length > 0 && (
                <div className="absolute z-50 w-full top-full left-0 mt-1 max-h-52 overflow-y-auto rounded-md border border-border bg-card p-1 shadow-md text-foreground transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className="w-full text-left cursor-pointer rounded-md px-3 py-2.5 text-sm font-bold hover:bg-muted/40 hover:text-foreground text-foreground/80 transition-colors flex items-center justify-between"
                      >
                        <span>{cat}</span>
                        {categoryValue === cat && (
                          <Check className="h-4 w-4 text-yashomePink shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2.5 text-sm text-muted-foreground font-medium">
                      No categories found. Type to use "{categoryValue}"
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.category && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-border/40 pt-4 mt-2 flex justify-end gap-2">
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
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Amenity</span>
          )}
        </Button>
      </div>
    </form>
  );
};
