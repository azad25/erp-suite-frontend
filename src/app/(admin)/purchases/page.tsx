"use client";

import React, { lazy, Suspense } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/common/LazyWrapper";
import LoadingLogo from "@/components/common/LoadingLogo";
import { BoxIcon, DollarLineIcon, PieChartIcon, TimeIcon, UserIcon, PlusIcon, CheckCircleIcon } from "@/icons";

const LazyComponentCard = lazy(() => import("@/components/common/ComponentCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyCard = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.Card })));
const LazyCardContent = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardContent })));
const LazyBadge = lazy(() => import("@/components/ui/badge/Badge"));
const LazyButton = lazy(() => import("@/components/ui/button/Button"));

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
    <Suspense fallback={<LoadingLogo withText />}>
      <DashboardLayout
        title="Purchases Dashboard"
        description="Manage your purchasing operations and supplier relationships"
        icon={<BoxIcon />}
      >
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Total Purchases"
              value="$156,780"
              icon={<DollarLineIcon />}
              color="blue"
            />
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Active Suppliers"
              value="45"
              icon={<UserIcon />}
              color="green"
            />
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Pending Orders"
              value="23"
              icon={<BoxIcon />}
              color="yellow"
            />
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Cost Savings"
              value="12.5%"
              icon={<PieChartIcon />}
              color="purple"
            />
          </LazyComponent>
        </div>
        {/* Purchase Tools */}
        <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
          <LazyComponentCard title="Purchase Tools & Features" desc="Access and manage your purchasing operations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {purchaseFeatures.map((feature, index) => (
                <LazyComponent key={index} fallback={<ComponentSkeleton height="h-32" />}>
                  <LazyFeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    path={feature.path}
                    color={feature.color}
                    stats={feature.stats}
                    className="h-full"
                  />
                </LazyComponent>
              ))}
            </div>
          </LazyComponentCard>
        </LazyComponent>
        {/* Recent Activity & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
            <LazyComponentCard title="Recent Purchase Activity" desc="Latest purchasing activities and updates">
              <div className="space-y-3">
                {recentPurchases.map((purchase, index) => (
                  <LazyComponent key={index} fallback={<ComponentSkeleton height="h-20" />}>
                    <LazyCard>
                      <LazyCardContent className="p-4">
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
                              <LazyBadge 
                                variant="light" 
                                color={
                                  purchase.type === 'supplier' ? 'info' : 
                                  purchase.type === 'order' ? 'success' : 
                                  purchase.type === 'bill' ? 'warning' : 'success'
                                }
                                size="sm"
                              >
                                {purchase.type}
                              </LazyBadge>
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
                      </LazyCardContent>
                    </LazyCard>
                  </LazyComponent>
                ))}
              </div>
            </LazyComponentCard>
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
            <LazyComponentCard title="Performance Metrics" desc="Key purchasing performance indicators">
              <div className="space-y-4">
                {purchaseMetrics.map((metric, index) => (
                  <LazyComponent key={index} fallback={<ComponentSkeleton height="h-20" />}>
                    <LazyCard>
                      <LazyCardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {metric.metric}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {metric.value}
                            </p>
                          </div>
                          <LazyBadge 
                            variant="light" 
                            color={metric.change.startsWith('+') ? "success" : "error"}
                            size="sm"
                          >
                            {metric.change}
                          </LazyBadge>
                        </div>
                      </LazyCardContent>
                    </LazyCard>
                  </LazyComponent>
                ))}
              </div>
            </LazyComponentCard>
          </LazyComponent>
        </div>
        {/* Quick Actions */}
        <LazyComponentCard title="Quick Actions" desc="Frequently used purchasing actions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LazyButton variant="primary" className="justify-start" startIcon={<PlusIcon />}>
              Create Purchase Order
            </LazyButton>
            <LazyButton variant="outline" className="justify-start" startIcon={<UserIcon />}>
              Add Supplier
            </LazyButton>
            <LazyButton variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
              Record Bill
            </LazyButton>
            <LazyButton variant="outline" className="justify-start" startIcon={<CheckCircleIcon />}>
              Process Payment
            </LazyButton>
          </div>
        </LazyComponentCard>
      </DashboardLayout>
    </Suspense>
  );
};

export default PurchasesDashboardPage; 