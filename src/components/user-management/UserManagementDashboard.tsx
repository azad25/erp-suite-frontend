"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "../ui/badge/Badge";
import { userManagementService } from "../../services/userManagement";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  recentSignups: number;
  recentLogins: number;
}

interface SecurityStats {
  failedLoginsToday: number;
  lockedAccounts: number;
  securityAlerts: number;
  twoFactorEnabled: number;
  passwordResetsToday: number;
}

interface RecentActivity {
  id: string;
  user_name: string;
  action: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export default function UserManagementDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard statistics using GraphQL
      const dashboardData = await userManagementService.getDashboardStats();
      setStats(dashboardData.userStats);
      setSecurityStats(dashboardData.securityStats);

      // Load recent activity using GraphQL
      const activityResponse = await userManagementService.getUserActivity(undefined, 5, 0);
      const formattedActivity: RecentActivity[] = activityResponse.activities.map((activity: any) => ({
        id: activity.id,
        user_name: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'Unknown User',
        action: activity.action,
        timestamp: formatTimestamp(activity.createdAt),
        status: getActivityStatus(activity.action)
      }));
      setRecentActivity(formattedActivity);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // Set fallback data for development
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
        recentSignups: 0,
        recentLogins: 0,
      });
      setSecurityStats({
        failedLoginsToday: 0,
        lockedAccounts: 0,
        securityAlerts: 0,
        twoFactorEnabled: 0,
        passwordResetsToday: 0,
      });
      setRecentActivity([]);
      setError('Failed to load dashboard data. Using fallback data.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getActivityStatus = (action: string): "success" | "warning" | "error" => {
    if (action.toLowerCase().includes('login') && action.toLowerCase().includes('success')) return 'success';
    if (action.toLowerCase().includes('failed') || action.toLowerCase().includes('error')) return 'error';
    if (action.toLowerCase().includes('password') || action.toLowerCase().includes('security')) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            User Management Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor user activities, security, and system health
          </p>
        </div>
        <div className="p-6 border border-red-200 rounded-xl bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-red-800 dark:text-red-200">
                Error Loading Dashboard
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
              <button
                onClick={loadDashboardData}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const getStatusBadge = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <Badge color="success" size="sm">Success</Badge>;
      case 'warning':
        return <Badge color="warning" size="sm">Warning</Badge>;
      case 'error':
        return <Badge color="error" size="sm">Error</Badge>;
      default:
        return <Badge color="light" size="sm">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
          User Management Overview
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor user activities, security, and system health
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Users
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {stats?.activeUsers || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active Users
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {stats?.unverifiedUsers || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {stats?.recentSignups || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                New Today
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {securityStats?.failedLoginsToday || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Failed Logins
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {securityStats?.securityAlerts || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Alerts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Link
          href="/users"
          className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors lg:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Manage Users
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View, edit, and manage user accounts
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/users/roles"
          className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors lg:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Roles & Permissions
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure user roles and access levels
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/users/organizations"
          className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors lg:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Organizations
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage organizations and their users
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/users/activity"
          className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors lg:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Activity Logs
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor user activities and security events
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Recent Activity
            </h4>
            <Link
              href="/users/activity"
              className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {activity.user_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {activity.user_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.action}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </span>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent activity to display
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}