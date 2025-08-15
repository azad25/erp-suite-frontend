"use client";

import React, { memo, useMemo, lazy, Suspense } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/common/LazyWrapper";
import { DollarLineIcon, PieChartIcon, BoxIcon, TimeIcon, UserIcon, PlusIcon, CheckCircleIcon } from "@/icons";

// Lazy load heavy components
const LazyComponentCard = lazy(() => import("@/components/common/ComponentCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyCard = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.Card })));
const LazyCardContent = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardContent })));
const LazyBadge = lazy(() => import("@/components/ui/badge/Badge"));
const LazyButton = lazy(() => import("@/components/ui/button/Button"));

const SalesDashboardPage = memo(() => {
  // Memoize static data to prevent unnecessary re-renders
  const salesFeatures = useMemo(() => [
    {
      title: "Lead Management",
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
  ], []);

  const recentSales = useMemo(() => [
    { customer: "TechCorp Inc", amount: "$15,000", status: "Closed Won", date: "2 hours ago" },
    { customer: "Global Solutions", amount: "$8,500", status: "Proposal Sent", date: "1 day ago" },
    { customer: "StartupXYZ", amount: "$25,000", status: "Negotiation", date: "2 days ago" },
    { customer: "Enterprise Ltd", amount: "$12,000", status: "Qualified", date: "3 days ago" },
  ], []);

  const salesMetrics = useMemo(() => [
    { metric: "Conversion Rate", value: "24.5%", change: "+5.2%" },
    { metric: "Avg. Deal Size", value: "$8,450", change: "+12%" },
    { metric: "Sales Cycle", value: "32 days", change: "-8%" },
    { metric: "Win Rate", value: "68%", change: "+3%" },
  ], []);

  return (
    <DashboardLayout
      title="Sales Dashboard"
      description="Manage your sales pipeline and track performance metrics"
      icon={<DollarLineIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Sales"
            value="$89,430"
            icon={<DollarLineIcon />}
            color="blue"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Active Leads"
            value="45"
            icon={<UserIcon />}
            color="green"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Open Opportunities"
            value="23"
            icon={<DollarLineIcon />}
            color="yellow"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Monthly Revenue"
            value="$12,450"
            icon={<PieChartIcon />}
            color="purple"
          />
        </LazyComponent>
      </div>

      {/* Sales Tools */}
      <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
        <LazyComponentCard title="Sales Tools & Features" desc="Access all your sales management tools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesFeatures.map((feature, index) => (
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

      {/* Recent Sales & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
          <LazyComponentCard title="Recent Sales Activity" desc="Latest sales activities and updates">
            <div className="space-y-3">
              {recentSales.map((sale, index) => (
                <LazyComponent key={index} fallback={<ComponentSkeleton height="h-20" />}>
                  <LazyCard>
                    <LazyCardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {sale.customer}
                        </h4>
                        <Suspense fallback={<div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />}>
                          <LazyBadge 
                            variant="light" 
                            color={
                              sale.status === "Closed Won" ? "success" :
                              sale.status === "Proposal Sent" ? "info" :
                              sale.status === "Negotiation" ? "warning" : "primary"
                            }
                            size="sm"
                          >
                            {sale.status}
                          </LazyBadge>
                        </Suspense>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {sale.amount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {sale.date}
                        </p>
                      </div>
                    </LazyCardContent>
                  </LazyCard>
                </LazyComponent>
              ))}
            </div>
          </LazyComponentCard>
        </LazyComponent>

        <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
          <LazyComponentCard title="Performance Metrics" desc="Key sales performance indicators">
            <div className="space-y-4">
              {salesMetrics.map((metric, index) => (
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
                        <Suspense fallback={<div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />}>
                          <LazyBadge 
                            variant="light" 
                            color={metric.change.startsWith('+') ? "success" : "error"}
                            size="sm"
                          >
                            {metric.change}
                          </LazyBadge>
                        </Suspense>
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
      <LazyComponent fallback={<ComponentSkeleton height="h-32" />}>
        <LazyComponentCard title="Quick Actions" desc="Frequently used sales actions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Suspense fallback={<ComponentSkeleton height="h-10" />}>
              <LazyButton variant="primary" className="justify-start" startIcon={<PlusIcon />}>
                Add New Lead
              </LazyButton>
            </Suspense>
            <Suspense fallback={<ComponentSkeleton height="h-10" />}>
              <LazyButton variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
                Create Opportunity
              </LazyButton>
            </Suspense>
            <Suspense fallback={<ComponentSkeleton height="h-10" />}>
              <LazyButton variant="outline" className="justify-start" startIcon={<BoxIcon />}>
                Generate Quote
              </LazyButton>
            </Suspense>
            <Suspense fallback={<ComponentSkeleton height="h-10" />}>
              <LazyButton variant="outline" className="justify-start" startIcon={<CheckCircleIcon />}>
                Create Invoice
              </LazyButton>
            </Suspense>
          </div>
        </LazyComponentCard>
      </LazyComponent>
    </DashboardLayout>
  );
});

SalesDashboardPage.displayName = 'SalesDashboardPage';

export default SalesDashboardPage; 