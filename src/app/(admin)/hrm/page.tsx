"use client";

import React, { lazy, Suspense } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/performance/FastPageLoader";
import { UserIcon, CalenderIcon, DollarLineIcon, PieChartIcon, TimeIcon, BoxIcon } from "@/icons";

// Lazy load heavy components
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));

const HRMDashboardPage = () => {
  const hrmFeatures = [
    {
      title: "Employees",
      description: "Manage employee information and records",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/hrm/employees",
      color: "blue" as const,
      stats: "156 employees",
    },
    {
      title: "Attendance",
      description: "Track employee attendance and time",
      icon: <TimeIcon className="w-8 h-8" />,
      path: "/hrm/attendance",
      color: "green" as const,
      stats: "98% present today",
    },
    {
      title: "Payroll",
      description: "Manage salaries and compensation",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/hrm/payroll",
      color: "yellow" as const,
      stats: "$45,000 this month",
    },
    {
      title: "Departments",
      description: "Organize teams and departments",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/hrm/departments",
      color: "purple" as const,
      stats: "12 departments",
    },
  ];

  return (
    <DashboardLayout
      title="HR Management Dashboard"
      description="Manage your human resources, employees, and organizational structure"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Employees"
            value="156"
            icon={<UserIcon />}
            color="blue"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Attendance Rate"
            value="98%"
            icon={<TimeIcon />}
            color="green"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Monthly Payroll"
            value="$45,000"
            icon={<DollarLineIcon />}
            color="yellow"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Departments"
            value="12"
            icon={<BoxIcon />}
            color="purple"
          />
        </LazyComponent>
      </div>

      {/* HRM Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrmFeatures.map((feature, index) => (
          <LazyComponent fallback={<ComponentSkeleton height="h-32" />}>
            <LazyFeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              color={feature.color}
              stats={feature.stats}
            />
          </LazyComponent>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default HRMDashboardPage; 