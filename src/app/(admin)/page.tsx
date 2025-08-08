"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ChartSkeleton, CardSkeleton } from "@/components/common/PageLoader";


// Lazy load heavy components for faster initial page load
// EcommerceMetrics is a named export, so we need to destructure it
const EcommerceMetrics = dynamic(
  () => import("@/components/ecommerce/EcommerceMetrics").then(mod => ({ 
    default: mod.EcommerceMetrics 
  })),
  {
    loading: () => <CardSkeleton className="h-32" />,
    ssr: false
  }
);

// The rest are default exports
const MonthlyTarget = dynamic(
  () => import("@/components/ecommerce/MonthlyTarget"),
  {
    loading: () => <ChartSkeleton className="h-64" />,
    ssr: false
  }
);

const MonthlySalesChart = dynamic(
  () => import("@/components/ecommerce/MonthlySalesChart"),
  {
    loading: () => <ChartSkeleton className="h-80" />,
    ssr: false
  }
);

const StatisticsChart = dynamic(
  () => import("@/components/ecommerce/StatisticsChart"),
  {
    loading: () => <ChartSkeleton className="h-96" />,
    ssr: false
  }
);

const RecentOrders = dynamic(
  () => import("@/components/ecommerce/RecentOrders"),
  {
    loading: () => <CardSkeleton className="h-64" />,
    ssr: false
  }
);

const DemographicCard = dynamic(
  () => import("@/components/ecommerce/DemographicCard"),
  {
    loading: () => <ChartSkeleton className="h-64" />,
    ssr: false
  }
);

const UserManagementDashboard = dynamic(
  () => import("@/components/user-management/UserManagementDashboard"),
  {
    loading: () => <CardSkeleton className="h-64" />,
    ssr: false
  }
);

export default function Ecommerce() {
  return (
    <>
      {/* Page Header - Render immediately */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your ERP dashboard
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>

        <div className="col-span-12">
          <UserManagementDashboard />
        </div>


      </div>
    </>
  );
}
