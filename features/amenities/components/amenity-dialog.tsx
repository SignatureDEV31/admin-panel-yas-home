import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AmenityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AmenityDialog: React.FC<AmenityDialogProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      <div className="relative w-full max-w-[550px] bg-card border border-foreground/10 rounded-xl shadow-2xl flex flex-col z-10 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-muted-foreground/60 hover:text-foreground transition-all p-1.5 hover:bg-muted/20 rounded-md z-20"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Add Amenity</h2>
            <p className="text-sm text-muted-foreground/80 font-medium">
              Create a new amenity that can be assigned to properties and projects.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};
