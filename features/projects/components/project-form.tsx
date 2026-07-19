"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "../schemas/project.schema";
import { Project } from "@/services/projects/projects.service";
import { FormInput, FormSelect, FormTextarea } from "@/features/properties/components/detail/property-form-input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface ProjectFormProps {
  initialData?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      projectStatus: "UNDER_CONSTRUCTION",
      price: "",
      surface: "",
      category: "Residence Complex",
      state: "Oran",
      city: "",
      address: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const pStatus = (initialData.projectStatus || "UNDER_CONSTRUCTION").toUpperCase();
      const validStatus =
        pStatus === "FINISHED" || pStatus === "ANNOUNCEMENT" ? pStatus : "UNDER_CONSTRUCTION";

      reset({
        title: initialData.title || initialData.propertyName || "",
        projectStatus: validStatus as any,
        price: initialData.price ? String(initialData.price) : "",
        surface: initialData.surface ? String(initialData.surface) : "",
        category: typeof initialData.category === "string" ? initialData.category : initialData.category?.name || "Residence Complex",
        state: initialData.state || initialData.wilaya || "Oran",
        city: initialData.city || "",
        address: initialData.address || initialData.adress || "",
        description: initialData.description || "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <FormInput
        label="Project Title / Name"
        required
        {...register("title")}
        error={errors.title?.message}
        placeholder="e.g. Residence El Yasmine - Block A"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          label="Development Status"
          {...register("projectStatus")}
          error={errors.projectStatus?.message}
          options={[
            { value: "ANNOUNCEMENT", label: "Announcement (Lancement)" },
            { value: "UNDER_CONSTRUCTION", label: "Under Construction (En Construction)" },
            { value: "FINISHED", label: "Finished (Livré)" },
          ]}
        />

        <FormInput
          label="Category"
          {...register("category")}
          error={errors.category?.message}
          placeholder="e.g. Residence Complex..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Starting Price (DZD)"
          type="number"
          {...register("price")}
          error={errors.price?.message}
          placeholder="e.g. 18000000"
        />

        <FormInput
          label="Total Surface (m²)"
          type="number"
          {...register("surface")}
          error={errors.surface?.message}
          placeholder="e.g. 450"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="State / Wilaya"
          {...register("state")}
          error={errors.state?.message}
          placeholder="e.g. Oran"
        />

        <FormInput
          label="City / Commune"
          {...register("city")}
          error={errors.city?.message}
          placeholder="e.g. Bir El Djir"
        />
      </div>

      <FormInput
        label="Full Address"
        {...register("address")}
        error={errors.address?.message}
        placeholder="Full project location..."
      />

      <FormTextarea
        label="Project Description"
        rows={3}
        {...register("description")}
        error={errors.description?.message}
        placeholder="Describe project details, amenities, and delivery date..."
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="h-10 px-4 font-bold text-sm cursor-pointer"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer bg-yashomePink text-white hover:bg-yashomePink/90 font-bold h-10 px-5 text-sm flex items-center gap-1.5 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{initialData ? "Update Project" : "Create Project"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
