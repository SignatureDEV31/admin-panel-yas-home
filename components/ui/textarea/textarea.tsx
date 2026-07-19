"use client";

import React, { useState, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Textarea variants using class-variance-authority (matching Input)
const textareaVariants = cva(
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
        xs: "px-3 py-1.5 text-xs rounded-sm min-h-[32px]",
        sm: "px-3 py-2 text-xs rounded-sm min-h-[36px]",
        md: "px-4 py-2.5 text-sm rounded-sm min-h-[40px]",
        lg: "px-4 py-3 text-sm rounded-sm min-h-[44px]",
        xl: "px-5 py-3.5 text-base rounded-sm min-h-[48px]",
      },
      rounded: {
        default: "rounded-sm",
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-sm",
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

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rows?: number;
  maxRows?: number;
  showCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size = "sm",
      rounded,
      fullWidth = true,
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      rows = 4,
      maxRows,
      showCount = false,
      maxLength,
      autoResize = false,
      value = "",
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Determine variant based on error/success
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";

    // Auto resize logic
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const newHeight = Math.min(
          textareaRef.current.scrollHeight,
          maxRows ? maxRows * 24 : 400,
        );
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }, [internalValue, autoResize, maxRows]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (!onChange) {
        setInternalValue(newValue);
      }
      onChange?.(e);
    };

    const currentValue = onChange ? value : internalValue;
    // Convert to string for length check
    const characterCount = String(currentValue).length;

    // Label size mapping (matching Input)
    const labelSizeClasses = {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
      xl: "text-base",
    };

    return (
      <div
        className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}
      >
        {/* Label */}
        {label && (
          <div className="flex justify-between items-center">
            <label
              htmlFor={id}
              className={cn(
                "font-medium text-gray-700",
                labelSizeClasses[size || "sm"],
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Character counter */}
            {showCount && maxLength && (
              <span
                className={cn("text-gray-500", labelSizeClasses[size || "sm"])}
              >
                {characterCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        {/* Textarea wrapper with icons */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            id={id}
            value={currentValue}
            onChange={handleChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            disabled={disabled}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              textareaVariants({
                variant: finalVariant,
                size,
                rounded,
                fullWidth,
              }),
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              isFocused && "ring-2 ring-offset-0",
              autoResize && "resize-none",
              className,
            )}
            style={{
              resize: autoResize ? "none" : "vertical",
            }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
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

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
