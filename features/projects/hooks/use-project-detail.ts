"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { projectSchema, ProjectFormData } from "../schemas/project.schema";

export function useProjectDetail(id: string, locale: string = "fr") {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProjectFormData>({
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

  const fetchProjectData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectById(id);
      setProject(data);

      const pObj = (data as any)?.project || data;
      const pStatus = (pObj.projectStatus || "UNDER_CONSTRUCTION").toUpperCase();
      const validStatus =
        pStatus === "FINISHED" || pStatus === "ANNOUNCEMENT" ? pStatus : "UNDER_CONSTRUCTION";

      form.reset({
        title: pObj.title || pObj.propertyName || "",
        projectStatus: validStatus as any,
        price: pObj.price ? String(pObj.price) : "",
        surface: pObj.surface ? String(pObj.surface) : "",
        category: typeof pObj.category === "string" ? pObj.category : pObj.category?.name || "Residence Complex",
        state: pObj.state || pObj.wilaya || "Oran",
        city: pObj.city || "",
        address: pObj.address || pObj.adress || "",
        description: pObj.description || "",
      });
    } catch (err: any) {
      console.error(`Failed to fetch project ${id}:`, err);
      setError(err?.response?.data?.message || err?.message || `Failed to load project ID #${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const handleSaveChanges = async (formData: ProjectFormData) => {
    setSaving(true);
    const toastId = toast.loading("Saving project updates...");
    try {
      const payload = {
        title: formData.title.trim(),
        projectStatus: formData.projectStatus,
        price: formData.price !== "" && formData.price !== undefined ? Number(formData.price) : undefined,
        surface: formData.surface !== "" && formData.surface !== undefined ? Number(formData.surface) : undefined,
        category: formData.category?.trim() || undefined,
        state: formData.state?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        description: formData.description?.trim() || undefined,
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

  return {
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
  };
}
