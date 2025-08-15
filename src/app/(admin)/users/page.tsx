"use client";

import React, { lazy, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LazyComponent, ComponentSkeleton } from "@/components/common/LazyWrapper";
import { usePageTitle } from "@/hooks/usePageTitle";
import Button from "@/components/ui/button/Button";
import { userManagementService } from "@/services/userManagement";
import { Card } from "@/components/ui/card/Card";

// Lazy load heavy components
const LazyUserManagementDashboard = lazy(() => import("@/components/user-management/UserManagementDashboard"));
const LazyUserListTable = lazy(() => import("@/components/user-management/UserListTable"));

const UsersPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    userRoles: 0,
    lastLogin: "Never"
  });
  const [loading, setLoading] = useState(true);

  usePageTitle("User Management", "Manage system users, roles, and permissions");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await userManagementService.getDashboardStats();
      setStats({
        totalUsers: dashboardStats.userStats?.totalUsers || 0,
        activeUsers: dashboardStats.userStats?.activeUsers || 0,
        userRoles: dashboardStats.userStats?.totalRoles || 0,
        lastLogin: dashboardStats.userStats?.lastLogin || "Never"
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.push("/users/roles")} 
            variant="outline"
            size="sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Manage Roles
          </Button>
          <Button 
            onClick={() => router.push("/users/create")}
            size="sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {loading ? "..." : stats.totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {loading ? "..." : stats.activeUsers}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User Roles</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {loading ? "..." : stats.userRoles}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                {loading ? "..." : stats.lastLogin}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* User List Table */}
      <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
        <LazyUserListTable />
      </LazyComponent>

      {/* User Management Dashboard */}
      <LazyComponent fallback={<ComponentSkeleton height="h-96" />}>
        <LazyUserManagementDashboard />
      </LazyComponent>
    </div>
  );
};

export default UsersPage;