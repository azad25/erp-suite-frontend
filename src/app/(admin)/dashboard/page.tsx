"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ChartSkeleton, CardSkeleton } from "@/components/common/PageLoader";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent } from "@/components/common/LazyWrapper";
import { GridIcon } from "@/icons";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t, language } = useTranslation();

  usePageTitle(t('dashboard.title'), t('dashboard.welcome'));

  // Debug logging
  console.log('Dashboard render - Current language:', language);
  console.log('Dashboard render - Title translation:', t('dashboard.title'));
  console.log('Dashboard render - Welcome translation:', t('dashboard.welcome'));

  return (
    <DashboardLayout
      title={t('dashboard.title')}
      description={t('dashboard.welcome')}
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