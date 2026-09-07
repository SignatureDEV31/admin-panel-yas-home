"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminBulkActionType } from "@/services/types/admin.types";

export interface PropertiesBulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: AdminBulkActionType, value?: string) => void;
  isBulkActing?: boolean;
}

export function PropertiesBulkActions({
  selectedCount,
  onBulkAction,
  isBulkActing = false,
}: PropertiesBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <ShieldCheck className="h-4 w-4" />
        <span>{selectedCount} properties selected</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Bulk Set Available */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.SET_AVAILABLE)}
          className="h-8 text-xs font-semibold cursor-pointer border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          Set Available
        </Button>

        {/* Bulk Set Unavailable */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.SET_UNAVAILABLE)}
          className="h-8 text-xs font-semibold cursor-pointer border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
        >
          <XCircle className="h-3.5 w-3.5 mr-1" />
          Set Unavailable
        </Button>

        {/* Bulk Restore */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.RESTORE)}
          className="h-8 text-xs font-semibold cursor-pointer border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Restore
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
          Delete / Trash Selected
        </Button>
      </div>
    </div>
  );
}
