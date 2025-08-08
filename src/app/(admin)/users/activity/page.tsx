import UserActivityLog from "@/components/user-management/UserActivityLog";
import { Metadata } from "next";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import ActivitySummaryWidget from "@/components/user-management/ActivitySummaryWidget";
import SuperAdminIndicator from "@/components/user-management/SuperAdminIndicator";
import RealtimeSecuritySnackbar from "@/components/security/RealtimeSecuritySnackbar";

export const metadata: Metadata = {
  title: "Activity Logs | Unibase ERP Dashboard",
  description: "Monitor user activities and system interactions across your organization",
};

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Activity Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor user activities and system interactions across your organization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="all">All Activities</option>
            <option value="login">Login Events</option>
            <option value="security">Security Events</option>
            <option value="user_management">User Management</option>
          </select>

          <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Super Admin Indicator */}
      <SuperAdminIndicator />

      {/* Activity Summary */}
      <ActivitySummaryWidget />

      <RealtimeSecuritySnackbar />

      {/* Activity Log Component */}
      <UserActivityLog limit={20} />

      {/* Export Options */}
      <div className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] lg:p-6">
        <div>
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-1">
            Export Activity Logs
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Download activity logs for compliance and audit purposes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
            Export CSV
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}