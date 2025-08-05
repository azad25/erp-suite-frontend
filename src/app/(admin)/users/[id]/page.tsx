import UserPermissions from "@/components/user-management/UserPermissions";
import UserActivityLog from "@/components/user-management/UserActivityLog";
import UserSecuritySettings from "@/components/user-management/UserSecuritySettings";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "User Details | Unibase ERP Dashboard",
  description: "View and manage detailed user information, permissions, and security settings",
};

interface UserDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            User Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user information, permissions, and security settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Edit User
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete User
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="grid grid-cols-1 gap-6">
        <UserMetaCard />
        <UserInfoCard />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-brand-500 py-2 px-1 text-sm font-medium text-brand-600 dark:text-brand-400">
            Permissions
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
            Security
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
            Activity Log
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <UserPermissions userId={id} />
        <UserSecuritySettings userId={id} />
        <UserActivityLog userId={id} />
      </div>
    </div>
  );
}