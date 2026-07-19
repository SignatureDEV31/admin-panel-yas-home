"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  getProjectById,
  updateProject,
  deleteProject,
  uploadProjectImages,
  deleteProjectImage,
  updateProjectMainImage,
  updateProjectPlanImage,
  Project,
} from "@/services/projects/projects.service";
import { PropertyImageItem } from "@/services/properties/properties.service";
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
  MapPin,
  Maximize2,
  DollarSign,
  FileImage,
  Star,
} from "lucide-react";
import { formatPrice, formatSurface } from "@/features/properties/utils/properties-utils";
import { getProjectStatusBadge } from "@/features/projects/utils/projects-utils";

interface ProjectDetailPageViewProps {
  id?: string;
  locale?: string;
}

export function ProjectDetailPageView({ id: propId, locale: propLocale }: ProjectDetailPageViewProps) {
  const router = useRouter();
  const routeParams = useParams();

  const id = propId || (routeParams?.id as string) || "";
  const locale = propLocale || (routeParams?.locale as string) || "fr";

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [projectStatus, setProjectStatus] = useState("UNDER_CONSTRUCTION");
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjectData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectById(id);
      setProject(data);

      const pObj = (data as any)?.project || data;
      setTitle(pObj.title || pObj.propertyName || "");
      const pStatus = (pObj.projectStatus || "UNDER_CONSTRUCTION").toUpperCase();
      setProjectStatus(pStatus === "FINISHED" || pStatus === "ANNOUNCEMENT" ? pStatus : "UNDER_CONSTRUCTION");
      setPrice(pObj.price ? String(pObj.price) : "");
      setSurface(pObj.surface ? String(pObj.surface) : "");
      setCategory(typeof pObj.category === "string" ? pObj.category : pObj.category?.name || "Residence Complex");
      setState(pObj.state || pObj.wilaya || "Oran");
      setCity(pObj.city || "");
      setAddress(pObj.address || pObj.adress || "");
      setDescription(pObj.description || "");
    } catch (err: any) {
      console.error(`Failed to fetch project ${id}:`, err);
      setError(err?.response?.data?.message || err?.message || `Failed to load project ID #${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving project updates...");
    try {
      const payload = {
        title: title.trim(),
        projectStatus,
        price: price !== "" ? Number(price) : undefined,
        surface: surface !== "" ? Number(surface) : undefined,
        category: category.trim() || undefined,
        state: state.trim() || undefined,
        city: city.trim() || undefined,
        address: address.trim() || undefined,
        description: description.trim() || undefined,
      };

      await updateProject(id, payload);
      await fetchProjectData();
      toast.success("Project updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Failed to update project:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update project.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this real-estate project?")) return;
    const toastId = toast.loading("Deleting project...");
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully!", { id: toastId });
      router.push(`/${locale}/projects`);
    } catch (err: any) {
      toast.error("Failed to delete project.", { id: toastId });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setUploading(true);
    const toastId = toast.loading("Uploading project image(s)...");
    try {
      await uploadProjectImages(id, formData);
      toast.success("Image(s) uploaded successfully!", { id: toastId });
      await fetchProjectData();
    } catch (err: any) {
      toast.error("Failed to upload image(s).", { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSetMainImage = async (imageId: string) => {
    const toastId = toast.loading("Setting main project image...");
    try {
      await updateProjectMainImage(id, imageId);
      toast.success("Main image updated!", { id: toastId });
      await fetchProjectData();
    } catch (err: any) {
      toast.error("Failed to set main image.", { id: toastId });
    }
  };

  const handleSetPlanImage = async (imageId: string) => {
    const toastId = toast.loading("Setting plan image...");
    try {
      await updateProjectPlanImage(id, imageId);
      toast.success("Plan image updated!", { id: toastId });
      await fetchProjectData();
    } catch (err: any) {
      toast.error("Failed to set plan image.", { id: toastId });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Delete this image?")) return;
    const toastId = toast.loading("Deleting image...");
    try {
      await deleteProjectImage(imageId);
      toast.success("Image deleted!", { id: toastId });
      await fetchProjectData();
    } catch (err: any) {
      toast.error("Failed to delete image.", { id: toastId });
    }
  };

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
            onClick={handleSaveChanges}
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
          <form onSubmit={handleSaveChanges} className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-yashomePink" />
              <span>Project Details & Specifications</span>
            </h2>

            <FormInput
              label="Project Title / Name"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Residence El Yasmine - Block A"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Development Status"
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                options={[
                  { value: "ANNOUNCEMENT", label: "Announcement (Lancement)" },
                  { value: "UNDER_CONSTRUCTION", label: "Under Construction (En Construction)" },
                  { value: "FINISHED", label: "Finished (Livré)" },
                ]}
              />

              <FormInput
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Residence Complex..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Starting Price (DZD)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 18000000"
              />

              <FormInput
                label="Total Surface (m²)"
                type="number"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                placeholder="e.g. 450"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="State / Wilaya"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Oran"
              />

              <FormInput
                label="City / Commune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bir El Djir"
              />
            </div>

            <FormInput
              label="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full location..."
            />

            <FormTextarea
              label="Project Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
