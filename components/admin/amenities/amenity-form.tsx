import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateAmenityPayload } from "@/types/amenity";

// Validation Schema builder
const createSchema = (existingKeys: string[]) =>
  z.object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title is too long"),
    key: z
      .string()
      .min(2, "Key must be at least 2 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Key can only contain lowercase letters, numbers, and underscores"
      )
      .refine(
        (val) => !val.startsWith("_") && !val.endsWith("_"),
        "Key must not start or end with an underscore"
      )
      .refine(
        (val) => !existingKeys.includes(val),
        "Key must be unique. This amenity key already exists"
      ),
    category: z.string().min(2, "Category must be at least 2 characters"),
  });

type FormValues = z.infer<ReturnType<typeof createSchema>>;

interface AmenityFormProps {
  onSubmit: (data: CreateAmenityPayload) => Promise<void>;
  isSubmitting: boolean;
  existingKeys: string[];
  existingCategories: string[];
}

export const AmenityForm: React.FC<AmenityFormProps> = ({
  onSubmit,
  isSubmitting,
  existingKeys,
  existingCategories,
}) => {
  const schema = useMemoSchema(existingKeys);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      key: "",
      category: "",
    },
  });

  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);
  const titleValue = watch("title");

  // Autogenerate key from title unless manually edited
  useEffect(() => {
    if (isKeyManuallyEdited) return;

    if (!titleValue) {
      setValue("key", "");
      return;
    }

    const generated = titleValue
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^\w\s-]/g, "")        // remove special chars
      .replace(/[\s-]+/g, "_")          // replace spaces/hyphens with single underscore
      .replace(/^_+|_+$/g, "");        // trim leading/trailing underscores

    setValue("key", generated, { shouldValidate: true });
  }, [titleValue, isKeyManuallyEdited, setValue]);

  // Handler for manual key change
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeyManuallyEdited(true);
    setValue("key", e.target.value, { shouldValidate: true });
  };

  const handleCategorySelect = (category: string) => {
    setValue("category", category, { shouldValidate: true });
  };

  const onFormSubmit = async (data: FormValues) => {
    await onSubmit({
      title: data.title.trim(),
      key: data.key.trim(),
      category: data.category.trim(),
    });
    // Reset edit flag for future renders
    setIsKeyManuallyEdited(false);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">Title</label>
        <input
          type="text"
          placeholder="e.g. Swimming Pool"
          {...register("title")}
          className={`flex h-9 w-full rounded-md border bg-card px-3 py-1 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring ${
            errors.title ? "border-destructive/80 focus:ring-destructive" : "border-input"
          }`}
        />
        {errors.title && (
          <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Key */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">System Key</label>
        <input
          type="text"
          placeholder="e.g. swimming_pool"
          {...register("key")}
          onChange={handleKeyChange}
          className={`flex h-9 w-full rounded-md border bg-card px-3 py-1 text-sm text-foreground shadow-xs font-mono transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring ${
            errors.key ? "border-destructive/80 focus:ring-destructive" : "border-input"
          }`}
        />
        <p className="text-xxs text-muted-foreground font-medium">
          Unique lowercase key, generated automatically. Editable unless start/end with underscores.
        </p>
        {errors.key && (
          <p className="text-xs text-destructive font-medium">{errors.key.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">Category</label>
        <input
          type="text"
          placeholder="e.g. Sports & Wellness"
          {...register("category")}
          className={`flex h-9 w-full rounded-md border bg-card px-3 py-1 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring ${
            errors.category ? "border-destructive/80 focus:ring-destructive" : "border-input"
          }`}
        />
        {errors.category && (
          <p className="text-xs text-destructive font-medium">{errors.category.message}</p>
        )}

        {/* Existing Categories Badges / Autocomplete */}
        {existingCategories.length > 0 && (
          <div className="pt-2">
            <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Or pick an existing category:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {existingCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className="cursor-pointer inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xxs font-semibold bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer bg-main text-white hover:bg-main/90 font-bold h-10 px-4 rounded-md transition-all text-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
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

// Helper hook/macro to memoize schema to avoid rebuilds
function useMemoSchema(keys: string[]) {
  return React.useMemo(() => createSchema(keys), [keys]);
}
