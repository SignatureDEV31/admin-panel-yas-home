import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectsLoading: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none pointer-events-none">
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
                  <Skeleton className="h-4 w-44 bg-muted" />
                  <Skeleton className="h-3 w-24 bg-muted" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 bg-muted" />
              <Skeleton className="h-5 w-28 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
