"use client";

import React from "react";
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UsersStatsProps {
  stats: {
    total: number;
    activeCount: number;
    suspendedCount: number;
    regularCount: number;
    agencyCount: number;
    promoterCount: number;
    adminCount: number;
  };
}

export function UsersStats({ stats }: UsersStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card className="border-border/60 bg-card shadow-xs transition-all hover:border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Users
            </span>
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.total}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Registered platform user profiles
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Accounts */}
      <Card className="border-border/60 bg-card shadow-xs transition-all hover:border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Users
            </span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.activeCount}
            </span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              Enabled & active accounts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Suspended Accounts */}
      <Card className="border-border/60 bg-card shadow-xs transition-all hover:border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suspended
            </span>
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <UserX className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.suspendedCount}
            </span>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
              Access restricted/suspended
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Roles Breakdown */}
      <Card className="border-border/60 bg-card shadow-xs transition-all hover:border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Roles Breakdown
            </span>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{stats.regularCount}</span>
              <span className="text-muted-foreground">Regular</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{stats.agencyCount}</span>
              <span className="text-muted-foreground">Agency</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">{stats.promoterCount}</span>
              <span className="text-muted-foreground">Promoter</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
