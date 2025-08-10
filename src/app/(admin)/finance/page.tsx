"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import FeatureCard from "@/components/common/FeatureCard";
import { UserIcon, CalenderIcon, DollarLineIcon, PieChartIcon, TimeIcon, BoxIcon, CheckCircleIcon, AlertIcon } from "@/icons";

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
        <StatsCard
          title="Total Revenue"
          value="$2,456,780"
          icon={<DollarLineIcon />}
          color="blue"
        />
        <StatsCard
          title="Total Assets"
          value="$1,234,567"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Total Liabilities"
          value="$567,890"
          icon={<AlertIcon />}
          color="red"
        />
        <StatsCard
          title="Net Worth"
          value="$1,888,457"
          icon={<PieChartIcon />}
          color="purple"
        />
      </div>

      {/* Finance Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financeFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            path={feature.path}
            color={feature.color}
            stats={feature.stats}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default FinanceDashboardPage; 