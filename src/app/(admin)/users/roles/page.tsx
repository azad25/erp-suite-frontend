"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UserRolesManagement from "@/components/user-management/UserRolesManagement";
import Button from "@/components/ui/button/Button";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function RolesPage() {
  const router = useRouter();
  
  usePageTitle("Roles & Permissions", "Configure user roles and access permissions");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure user roles and access permissions
          </p>
        </div>
        <Button size="sm" onClick={() => router.push("/users/roles/create")}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Role
        </Button>
      </div>
      
      <UserRolesManagement />
    </div>
  );
}