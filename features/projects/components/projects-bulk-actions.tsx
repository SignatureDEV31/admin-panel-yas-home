"use client";

import React from "react";
import {
  ShieldCheck,
  Globe,
  EyeOff,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminBulkActionType } from "@/services/types/admin.types";

export interface ProjectsBulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: AdminBulkActionType, value?: string) => void;
  isBulkActing?: boolean;
}

export function ProjectsBulkActions({
  selectedCount,
  onBulkAction,
  isBulkActing = false,
}: ProjectsBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <ShieldCheck className="h-4 w-4" />
        <span>{selectedCount} projects selected</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Bulk Publish */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.PUBLISH)}
          className="h-8 text-xs font-semibold cursor-pointer border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
        >
          <Globe className="h-3.5 w-3.5 mr-1" />
          Publish Online
        </Button>

        {/* Bulk Unpublish */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.UNPUBLISH)}
          className="h-8 text-xs font-semibold cursor-pointer border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
        >
          <EyeOff className="h-3.5 w-3.5 mr-1" />
          Unpublish / Draft
        </Button>

        {/* Bulk Delete */}
        <Button
          size="sm"
          variant="destructive"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.DELETE)}
          className="h-8 text-xs font-semibold cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
