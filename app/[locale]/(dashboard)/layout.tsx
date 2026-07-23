"use client";

import React from "react";
import { DashboardLayoutWrapper } from "@/components/layout/dash-layout";
import { ProtectedRoute } from "@/features/auth/protected-route/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </ProtectedRoute>
  );
}
