"use client";

import { Search, Filter, RotateCcw, Download, CheckCircle, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportFormat } from "@/services/types/admin.types";
import {
  userRoleOptions,
  userCertifyOptions,
  userVerifiedOptions,
} from "../data/data";

interface UsersToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  selectedCertify?: string;
  setSelectedCertify?: (val: string) => void;
  selectedVerified?: string;
  setSelectedVerified?: (val: string) => void;
  resultsCount: number;
  onResetFilters: () => void;
  onExport: (format?: ExportFormat) => void;
}

export function UsersToolbar({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedCertify = "all",
  setSelectedCertify,
  selectedVerified = "all",
  setSelectedVerified,
  resultsCount,
  onResetFilters,
  onExport,
}: UsersToolbarProps) {
  const isFiltered =
    searchQuery !== "" ||
    selectedRole !== "all" ||
    selectedCertify !== "all" ||
    selectedVerified !== "all";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-card p-4 rounded-xl border border-border/80 shadow-xs">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search Box */}
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground/60" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="pl-9 pr-8 h-10 w-full rounded-lg border border-input bg-background text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground/60 hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Role Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline-flex items-center gap-1">
            <Filter className="h-3 w-3" /> Role:
          </span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {userRoleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Certification Filter */}
        {setSelectedCertify && (
          <div className="flex items-center gap-1.5">
            <select
              value={selectedCertify}
              onChange={(e) => setSelectedCertify(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {userCertifyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Email Verification Filter */}
        {setSelectedVerified && (
          <div className="flex items-center gap-1.5">
            <select
              value={selectedVerified}
              onChange={(e) => setSelectedVerified(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {userVerifiedOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

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

      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
        <div className="text-xs text-muted-foreground font-medium">
          Total: <span className="text-foreground font-bold">{resultsCount}</span>
        </div>

        {/* Export Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs font-semibold cursor-pointer border-border/80 hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => onExport(ExportFormat.CSV)}
              className="cursor-pointer text-xs font-medium"
            >
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport(ExportFormat.JSON)}
              className="cursor-pointer text-xs font-medium"
            >
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
