"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import FeatureCard from "@/components/common/FeatureCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { BoxIcon, DollarLineIcon, PieChartIcon, TimeIcon, UserIcon, PlusIcon, CheckCircleIcon } from "@/icons";

const PurchasesDashboardPage = () => {
  const purchaseFeatures = [
    {
      title: "Supplier Management",
      description: "Manage supplier relationships and information",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/purchases/suppliers",
      color: "blue" as const,
      stats: "45 active suppliers",
    },
    {
      title: "Purchase Orders",
      description: "Create and track purchase orders",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/purchases/orders",
      color: "green" as const,
      stats: "23 pending orders",
    },
    {
      title: "Bills & Invoices",
      description: "Manage vendor bills and payments",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/purchases/bills",
      color: "yellow" as const,
      stats: "67 bills",
    },
    {
      title: "Purchase Reports",
      description: "Analyze purchasing patterns and costs",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/purchases/reports",
      color: "purple" as const,
      stats: "12 reports",
    },
  ];

  const recentPurchases = [
    { supplier: "TechParts Inc", amount: "$15,000", status: "Supplier Added", date: "2 minutes ago", type: "supplier" },
    { supplier: "Office Supplies Co", amount: "$8,500", status: "Order Created", date: "1 hour ago", type: "order" },
    { supplier: "Manufacturing Materials", amount: "$25,000", status: "Bill Received", date: "3 hours ago", type: "bill" },
    { supplier: "Raw Materials Ltd", amount: "$12,000", status: "Payment Sent", date: "1 day ago", type: "payment" },
  ];

  const purchaseMetrics = [
    { metric: "Cost Savings", value: "12.5%", change: "+2.3%" },
    { metric: "Avg. Order Value", value: "$8,450", change: "+15%" },
    { metric: "Processing Time", value: "3.2 days", change: "-12%" },
    { metric: "Supplier Rating", value: "4.8/5", change: "+0.2" },
  ];

  return (
    <DashboardLayout
      title="Purchases Dashboard"
      description="Manage your purchasing operations and supplier relationships"
      icon={<BoxIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Purchases"
          value="$156,780"
          icon={<DollarLineIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Suppliers"
          value="45"
          icon={<UserIcon />}
          color="green"
        />
        <StatsCard
          title="Pending Orders"
          value="23"
          icon={<BoxIcon />}
          color="yellow"
        />
        <StatsCard
          title="Cost Savings"
          value="12.5%"
          icon={<PieChartIcon />}
          color="purple"
        />
      </div>

      {/* Purchase Tools */}
      <ComponentCard title="Purchase Tools & Features" desc="Access and manage your purchasing operations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {purchaseFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              color={feature.color}
              stats={feature.stats}
              className="h-full"
            />
          ))}
        </div>
      </ComponentCard>

      {/* Recent Activity & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Recent Purchase Activity" desc="Latest purchasing activities and updates">
          <div className="space-y-3">
            {recentPurchases.map((purchase, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      purchase.type === 'supplier' ? 'bg-blue-500' : 
                      purchase.type === 'order' ? 'bg-green-500' : 
                      purchase.type === 'bill' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {purchase.supplier}
                        </h4>
                        <Badge 
                          variant="light" 
                          color={
                            purchase.type === 'supplier' ? 'info' : 
                            purchase.type === 'order' ? 'success' : 
                            purchase.type === 'bill' ? 'warning' : 'success'
                          }
                          size="sm"
                        >
                          {purchase.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {purchase.status}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {purchase.amount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {purchase.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard title="Performance Metrics" desc="Key purchasing performance indicators">
          <div className="space-y-4">
            {purchaseMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {metric.metric}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                    <Badge 
                      variant="light" 
                      color={metric.change.startsWith('+') ? "success" : "error"}
                      size="sm"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Quick Actions */}
      <ComponentCard title="Quick Actions" desc="Frequently used purchasing actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" className="justify-start" startIcon={<PlusIcon />}>
            Create Purchase Order
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<UserIcon />}>
            Add Supplier
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
            Record Bill
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<CheckCircleIcon />}>
            Process Payment
          </Button>
        </div>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default PurchasesDashboardPage; 