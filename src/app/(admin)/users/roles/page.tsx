import UserRolesManagement from "@/components/user-management/UserRolesManagement";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Roles & Permissions | Unibase ERP Dashboard",
  description: "Manage user roles and permissions for your organization",
};

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Roles & Permissions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure user roles and access permissions
        </p>
      </div>
      
      <UserRolesManagement />
    </div>
  );
}