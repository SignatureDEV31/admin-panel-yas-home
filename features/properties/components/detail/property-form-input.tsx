import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required, error, className = "", ...props }, ref) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        ref={ref}
        {...props}
        className={`flex h-10 w-full rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-yashomePink focus:border-yashomePink ${className}`}
      />
      {error && <span className="text-xs font-semibold text-destructive">{error}</span>}
    </div>
  )
);
FormInput.displayName = "FormInput";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <select
        ref={ref}
        {...props}
        className={`h-10 px-3.5 w-full rounded-md border border-input bg-card text-sm font-semibold text-foreground shadow-xs cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-yashomePink ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-semibold text-destructive">{error}</span>}
    </div>
  )
);
FormSelect.displayName = "FormSelect";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <textarea
        ref={ref}
        {...props}
        className={`flex w-full rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-yashomePink ${className}`}
      />
      {error && <span className="text-xs font-semibold text-destructive">{error}</span>}
    </div>
  )
);
FormTextarea.displayName = "FormTextarea";
