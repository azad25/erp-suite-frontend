import UserActivityLog from "@/components/user-management/UserActivityLog";
import { Metadata } from "next";
import React from "react";
import Badge from "@/components/ui/badge/Badge";

export const metadata: Metadata = {
  title: "Activity Logs | Unibase ERP Dashboard",
  description: "Monitor user activities and system interactions across your organization",
};

interface ActivitySummary {
  total_activities: number;
  successful_logins: number;
  failed_logins: number;
  security_events: number;
}

const mockActivitySummary: ActivitySummary = {
  total_activities: 1247,
  successful_logins: 892,
  failed_logins: 23,
  security_events: 15
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

      {/* Activity Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {mockActivitySummary.total_activities.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Activities
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {mockActivitySummary.successful_logins.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Successful Logins
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {mockActivitySummary.failed_logins}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Failed Logins
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {mockActivitySummary.security_events}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Security Events
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Alerts */}
      <div className="p-5 border border-orange-200 rounded-2xl bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
              Security Alert
            </h4>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              Multiple failed login attempts detected from IP address 192.168.1.105 in the last hour.
            </p>
            <div className="flex items-center gap-2">
              <Badge color="warning" size="sm">
                High Priority
              </Badge>
              <span className="text-xs text-orange-600 dark:text-orange-400">
                2 minutes ago
              </span>
            </div>
          </div>
        </div>
      </div>

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