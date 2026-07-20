"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../types/user";
import { userFormSchema, UserFormData } from "../schemas/user.schema";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button";

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UserForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      role: (initialData?.role as any) || "regular",
      status: (initialData?.status as any) || "active",
      emailVerified: initialData?.emailVerified ?? false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        role: (initialData.role as any) || "regular",
        status: (initialData.status as any) || "active",
        emailVerified: initialData.emailVerified ?? false,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "regular",
        status: "active",
        emailVerified: false,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<UserFormData> = (data) => {
    return onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Full Name <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          placeholder="e.g. Imad Lallali"
          {...register("fullName")}
          className="bg-background"
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Email Address <span className="text-destructive">*</span>
        </label>
        <Input
          type="email"
          placeholder="user@example.com"
          {...register("email")}
          className="bg-background"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Phone Number</label>
        <Input
          type="text"
          placeholder="+213 555 123 456"
          {...register("phoneNumber")}
          className="bg-background"
        />
        {errors.phoneNumber && (
          <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Role & Status Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Role</label>
          <select
            {...register("role")}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="regular">Regular</option>
            <option value="agence">Agency (Agence)</option>
            <option value="promoter">Promoter</option>
            <option value="admin">Administrator</option>
          </select>
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Account Status</label>
          <select
            {...register("status")}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          {errors.status && (
            <p className="text-xs text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Email Verified Checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="emailVerified"
          {...register("emailVerified")}
          className="h-4 w-4 rounded-sm border-input text-primary focus:ring-primary cursor-pointer"
        />
        <label htmlFor="emailVerified" className="text-xs font-medium text-foreground cursor-pointer">
          Mark Email as Verified
        </label>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update User"
            : "Create User"}
        </Button>
      </div>
    </form>
  );
}
