"use client";

import React from "react";
import { X } from "lucide-react";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function UserDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: UserDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-card border border-border/80 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
