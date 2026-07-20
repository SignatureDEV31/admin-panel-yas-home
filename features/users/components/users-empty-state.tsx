"use client";

import React from "react";
import { Users, RotateCcw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersEmptyStateProps {
  type: "all" | "filtered";
  onClearFilters?: () => void;
  onAddUser?: () => void;
}

export function UsersEmptyState({
  type,
  onClearFilters,
  onAddUser,
}: UsersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card p-12 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        <Users className="h-7 w-7" />
      </div>

      {type === "all" ? (
        <>
          <h3 className="text-lg font-bold text-foreground">No Users Found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            There are currently no registered users in the system database. Create your first user account to get started.
          </p>
          {onAddUser && (
            <Button onClick={onAddUser} className="mt-6 cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Add First User
            </Button>
          )}
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-foreground">No Matching Results</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            No user accounts matched your search terms or filter selection. Try adjusting or resetting your filter criteria.
          </p>
          {onClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="mt-6 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          )}
        </>
      )}
    </div>
  );
}
