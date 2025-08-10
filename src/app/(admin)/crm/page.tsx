"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import FeatureCard from "@/components/common/FeatureCard";
import { UserIcon, CalenderIcon, DollarLineIcon, PieChartIcon, TimeIcon, BoxIcon, ChatIcon, MailIcon } from "@/icons";

const CRMDashboardPage = () => {
  const crmFeatures = [
    {
      title: "Leads",
      description: "Manage and track potential customers",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/crm/leads",
      color: "blue" as const,
      stats: "89 active leads",
    },
    {
      title: "Customers",
      description: "Manage customer relationships and data",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/crm/customers",
      color: "green" as const,
      stats: "234 customers",
    },
    {
      title: "Opportunities",
      description: "Track sales opportunities and deals",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/crm/opportunities",
      color: "yellow" as const,
      stats: "45 opportunities",
    },
    {
      title: "Reports",
      description: "Analyze sales performance and trends",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/crm/reports",
      color: "purple" as const,
      stats: "12 reports",
    },
  ];

  return (
    <DashboardLayout
      title="CRM Dashboard"
      description="Manage customer relationships and sales pipeline"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Leads"
          value="89"
          icon={<UserIcon />}
          color="blue"
        />
        <StatsCard
          title="Pipeline Value"
          value="$234,500"
          icon={<DollarLineIcon />}
          color="green"
        />
        <StatsCard
          title="Open Opportunities"
          value="12"
          icon={<CalenderIcon />}
          color="yellow"
        />
        <StatsCard
          title="Total Customers"
          value="234"
          icon={<UserIcon />}
          color="purple"
        />
      </div>

      {/* CRM Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crmFeatures.map((feature, index) => (
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

export default CRMDashboardPage; 