"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ChartSkeleton, CardSkeleton } from "@/components/common/PageLoader";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent } from "@/components/performance/FastPageLoader";
import { GridIcon } from "@/icons";

// Lazy load heavy components for faster initial page load
// EcommerceMetrics is a named export, so we need to destructure it
const EcommerceMetrics = dynamic(
  () => import("@/components/ecommerce/EcommerceMetrics").then(mod => ({
    default: mod.EcommerceMetrics
  })),
  {
    loading: () => <CardSkeleton className="h-32" />
  }
);

// The rest are default exports
const MonthlyTarget = dynamic(
  () => import("@/components/ecommerce/MonthlyTarget"),
  {
    loading: () => <ChartSkeleton className="h-64" />
  }
);

const MonthlySalesChart = dynamic(
  () => import("@/components/ecommerce/MonthlySalesChart"),
  {
    loading: () => <ChartSkeleton className="h-80" />
  }
);

const StatisticsChart = dynamic(
  () => import("@/components/ecommerce/StatisticsChart"),
  {
    loading: () => <ChartSkeleton className="h-96" />
  }
);

const RecentOrders = dynamic(
  () => import("@/components/ecommerce/RecentOrders"),
  {
    loading: () => <CardSkeleton className="h-64" />
  }
);

const DemographicCard = dynamic(
  () => import("@/components/ecommerce/DemographicCard"),
  {
    loading: () => <CardSkeleton className="h-64" />
  }
);

const UserManagementDashboard = dynamic(
  () => import("@/components/user-management/UserManagementDashboard"),
  {
    loading: () => <CardSkeleton className="h-64" />
  }
);

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Dashboard Overview"
      description="Welcome to your ERP dashboard - Monitor your business performance"
      icon={<GridIcon />}
    >
      {/* Dashboard Content */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <LazyComponent fallback={<CardSkeleton className="h-32" />}>
            <EcommerceMetrics />
          </LazyComponent>
          <LazyComponent fallback={<ChartSkeleton className="h-80" />}>
            <MonthlySalesChart />
          </LazyComponent>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <LazyComponent fallback={<ChartSkeleton className="h-64" />}>
            <MonthlyTarget />
          </LazyComponent>
        </div>

        <div className="col-span-12">
          <LazyComponent fallback={<ChartSkeleton className="h-96" />}>
            <StatisticsChart />
          </LazyComponent>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <LazyComponent fallback={<CardSkeleton className="h-64" />}>
            <DemographicCard />
          </LazyComponent>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <LazyComponent fallback={<CardSkeleton className="h-64" />}>
            <RecentOrders />
          </LazyComponent>
        </div>

        <div className="col-span-12">
          <LazyComponent fallback={<CardSkeleton className="h-64" />}>
            <UserManagementDashboard />
          </LazyComponent>
        </div>
      </div>
    </DashboardLayout>
  );
} 