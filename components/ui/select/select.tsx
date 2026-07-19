"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FiChevronDown, FiCheck } from "react-icons/fi";

// Select variants using class-variance-authority (matching Input)
const selectVariants = cva(
  "w-full transition-colors focus:outline-none focus:ring-2 focus:ring-main/50 focus:border-main disabled:opacity-50 disabled:cursor-not-allowed font-sans",
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

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "size">,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  success?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  emptyOption?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
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
      options,
      placeholder,
      leftIcon,
      rightIcon,
      emptyOption = "Sélectionner...",
      id,
      disabled,
      required = false,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(
      defaultValue || value || "",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Determine variant based on error/success
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";

    // Label size mapping (matching Input)
    const labelSizeClasses = {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
      xl: "text-base",
    };

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const displayLabel = selectedOption?.label || placeholder || emptyOption;

    // Filter options based on search
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Handle option select
    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      setSelectedValue(option.value);
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    };

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update value when prop changes
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
      if (e.key === "Enter" && !isOpen) {
        setIsOpen(true);
      }
      onKeyDown?.(e);
    };

    // Auto focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }, [isOpen]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "font-medium text-gray-700 font-sans",
              labelSizeClasses[size || "sm"],
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative" ref={dropdownRef}>
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              {leftIcon}
            </div>
          )}

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              selectVariants({
                variant: finalVariant,
                size,
                rounded,
                fullWidth,
              }),
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              !selectedValue && "text-gray-500",
              isOpen && "ring-2 ring-main/50 border-main",
              disabled && "bg-gray-100 cursor-not-allowed",
              "cursor-pointer text-left flex items-center justify-between",
              className,
            )}
            {...props}
          >
            <span className="truncate font-sans">{displayLabel}</span>
            <FiChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2",
                isOpen && "rotate-180",
              )}
            />
          </button>

          {/* Right Icon (overrides dropdown icon) */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              {rightIcon}
            </div>
          )}

          {/* Dropdown */}
          {isOpen && !disabled && (
            <div
              className={`
                absolute z-50 w-full mt-1 bg-white border border-[#EFEFEF] rounded-lg shadow-lg
                max-h-60 overflow-auto py-1
                ${rounded === "full" ? "rounded-lg" : ""}
              `}
            >
              {/* Search input */}
              {options.length > 5 && (
                <div className="sticky top-0 bg-white px-2 py-1.5 border-b border-[#EFEFEF]">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-3 py-1.5 text-xs border border-[#EFEFEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50 font-sans"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options list */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={`
                      w-full px-3 py-2 text-xs text-left flex items-center justify-between
                      transition-colors font-sans
                      ${
                        option.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50 cursor-pointer"
                      }
                      ${selectedValue === option.value ? "bg-main/5 text-main" : "text-gray-700"}
                    `}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <FiCheck className="w-4 h-4 text-main flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500 font-sans">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error/Success Message */}
        {error && (
          <p className="text-xs text-red-500 mt-1 font-sans">{error}</p>
        )}
        {success && !error && (
          <p className="text-xs text-green-500 mt-1 font-sans">{success}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select, selectVariants };
