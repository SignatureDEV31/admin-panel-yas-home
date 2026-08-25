"use client";

import React from "react";
import {
  MoreVertical,
  Edit2,
  UserX,
  UserCheck,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Mail,
  Phone,
  BadgeCheck,
  ShieldAlert,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { User } from "../types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminBulkActionType } from "@/services/types/admin.types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onToggleCertification?: (user: User) => void;
  onDelete: (id: string) => void;
  sortField: string | null;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  // Bulk selection props
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectUser?: (id: string, checked: boolean) => void;
  onBulkAction?: (action: AdminBulkActionType, value?: string) => void;
  isBulkActing?: boolean;
}

export function UsersTable({
  users,
  onEdit,
  onToggleStatus,
  onToggleCertification,
  onDelete,
  sortField,
  sortOrder,
  onSort,
  selectedIds = [],
  onSelectAll,
  onSelectUser,
  onBulkAction,
  isBulkActing = false,
}: UsersTableProps) {
  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const isSomeSelected = selectedIds.length > 0 && !allSelected;

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "promoter":
        return "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20";
      case "agence":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "regular":
      default:
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-3">
      {/* Floating / Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && onBulkAction && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>{selectedIds.length} users selected</span>
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
      )}

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border/80 text-xs font-semibold uppercase tracking-wider">
            <tr>
              {/* Checkbox All */}
              {onSelectAll && (
                <th scope="col" className="py-3.5 pl-4 pr-1 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
              )}

              <th scope="col" className="py-3.5 px-4">
                <button
                  onClick={() => onSort("fullName")}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  User Profile
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="py-3.5 px-4">
                Contact Details
              </th>
              <th scope="col" className="py-3.5 px-4">
                <button
                  onClick={() => onSort("role")}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  Role
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="py-3.5 px-4">
                Certification
              </th>
              <th scope="col" className="py-3.5 px-4">
                Verified
              </th>
              <th scope="col" className="py-3.5 px-4">
                <button
                  onClick={() => onSort("createdAt")}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  Joined Date
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-medium">
            {users.map((user) => {
              const userId = user.id || user._id || "";
              const isSelected = selectedIds.includes(userId);
              const isCertified = !!user.profile?.certify;

              return (
                <tr
                  key={userId}
                  className={`hover:bg-muted/30 transition-colors ${
                    isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  {onSelectUser && (
                    <td className="py-4 pl-4 pr-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectUser(userId, e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                  )}

                  {/* User Profile Info */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                        {getInitials(user.fullName || user.profile?.raison_social || "")}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          {user.fullName || "Unnamed User"}
                          {isCertified && (
                            <span title="Certified Profile">
                              <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                            </span>
                          )}
                        </span>
                        {user.profile?.raison_social && (
                          <span className="text-xs text-muted-foreground font-medium">
                            {user.profile.raison_social}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground/70">
                          {user.profile?.city ? `${user.profile.city}, Algeria` : ""}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Details */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Certification Badge / Quick Action */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {onToggleCertification ? (
                      <button
                        onClick={() => onToggleCertification(user)}
                        title={isCertified ? "Click to revoke certification" : "Click to certify"}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                          isCertified
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted"
                        }`}
                      >
                        <BadgeCheck className={`h-3.5 w-3.5 ${isCertified ? "text-emerald-500" : "text-muted-foreground/50"}`} />
                        <span>{isCertified ? "Certified" : "Standard"}</span>
                      </button>
                    ) : (
                      <Badge variant={isCertified ? "default" : "outline"}>
                        {isCertified ? "Certified" : "Standard"}
                      </Badge>
                    )}
                  </td>

                  {/* Verified */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <XCircle className="h-4 w-4 text-muted-foreground/60" />
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="cursor-pointer text-xs"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>

                        {onToggleCertification && (
                          <DropdownMenuItem
                            onClick={() => onToggleCertification(user)}
                            className="cursor-pointer text-xs"
                          >
                            <BadgeCheck className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                            {isCertified ? "Revoke Certification" : "Certify Profile"}
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onDelete(userId)}
                          className="cursor-pointer text-xs text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
