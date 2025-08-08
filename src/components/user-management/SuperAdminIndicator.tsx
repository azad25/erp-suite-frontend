"use client";
import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import Badge from "@/components/ui/badge/Badge";

export default function SuperAdminIndicator() {
  const { isAppAdmin, loading } = useUserRole();

  if (loading || !isAppAdmin) {
    return null;
  }

  return (
    <div className="p-4 border border-blue-200 rounded-2xl bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Super Admin View
            </h4>
            <Badge color="info" size="sm">
              All Organizations
            </Badge>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You are viewing activity logs from all organizations across the system.
          </p>
        </div>
      </div>
    </div>
  );
}