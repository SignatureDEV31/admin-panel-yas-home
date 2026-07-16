import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const AmenitiesLoading: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none pointer-events-none">
      {/* KPI Cards Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border/80 rounded-xl p-5 h-36 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 bg-muted" />
              <Skeleton className="h-6 w-6 rounded-full bg-muted" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-16 bg-muted" />
              <Skeleton className="h-3 w-40 bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Skeletons */}
      <div className="flex flex-col gap-4 border border-border/80 bg-card p-4 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <Skeleton className="h-9 w-full max-w-md bg-muted rounded-md" />
            <Skeleton className="h-9 w-full sm:w-48 bg-muted rounded-md" />
          </div>
          <Skeleton className="h-9 w-full sm:w-44 bg-muted rounded-md" />
        </div>
        <div className="pt-1 border-t border-border/40 flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
        </div>
      </div>

      {/* Table Skeletons */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/5">
          <Skeleton className="h-4 w-32 bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
        </div>
        <div className="divide-y divide-border/50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg bg-muted shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 bg-muted" />
                  <Skeleton className="h-3 w-20 bg-muted" />
                </div>
              </div>
              <Skeleton className="h-5 w-24 bg-muted hidden sm:block" />
              <Skeleton className="h-5 w-20 bg-muted" />
              <Skeleton className="h-4 w-12 bg-muted hidden md:block" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
