"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import FeatureCard from "@/components/common/FeatureCard";
import { DollarLineIcon, PieChartIcon, BoxIcon, TimeIcon, UserIcon } from "@/icons";

const SalesDashboardPage = () => {
  const salesFeatures = [
    {
      title: "Leads",
      description: "Manage and track potential customers",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/sales/leads",
      color: "blue" as const,
      stats: "45 active leads",
    },
    {
      title: "Opportunities",
      description: "Track sales opportunities and deals",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/sales/opportunities",
      color: "green" as const,
      stats: "23 open opportunities",
    },
    {
      title: "Quotations",
      description: "Create and manage sales quotations",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/sales/quotations",
      color: "yellow" as const,
      stats: "67 quotations",
    },
    {
      title: "Invoices",
      description: "Generate and track sales invoices",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/sales/invoices",
      color: "purple" as const,
      stats: "89 invoices",
    },
    {
      title: "Payments",
      description: "Track customer payments and receipts",
      icon: <TimeIcon className="w-8 h-8" />,
      path: "/sales/payments",
      color: "indigo" as const,
      stats: "156 payments",
    },
    {
      title: "Sales Reports",
      description: "Analyze sales performance and trends",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/sales/reports",
      color: "red" as const,
      stats: "12 reports",
    },
  ];

  return (
    <DashboardLayout
      title="Sales Dashboard"
      description="Manage your sales pipeline and track performance metrics"
      icon={<DollarLineIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sales"
          value="$89,430"
          icon={<DollarLineIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Leads"
          value="45"
          icon={<UserIcon />}
          color="green"
        />
        <StatsCard
          title="Open Opportunities"
          value="23"
          icon={<DollarLineIcon />}
          color="yellow"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$12,450"
          icon={<PieChartIcon />}
          color="purple"
        />
      </div>

      {/* Sales Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesFeatures.map((feature, index) => (
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

export default SalesDashboardPage; 