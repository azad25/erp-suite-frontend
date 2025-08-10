"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import FeatureCard from "@/components/common/FeatureCard";
import { BoxIcon, PieChartIcon, TimeIcon, UserIcon, DollarLineIcon } from "@/icons";

const InventoryDashboardPage = () => {
  const inventoryFeatures = [
    {
      title: "Products/Services",
      description: "Manage your product catalog and services",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/inventory/products",
      color: "blue" as const,
    },
    {
      title: "Warehouses",
      description: "Organize and manage storage locations",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/inventory/warehouses",
      color: "green" as const,
    },
    {
      title: "Stock Levels",
      description: "Monitor inventory quantities and alerts",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/inventory/stock-levels",
      color: "yellow" as const,
    },
    {
      title: "Stock Movements",
      description: "Track inventory transactions and movements",
      icon: <TimeIcon className="w-8 h-8" />,
      path: "/inventory/movements",
      color: "purple" as const,
    },
    {
      title: "Inventory Reports",
      description: "Generate comprehensive inventory reports",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/inventory/reports",
      color: "red" as const,
    },
  ];

  return (
    <DashboardLayout
      title="Inventory Dashboard"
      description="Manage your inventory and track stock levels"
      icon={<BoxIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value="1,247"
          icon={<BoxIcon />}
          color="blue"
        />
        <StatsCard
          title="Low Stock Items"
          value="23"
          icon={<PieChartIcon />}
          color="red"
        />
        <StatsCard
          title="Total Value"
          value="$2.5M"
          icon={<DollarLineIcon />}
          color="green"
        />
        <StatsCard
          title="Warehouses"
          value="8"
          icon={<UserIcon />}
          color="purple"
        />
      </div>

      {/* Inventory Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryFeatures.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            path={feature.path}
            color={feature.color}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default InventoryDashboardPage; 