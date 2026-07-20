"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  onAddClick: () => void;
}

export function UsersHeader({ onAddClick }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Users Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage user accounts, roles, access permissions, and account statuses.
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 cursor-pointer shadow-xs font-medium"
      >
        <UserPlus className="h-4 w-4" />
        <span>Add User</span>
      </Button>
    </div>
  );
}
