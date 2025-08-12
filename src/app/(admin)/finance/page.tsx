"use client";

import React, { lazy, Suspense } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/performance/FastPageLoader";
import { UserIcon, CalenderIcon, DollarLineIcon, PieChartIcon, TimeIcon, BoxIcon, CheckCircleIcon, AlertIcon } from "@/icons";

// Lazy load heavy components
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));

const FinanceDashboardPage = () => {
  const financeFeatures = [
    {
      title: "Accounts",
      description: "Manage chart of accounts and ledgers",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/finance/accounts",
      color: "blue" as const,
      stats: "45 accounts",
    },
    {
      title: "Transactions",
      description: "Record and track financial transactions",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/finance/transactions",
      color: "green" as const,
      stats: "1,234 transactions",
    },
    {
      title: "Reports",
      description: "Generate financial statements and reports",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/finance/reports",
      color: "yellow" as const,
      stats: "15 reports",
    },
    {
      title: "Budgeting",
      description: "Plan and track budget allocations",
      icon: <CalenderIcon className="w-8 h-8" />,
      path: "/finance/budgeting",
      color: "purple" as const,
      stats: "8 budgets",
    },
  ];

  return (
    <DashboardLayout
      title="Finance Dashboard"
      description="Manage your financial operations and reporting"
      icon={<DollarLineIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Revenue"
            value="$2,456,780"
            icon={<DollarLineIcon />}
            color="blue"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Assets"
            value="$1,234,567"
            icon={<CheckCircleIcon />}
            color="green"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Liabilities"
            value="$567,890"
            icon={<AlertIcon />}
            color="red"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Net Worth"
            value="$1,888,457"
            icon={<PieChartIcon />}
            color="purple"
          />
        </LazyComponent>
      </div>

      {/* Finance Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financeFeatures.map((feature, index) => (
          <LazyComponent key={index} fallback={<ComponentSkeleton height="h-32" />}>
            <LazyFeatureCard
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

export default FinanceDashboardPage; 