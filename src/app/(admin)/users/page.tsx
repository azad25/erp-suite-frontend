"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import UserManagementDashboard from "@/components/user-management/UserManagementDashboard";
import { UserIcon, LockIcon, TimeIcon, CheckCircleIcon } from "@/icons";

const UsersPage = () => {
  return (
    <DashboardLayout
      title="User Management"
      description="Manage system users, roles, and permissions"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Users"
          value="156"
          icon={<UserIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value="142"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="User Roles"
          value="8"
          icon={<LockIcon />}
          color="purple"
        />
        <StatsCard
          title="Last Login"
          value="2 min ago"
          icon={<TimeIcon />}
          color="yellow"
        />
      </div>

      {/* User Management Dashboard */}
      <UserManagementDashboard />
    </DashboardLayout>
  );
};

export default UsersPage;