"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyPhotoGallery } from "@/features/properties/components/property-photo-gallery";
import { FormInput, FormSelect, FormTextarea } from "@/features/properties/components/detail/property-form-input";
import {
  ArrowLeft,
  Briefcase,
  Save,
  Trash2,
  User,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/features/properties/utils/properties-utils";
import { getProjectStatusBadge } from "@/features/projects/utils/projects-utils";
import { PropertyImageItem } from "@/services/properties/properties.service";
import { useProjectDetail } from "../hooks/use-project-detail";

interface ProjectDetailPageViewProps {
  id?: string;
  locale?: string;
}

export function ProjectDetailPageView({ id: propId, locale: propLocale }: ProjectDetailPageViewProps) {
  const routeParams = useParams();

  const id = propId || (routeParams?.id as string) || "";
  const locale = propLocale || (routeParams?.locale as string) || "fr";

  const {
    project,
    loading,
    error,
    saving,
    uploading,
    form,
    fetchProjectData,
    handleSaveChanges,
    handleDeleteProject,
    handleImageUpload,
    handleSetMainImage,
    handleSetPlanImage,
    handleDeleteImage,
  } = useProjectDetail(id, locale);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32 bg-muted" />
          <Skeleton className="h-10 w-40 bg-muted" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl bg-muted" />
          <Skeleton className="h-96 rounded-xl bg-muted lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center bg-card border border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[350px] my-6">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Project Not Found</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6 font-medium">
          {error || `Unable to locate project details for ID #${id}`}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border bg-card text-foreground font-bold text-sm hover:bg-muted/30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
          <Button onClick={fetchProjectData} variant="outline" className="h-10 px-4 font-bold text-sm gap-1.5 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  const pObj = (project as any)?.project || project;
  const projectStatus = watch("projectStatus") || "UNDER_CONSTRUCTION";
  const title = watch("title") || "";
  const price = watch("price") || "";
  const category = watch("category") || "";

  const statusBadge = getProjectStatusBadge(projectStatus);
  const rawMainImage = typeof pObj.mainImage === "string" ? pObj.mainImage : pObj.mainImage?.url || project.mainImage;
  const rawImagesList = pObj.images || project.images || [];
  const rawImages: PropertyImageItem[] = rawImagesList.map((img: any) =>
    typeof img === "string" ? { id: img, url: img } : { id: String(img.id || img.public_id), url: img.url || img.secure_url }
  );
  const mainPhotoUrl = typeof rawMainImage === "string" ? rawMainImage : rawImages[0]?.url || null;

  return (
    <div className="space-y-6 pb-16">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/projects`}
            className="h-9 w-9 rounded-lg border border-border bg-card hover:bg-muted/30 flex items-center justify-center text-foreground transition-all shrink-0 shadow-xs"
            title="Back to Projects"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight line-clamp-1">
                {title || "Project Listing"}
              </h1>
              <code className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-muted border border-border/80 text-foreground select-all">
                #{id}
              </code>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
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
            onClick={handleDeleteProject}
            variant="outline"
            className="cursor-pointer border-destructive/30 text-destructive hover:bg-destructive/10 font-bold h-10 px-3.5 rounded-md transition-all text-sm flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          <Button
            type="submit"
            form="project-detail-form"
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
                <span>Save Project</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media Gallery */}
        <div className="space-y-6">
          <PropertyPhotoGallery
            propertyId={id}
            mainPhotoUrl={mainPhotoUrl}
            images={rawImages}
            uploading={uploading}
            onUploadImages={handleImageUpload}
            onSetMainImage={handleSetMainImage}
            onDeleteImage={handleDeleteImage}
          />

          {/* Developer / Promoter Info */}
          {project.user && (
            <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-yashomePink" />
                <span>Promoter / Developer Info</span>
              </h3>
              <div className="space-y-2 text-sm">
                {project.user.fullName && (
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <User className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <span>{project.user.fullName}</span>
                  </div>
                )}
                {project.user.email && (
                  <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <span>{project.user.email}</span>
                  </div>
                )}
                {project.user.phoneNumber && (
                  <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <Phone className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <span>{project.user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <form
            id="project-detail-form"
            onSubmit={handleSubmit(handleSaveChanges)}
            className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-6"
          >
            <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-yashomePink" />
              <span>Project Details & Specifications</span>
            </h2>

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
              placeholder="Full location..."
            />

            <FormTextarea
              label="Project Description"
              rows={4}
              {...register("description")}
              error={errors.description?.message}
              placeholder="Project description, construction timeline..."
            />

            <div className="flex justify-end pt-4 border-t border-border/60">
              <Button
                type="submit"
                disabled={saving}
                className="cursor-pointer bg-yashomePink text-white hover:bg-yashomePink/90 font-bold h-11 px-8 rounded-md transition-all text-sm flex items-center gap-2 shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Project</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
