"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="p-5 h-28 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-16" />
          </Card>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-16 rounded-xl border border-border bg-card p-4 flex items-center justify-between">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Table Skeletons */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
