"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Mail,
  Phone,
  BadgeCheck,
} from "lucide-react";
import { User } from "../types/user";
import { UsersBulkActions } from "./users-bulk-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
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
        <UsersBulkActions
          selectedCount={selectedIds.length}
          onBulkAction={onBulkAction}
          isBulkActing={isBulkActing}
        />
      )}

      {/* Main Table */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-muted-foreground border-b border-border/80 text-xs font-semibold uppercase tracking-wider select-none">
              {/* Checkbox All */}
              {onSelectAll && (
                <TableHead className="py-3.5 pl-4 pr-1 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </TableHead>
              )}

              <TableHead className="py-3.5 px-4 font-semibold">
                <button
                  type="button"
                  onClick={() => onSort("fullName")}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  User Profile
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="py-3.5 px-4 font-semibold">
                Contact Details
              </TableHead>
              <TableHead className="py-3.5 px-4 font-semibold">
                <button
                  type="button"
                  onClick={() => onSort("role")}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  Role
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="py-3.5 px-4 font-semibold">
                Certification
              </TableHead>
              <TableHead className="py-3.5 px-4 font-semibold">
                Verified
              </TableHead>
              <TableHead className="py-3.5 px-4 font-semibold">
                <button
                  type="button"
                  onClick={() => onSort("createdAt")}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                >
                  Joined Date
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="py-3.5 px-4 text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60 font-medium">
            {users.map((user) => {
              const userId = user.id || user._id || "";
              const isSelected = selectedIds.includes(userId);
              const isCertified = !!user.profile?.certify;

              return (
                <TableRow
                  key={userId}
                  className={`hover:bg-muted/30 transition-colors ${
                    isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                  }`}
                >
                  {/* Row Checkbox */}
                  {onSelectUser && (
                    <TableCell className="py-4 pl-4 pr-1 align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectUser(userId, e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                    </TableCell>
                  )}

                  {/* User Profile Info */}
                  <TableCell className="py-4 px-4 whitespace-nowrap align-middle">
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
                  </TableCell>

                  {/* Contact Details */}
                  <TableCell className="py-4 px-4 whitespace-nowrap align-middle">
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
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-4 px-4 whitespace-nowrap align-middle">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </TableCell>

                  {/* Certification Badge / Quick Action */}
                  <TableCell className="py-4 px-4 whitespace-nowrap align-middle">
                    {onToggleCertification ? (
                      <button
                        type="button"
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
                  </TableCell>

                  {/* Verified */}
                  <TableCell className="py-4 px-4 whitespace-nowrap align-middle">
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
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground align-middle">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="py-4 px-4 whitespace-nowrap text-right align-middle">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
