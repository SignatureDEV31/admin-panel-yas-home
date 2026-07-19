"use client";
import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Input variants using class-variance-authority
const inputVariants = cva(
  "w-full transition-colors focus:outline-none focus:ring-2 focus:ring-main/50 focus:border-main disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border border-[#EFEFEF] bg-white text-gray-900 placeholder-[#7C7C84]",
        error:
          "border border-red-500 bg-white text-gray-900 placeholder-[#7C7C84] focus:ring-red-500/50 focus:border-red-500",
        success:
          "border border-green-500 bg-white text-gray-900 placeholder-[#7C7C84] focus:ring-green-500/50 focus:border-green-500",
        filled:
          "border border-[#EFEFEF] bg-gray-50 text-gray-900 placeholder-[#7C7C84]",
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-full",
        sm: "h-9 px-3 text-xs rounded-full",
        md: "h-10 px-4 text-sm rounded-full",
        lg: "h-11 px-4 text-sm rounded-full",
        xl: "h-12 px-5 text-base rounded-full",
      },
      rounded: {
        default: "rounded-full",
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      rounded: "default",
      fullWidth: true,
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      fullWidth,
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      ...props
    },
    ref,
  ) => {
    // Determine variant based on error/success
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";

    return (
      <div
        className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}
      >
        {/* Label */}
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            id={id}
            ref={ref}
            disabled={disabled}
            required={required}
            className={cn(
              inputVariants({
                variant: finalVariant,
                size,
                rounded,
                fullWidth,
              }),
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className,
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error/Success Message */}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {success && !error && (
          <p className="text-xs text-green-500 mt-1">{success}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
