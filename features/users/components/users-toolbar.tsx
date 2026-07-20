"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button";

interface UsersToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  resultsCount: number;
  onResetFilters: () => void;
}

export function UsersToolbar({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
  resultsCount,
  onResetFilters,
}: UsersToolbarProps) {
  const isFiltered = searchQuery !== "" || selectedRole !== "all" || selectedStatus !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border/80 shadow-xs">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background h-10 text-sm"
          />
        </div>

        {/* Role Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 hidden lg:inline-flex">
            <Filter className="h-3.5 w-3.5" /> Role:
          </span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="regular">Regular</option>
            <option value="agence">Agency (Agence)</option>
            <option value="promoter">Promoter</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 hidden lg:inline-flex">
            Status:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground font-medium">
        Showing <span className="text-foreground font-bold">{resultsCount}</span> users
      </div>
    </div>
  );
}
