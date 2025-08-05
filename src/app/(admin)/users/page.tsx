import UserListTable from "@/components/user-management/UserListTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "User Management | Unibase ERP Dashboard",
  description: "Manage users, permissions, and access controls for your organization",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          User Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage users, roles, and permissions across your organization
        </p>
      </div>
      
      <UserListTable />
    </div>
  );
}