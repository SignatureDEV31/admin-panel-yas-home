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
} from "lucide-react";
import { User } from "../types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (id: string) => void;
  sortField: string | null;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

export function UsersTable({
  users,
  onEdit,
  onToggleStatus,
  onDelete,
  sortField,
  sortOrder,
  onSort,
}: UsersTableProps) {
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "suspended":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "pending":
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
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
    <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground border-b border-border/80 text-xs font-semibold uppercase tracking-wider">
          <tr>
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
              Status
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
            const isSuspended = user.status === "suspended";

            return (
              <tr key={userId} className="hover:bg-muted/30 transition-colors">
                {/* User Profile Info */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                      {getInitials(user.fullName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        ID: {userId.substring(0, 10)}...
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

                {/* Status */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeStyle(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
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
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => onEdit(user)}
                        className="cursor-pointer text-xs"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onToggleStatus(user)}
                        className={`cursor-pointer text-xs ${
                          isSuspended ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <UserCheck className="h-3.5 w-3.5 mr-2" />
                            Activate Account
                          </>
                        ) : (
                          <>
                            <UserX className="h-3.5 w-3.5 mr-2" />
                            Suspend Account
                          </>
                        )}
                      </DropdownMenuItem>

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
  );
}
