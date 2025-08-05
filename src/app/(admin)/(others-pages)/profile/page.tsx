import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import EnhancedUserProfile from "@/components/user-management/EnhancedUserProfile";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | Unibase ERP Dashboard",
  description: "User profile management for Unibase ERP Dashboard",
};

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information and account settings
        </p>
      </div>
      
      {/* Enhanced Profile with Auth Integration */}
      <EnhancedUserProfile />
      
      {/* Original Profile Cards for Additional Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Additional Information
        </h3>
        <div className="space-y-6">
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
