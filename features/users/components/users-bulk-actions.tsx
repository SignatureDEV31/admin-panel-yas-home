"use client";

import React from "react";
import {
  ShieldCheck,
  BadgeCheck,
  ShieldAlert,
  CheckCircle2,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminBulkActionType } from "@/services/types/admin.types";

export interface UsersBulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: AdminBulkActionType, value?: string) => void;
  isBulkActing?: boolean;
}

export function UsersBulkActions({
  selectedCount,
  onBulkAction,
  isBulkActing = false,
}: UsersBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <ShieldCheck className="h-4 w-4" />
        <span>{selectedCount} users selected</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Bulk Certify */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.CERTIFY)}
          className="h-8 text-xs font-semibold cursor-pointer border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
        >
          <BadgeCheck className="h-3.5 w-3.5 mr-1" />
          Certify
        </Button>

        {/* Bulk Uncertify */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.UNCERTIFY)}
          className="h-8 text-xs font-semibold cursor-pointer border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
        >
          <ShieldAlert className="h-3.5 w-3.5 mr-1" />
          Revoke Certification
        </Button>

        {/* Bulk Verify Email */}
        <Button
          size="sm"
          variant="outline"
          disabled={isBulkActing}
          onClick={() => onBulkAction(AdminBulkActionType.VERIFY_EMAIL)}
          className="h-8 text-xs font-semibold cursor-pointer border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          Verify Email
        </Button>

        {/* Bulk Role Change Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isBulkActing}
              className="h-8 text-xs font-semibold cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5 mr-1" />
              Change Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onBulkAction(AdminBulkActionType.CHANGE_ROLE, "regular")}
              className="text-xs cursor-pointer"
            >
              Set as Regular
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onBulkAction(AdminBulkActionType.CHANGE_ROLE, "promoter")}
              className="text-xs cursor-pointer"
            >
              Set as Promoter
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onBulkAction(AdminBulkActionType.CHANGE_ROLE, "agence")}
              className="text-xs cursor-pointer"
            >
              Set as Agency
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onBulkAction(AdminBulkActionType.CHANGE_ROLE, "admin")}
              className="text-xs cursor-pointer text-destructive"
            >
              Set as Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
