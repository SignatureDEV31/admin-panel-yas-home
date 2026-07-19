"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  getPropertyById,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  deletePropertyImage,
  updatePropertyMainImage,
  Property,
} from "@/services/properties/properties.service";
import {
  propertyDetailSchema,
  PropertyDetailFormData,
} from "../schemas/property-detail.schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyPhotoGallery } from "./property-photo-gallery";
import { PropertyDetailHeader } from "./detail/property-detail-header";
import { PropertySellerCard } from "./detail/property-seller-card";
import { FormInput, FormSelect, FormTextarea } from "./detail/property-form-input";
import { AmenityGroup } from "./detail/property-amenities-group";
import { AMENITIES_SECTIONS } from "./detail/property-amenities-config";
import {
  Building2,
  Save,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MapPin,
  DollarSign,
  Video,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

interface PropertyDetailPageViewProps {
  id?: string;
  locale?: string;
}

export function PropertyDetailPageView({ id: propId, locale: propLocale }: PropertyDetailPageViewProps) {
  const router = useRouter();
  const routeParams = useParams();

  const id = propId || (routeParams?.id as string) || "";
  const locale = propLocale || (routeParams?.locale as string) || "fr";

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- React Hook Form & Zod Validation ---
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyDetailFormData>({
    resolver: zodResolver(propertyDetailSchema),
    defaultValues: {
      propertyType: "VENTE",
      country: "Algérie",
      pricingDeal: "fixed",
      pricingMethode: "total",
      availableStatus: true,
    },
  });

  const availableStatus = watch("availableStatus");
  const propertyName = watch("propertyName");
  const category = watch("category");
  const price = watch("price");

  const fetchPropertyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyById(id);
      setProperty(data);

      const propObj = (data as any)?.property || data;

      // Extract Amenities Flags
      const sourceObj = (data as any).rawParent || data;
      const amenitiesFlags: Record<string, boolean> = {};
      AMENITIES_SECTIONS.forEach((sec) => {
        sec.items.forEach((item) => {
          amenitiesFlags[item.key] =
            typeof sourceObj[item.key] === "boolean"
              ? sourceObj[item.key]
              : typeof propObj[item.key] === "boolean"
              ? propObj[item.key]
              : false;
        });
      });

      const pType = (propObj.propertyType || data.propertyType || "VENTE").toUpperCase();

      // Reset form with fetched values
      reset({
        propertyName: propObj.propertyName || data.title || (data as any).name || (data as any).nom || "",
        propertyType: pType.includes("LOC") || pType.includes("RENT") ? "LOCATION" : "VENTE",
        category: typeof propObj.category === "string" ? propObj.category : propObj.category?.name || propObj.category?.title || data.category || "Appartement",
        price: propObj.price ?? data.price ?? "",
        surface: propObj.surface ?? data.surface ?? "",
        propertyEtage: propObj.propertyEtage ?? (data as any).propertyEtage ?? "",
        beds: propObj.beds ?? data.beds ?? "",
        apartmentsNumber: propObj.apartmentsNumber ?? (data as any).apartmentsNumber ?? "",
        capaciteMax: propObj.capaciteMax ?? (data as any).capaciteMax ?? "",
        pricingDeal: propObj.pricingDeal || (data as any).pricingDeal || "fixed",
        pricingMethode: propObj.pricingMethode || (data as any).pricingMethode || "total",
        pricingType: propObj.pricingType || (data as any).pricingType || "",
        rentalPeriod: propObj.rentalPeriod || (data as any).rentalPeriod || "",
        securityDeposit: propObj.securityDeposit ? String(propObj.securityDeposit) : "",
        discount: propObj.discount ? String(propObj.discount) : "",
        descriptionPaiement: propObj.descriptionPaiement || (data as any).descriptionPaiement || "",
        country: propObj.country || (data as any).country || "Algérie",
        state: propObj.state || data.state || propObj.wilaya || data.wilaya || "",
        city: propObj.city || data.city || (data as any).commune || "",
        adress: propObj.adress || propObj.address || data.address || "",
        latitude: propObj.latitude ? String(propObj.latitude) : "",
        longitude: propObj.longitude ? String(propObj.longitude) : "",
        availableStatus: propObj.availableStatus !== undefined ? Boolean(propObj.availableStatus) : true,
        availableDate: propObj.availableDate || (data as any).availableDate || "",
        videoLink: propObj.videoLink || (data as any).videoLink || "",
        description: propObj.description || data.description || "",
        ...amenitiesFlags,
      });
    } catch (err: any) {
      console.error(`Failed to fetch property ${id}:`, err);
      setError(err?.response?.data?.message || err?.message || `Failed to load property details for ID: ${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPropertyData();
  }, [id]);

  const toggleAmenity = (key: string) => {
    const current = watch(key as any);
    setValue(key as any, !current, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (formData: PropertyDetailFormData) => {
    setSaving(true);
    const toastId = toast.loading("Saving property changes via React Hook Form...");
    try {
      const updatedPropertyObj = {
        ...((property as any)?.property || {}),
        propertyName: formData.propertyName.trim(),
        title: formData.propertyName.trim(),
        propertyType: formData.propertyType,
        category: formData.category?.trim(),
        price: formData.price !== "" && formData.price !== undefined ? Number(formData.price) : null,
        surface: formData.surface !== "" && formData.surface !== undefined ? String(formData.surface) : null,
        propertyEtage: formData.propertyEtage !== "" && formData.propertyEtage !== undefined ? Number(formData.propertyEtage) : null,
        beds: formData.beds !== "" && formData.beds !== undefined ? Number(formData.beds) : null,
        apartmentsNumber: formData.apartmentsNumber !== "" && formData.apartmentsNumber !== undefined ? Number(formData.apartmentsNumber) : null,
        capaciteMax: formData.capaciteMax !== "" && formData.capaciteMax !== undefined ? Number(formData.capaciteMax) : 0,
        pricingDeal: formData.pricingDeal,
        pricingMethode: formData.pricingMethode,
        pricingType: formData.pricingType?.trim() || null,
        rentalPeriod: formData.rentalPeriod?.trim() || null,
        securityDeposit: formData.securityDeposit !== "" && formData.securityDeposit !== undefined ? Number(formData.securityDeposit) : null,
        discount: formData.discount !== "" && formData.discount !== undefined ? Number(formData.discount) : null,
        descriptionPaiement: formData.descriptionPaiement?.trim(),
        country: formData.country?.trim(),
        state: formData.state?.trim(),
        city: formData.city?.trim(),
        adress: formData.adress?.trim(),
        latitude: formData.latitude !== "" && formData.latitude !== undefined ? String(formData.latitude) : null,
        longitude: formData.longitude !== "" && formData.longitude !== undefined ? String(formData.longitude) : null,
        availableStatus: formData.availableStatus,
        availableDate: formData.availableDate?.trim() || null,
        videoLink: formData.videoLink?.trim() || null,
        description: formData.description?.trim(),
      };

      const payload: Record<string, any> = {
        ...(property || {}),
        ...formData,
        property: updatedPropertyObj,
        ...updatedPropertyObj,
      };

      delete payload.id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.user;

      await updateProperty(id, payload);
      await fetchPropertyData();

      toast.success("Property saved successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Failed to update property:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update property.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    const toastId = toast.loading("Deleting property...");
    try {
      await deleteProperty(id);
      toast.success("Property deleted!", { id: toastId });
      router.push(`/${locale}/properties`);
    } catch (err: any) {
      toast.error("Failed to delete property.", { id: toastId });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setUploading(true);
    const toastId = toast.loading("Uploading image(s)...");
    try {
      await uploadPropertyImages(id, formData);
      toast.success("Image(s) uploaded!", { id: toastId });
      await fetchPropertyData();
    } catch (err: any) {
      toast.error("Failed to upload image(s).", { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSetMainImage = async (imageId: string) => {
    const toastId = toast.loading("Setting main photo...");
    try {
      const targetItem = rawImages.find(
        (img: any) => String(img.id) === String(imageId) || img.url === imageId
      );
      const effectiveId = targetItem?.id || imageId;

      await updatePropertyMainImage(id, effectiveId);
      toast.success("Main photo updated!", { id: toastId });
      await fetchPropertyData();
    } catch (err: any) {
      console.error("Failed to set main photo:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to set main photo.", { id: toastId });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Delete this photo?")) return;
    const toastId = toast.loading("Deleting photo...");
    try {
      await deletePropertyImage(imageId);
      toast.success("Photo deleted!", { id: toastId });
      await fetchPropertyData();
    } catch (err: any) {
      toast.error("Failed to delete photo.", { id: toastId });
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

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center bg-card border border-border/80 p-12 rounded-xl text-center shadow-xs min-h-[350px] my-6">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Property Not Found</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6 font-medium">
          {error || `Unable to locate property details for ID: ${id}`}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border bg-card text-foreground font-bold text-sm hover:bg-muted/30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Properties</span>
          </Link>
          <Button onClick={fetchPropertyData} variant="outline" className="h-10 px-4 font-bold text-sm gap-1.5 cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  // Photos extraction
  const propObj = (property as any)?.property || property;
  const rawMainImage = typeof propObj.mainImage === "string" ? propObj.mainImage : propObj.mainImage?.url || property.mainImage;
  const rawImagesList = propObj.images || property.images || [];
  const rawImages = rawImagesList.map((img: any) =>
    typeof img === "string" ? { id: img, url: img } : { id: String(img.id || img.public_id), url: img.url || img.secure_url }
  );
  const mainPhotoUrl = typeof rawMainImage === "string" ? rawMainImage : rawImages[0]?.url || null;

  // Watch current amenities state for AmenityGroup rendering
  const watchedFormValues = watch();

  return (
    <div className="space-y-6 pb-16">
      {/* Refactored Header Component */}
      <PropertyDetailHeader
        id={id}
        locale={locale}
        propertyName={propertyName || ""}
        category={category || ""}
        price={price || 0}
        saving={saving}
        onDelete={handleDeleteProperty}
        onSave={handleSubmit(onSubmit)}
      />

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo Gallery & Seller Contact Card */}
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
          <PropertySellerCard user={property.user} />
        </div>

        {/* Right Column: React Hook Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Basic Specifications */}
            <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-yashomePink" />
                <span>Basic Specifications & Attributes</span>
              </h2>

              <FormInput
                label="Property Name / Title"
                required
                {...register("propertyName")}
                error={errors.propertyName?.message}
                placeholder="Property title..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Listing Type"
                  {...register("propertyType")}
                  error={errors.propertyType?.message}
                  options={[
                    { value: "VENTE", label: "For Sale (Vente)" },
                    { value: "LOCATION", label: "For Rent (Location)" },
                  ]}
                />
                <FormInput
                  label="Category"
                  {...register("category")}
                  error={errors.category?.message}
                  placeholder="e.g. Appartement, Villa..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Price (DZD)" type="number" {...register("price")} error={errors.price?.message} placeholder="e.g. 155" />
                <FormInput label="Surface (m²)" type="number" {...register("surface")} error={errors.surface?.message} placeholder="e.g. 120" />
                <FormInput label="Floor (Étage)" type="number" {...register("propertyEtage")} error={errors.propertyEtage?.message} placeholder="e.g. 11" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Bedrooms / Beds" type="number" {...register("beds")} error={errors.beds?.message} placeholder="e.g. 2" />
                <FormInput label="Apartments Count" type="number" {...register("apartmentsNumber")} error={errors.apartmentsNumber?.message} placeholder="e.g. 1" />
                <FormInput label="Max Capacity" type="number" {...register("capaciteMax")} error={errors.capaciteMax?.message} placeholder="e.g. 4" />
              </div>
            </div>

            {/* Section 2: Pricing & Financial Terms */}
            <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yashomePink" />
                <span>Financial & Pricing Terms</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Pricing Deal" {...register("pricingDeal")} error={errors.pricingDeal?.message} placeholder="e.g. fixed" />
                <FormInput label="Pricing Method" {...register("pricingMethode")} error={errors.pricingMethode?.message} placeholder="e.g. total" />
                <FormInput label="Rental Period" {...register("rentalPeriod")} error={errors.rentalPeriod?.message} placeholder="e.g. 1 year" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Security Deposit" type="number" {...register("securityDeposit")} error={errors.securityDeposit?.message} placeholder="Deposit amount..." />
                <FormInput label="Discount" type="number" {...register("discount")} error={errors.discount?.message} placeholder="Discount amount..." />
              </div>

              <FormTextarea label="Payment Terms Description" rows={2} {...register("descriptionPaiement")} error={errors.descriptionPaiement?.message} placeholder="Payment conditions..." />
            </div>

            {/* Section 3: Location & Coordinates */}
            <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-yashomePink" />
                <span>Location & Geo Coordinates</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Country" {...register("country")} error={errors.country?.message} />
                <FormInput label="State / Wilaya" {...register("state")} error={errors.state?.message} placeholder="e.g. Oran" />
                <FormInput label="City / Commune" {...register("city")} error={errors.city?.message} placeholder="e.g. Bir El Djir" />
              </div>

              <FormInput label="Full Address" {...register("adress")} error={errors.adress?.message} placeholder="Full address..." />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Latitude" {...register("latitude")} error={errors.latitude?.message} placeholder="35.705670..." />
                <FormInput label="Longitude" {...register("longitude")} error={errors.longitude?.message} placeholder="-0.555521..." />
              </div>
            </div>

            {/* Section 4: Media Links & Availability */}
            <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <Video className="h-5 w-5 text-yashomePink" />
                <span>Media & Availability</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20">
                  <div>
                    <span className="text-sm font-bold text-foreground block">Listing Available</span>
                    <span className="text-xs text-muted-foreground font-medium">Toggle availability status</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("availableStatus", !availableStatus, { shouldValidate: true, shouldDirty: true })}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      availableStatus ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                    }`}
                  >
                    {availableStatus ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                  </button>
                </div>

                <FormInput label="Available Date" {...register("availableDate")} error={errors.availableDate?.message} placeholder="YYYY-MM-DD" />
              </div>

              <FormInput label="Video Tour URL" type="url" {...register("videoLink")} error={errors.videoLink?.message} placeholder="https://..." />
              <FormTextarea label="Full Description" rows={4} {...register("description")} error={errors.description?.message} placeholder="Property description..." />
            </div>

            {/* Section 5: Amenities & Features Toggles */}
            <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yashomePink" />
                <span>Property Amenities & Nearby Infrastructure</span>
              </h2>

              {AMENITIES_SECTIONS.map((sec) => (
                <AmenityGroup
                  key={sec.title}
                  title={sec.title}
                  icon={sec.icon}
                  items={sec.items}
                  gridCols={sec.gridCols}
                  amenitiesState={(watchedFormValues || {}) as unknown as Record<string, boolean>}
                  onToggle={toggleAmenity}
                />
              ))}
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="cursor-pointer bg-yashomePink text-white hover:bg-yashomePink/90 font-bold h-11 px-8 rounded-md transition-all text-sm flex items-center gap-2 shadow-md"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving All Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save All Changes</span>
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
