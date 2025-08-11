"use client";

import React, { Suspense, lazy } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/performance/FastPageLoader";
import { UserIcon, LockIcon, TimeIcon, CheckCircleIcon } from "@/icons";

// Lazy load heavy components
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyUserManagementDashboard = lazy(() => import("@/components/user-management/UserManagementDashboard"));
const LazyUserListTable = lazy(() => import("@/components/user-management/UserListTable"));

const UsersPage = () => {
  return (
    <DashboardLayout
      title="User Management"
      description="Manage system users, roles, and permissions"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Users"
            value="156"
            icon={<UserIcon />}
            color="blue"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Active Users"
            value="142"
            icon={<CheckCircleIcon />}
            color="green"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="User Roles"
            value="8"
            icon={<LockIcon />}
            color="purple"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Last Login"
            value="2 min ago"
            icon={<TimeIcon />}
            color="yellow"
          />
        </LazyComponent>
      </div>

      {/* User List Table */}
      <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
        <LazyUserListTable />
      </LazyComponent>

      {/* User Management Dashboard */}
      <LazyComponent fallback={<ComponentSkeleton height="h-96" />}>
        <LazyUserManagementDashboard />
      </LazyComponent>
    </DashboardLayout>
  );
};

export default UsersPage;