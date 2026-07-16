import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AmenityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AmenityDrawer: React.FC<AmenityDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  // Listen for Escape key to close the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent body scrolling when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop with fade-in animation */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      {/* Slide-over panel with slide-in animation */}
      <div className="relative w-full sm:w-[460px] h-full bg-card border-l border-border shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Add Amenity</h2>
            <p className="text-xs text-muted-foreground font-medium">
              Create a new amenity that can be assigned to properties and projects.
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all"
            aria-label="Close drawer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-card">
          {children}
        </div>
      </div>
    </div>
  );
};
