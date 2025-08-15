"use client";

import React, { memo, useMemo, lazy, Suspense } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/common/LazyWrapper";
import {
  UserCircleIcon,
  UserIcon,
  DollarLineIcon,
  PieChartIcon,
  ChatIcon,
  TimeIcon,
  CheckCircleIcon,
  PlusIcon
} from "@/icons";

// Lazy load heavy components
const LazyComponentCard = lazy(() => import("@/components/common/ComponentCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyCard = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.Card })));
const LazyCardHeader = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardHeader })));
const LazyCardTitle = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardTitle })));
const LazyCardContent = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardContent })));
const LazyBadge = lazy(() => import("@/components/ui/badge/Badge"));
const LazyButton = lazy(() => import("@/components/ui/button/Button"));

const CRMDashboardPage = memo(() => {
  // Remove artificial loading delay - data should load instantly for static content

  // Memoize static data to prevent unnecessary re-renders
  const crmFeatures = useMemo(() => [
    {
      title: "Lead Management",
      description: "Capture, qualify, and convert leads into opportunities",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/crm/leads",
      color: "blue" as const,
      stats: "156 total leads",
    },
    {
      title: "Opportunities",
      description: "Manage sales pipeline and track deal progress",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/crm/opportunities",
      color: "green" as const,
      stats: "34 active deals",
    },
    {
      title: "Customer Management",
      description: "Maintain customer relationships and history",
      icon: <UserCircleIcon className="w-8 h-8" />,
      path: "/crm/customers",
      color: "purple" as const,
      stats: "89 customers",
    },
    {
      title: "Communication Hub",
      description: "Centralized customer communication",
      icon: <ChatIcon className="w-8 h-8" />,
      path: "/crm/communication",
      color: "indigo" as const,
      stats: "245 interactions",
    },
    {
      title: "Feedback & Surveys",
      description: "Collect and analyze customer feedback",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/crm/feedback",
      color: "yellow" as const,
      stats: "12 active surveys",
    },
    {
      title: "CRM Reports",
      description: "Analytics and performance insights",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/crm/reports",
      color: "red" as const,
      stats: "25 reports",
    },
  ], []);

  const recentActivities = useMemo(() => [
    { activity: "New lead from website", time: "5 min ago", type: "lead" },
    { activity: "Deal closed - TechCorp", time: "2 hours ago", type: "opportunity" },
    { activity: "Customer feedback received", time: "4 hours ago", type: "feedback" },
    { activity: "Follow-up call scheduled", time: "1 day ago", type: "activity" },
  ], []);

  const pipelineOverview = useMemo(() => [
    { stage: "Leads", count: 156, value: "$0", color: "primary" },
    { stage: "Qualified", count: 89, value: "$0", color: "warning" },
    { stage: "Opportunities", count: 34, value: "$245,600", color: "info" },
    { stage: "Customers", count: 89, value: "$1,245,000", color: "success" },
  ], []);

  return (
    <DashboardLayout
      title="CRM Dashboard"
      description="Customer Relationship Management overview and tools"
      icon={<UserCircleIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Leads"
            value="156"
            icon={<UserIcon />}
            color="blue"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Active Opportunities"
            value="34"
            icon={<DollarLineIcon />}
            color="green"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Total Customers"
            value="89"
            icon={<UserCircleIcon />}
            color="purple"
          />
        </LazyComponent>
        <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
          <LazyStatsCard
            title="Pipeline Value"
            value="$245,600"
            icon={<PieChartIcon />}
            color="yellow"
          />
        </LazyComponent>
      </div>

      {/* CRM Tools using existing card grid layout */}
      <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
        <LazyComponentCard title="CRM Tools & Features" desc="Access all your customer relationship management tools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crmFeatures.map((feature, index) => (
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

      {/* Pipeline Overview & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LazyComponentCard title="Pipeline Overview" desc="Track your sales pipeline progress">
          <div className="space-y-3">
            {pipelineOverview.map((stage, index) => (
              <LazyCard key={index}>
                <LazyCardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {stage.stage}
                    </p>
                    <LazyBadge variant="light" color={stage.color as any} size="sm">
                      {stage.count}
                    </LazyBadge>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stage.value || `${stage.count} items`}
                  </p>
                </LazyCardContent>
              </LazyCard>
            ))}
          </div>
        </LazyComponentCard>

        <LazyComponentCard title="Recent Activities" desc="Latest CRM activities and updates">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <LazyCard key={index}>
                <LazyCardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "lead" ? "bg-blue-500" :
                      activity.type === "opportunity" ? "bg-green-500" :
                        activity.type === "feedback" ? "bg-yellow-500" : "bg-purple-500"
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                    <LazyBadge
                      variant="light"
                      color={
                        activity.type === "lead" ? "primary" :
                          activity.type === "opportunity" ? "success" :
                            activity.type === "feedback" ? "warning" : "info"
                      }
                      size="sm"
                    >
                      {activity.type}
                    </LazyBadge>
                  </div>
                </LazyCardContent>
              </LazyCard>
            ))}
          </div>
        </LazyComponentCard>
      </div>

      {/* Performance Metrics using existing stats card pattern */}
      <LazyComponentCard title="Performance Metrics" desc="Key performance indicators for your CRM">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LazyCard>
            <LazyCardHeader className="flex flex-row items-center justify-between">
              <LazyCardTitle className="text-sm font-medium">Lead Conversion Rate</LazyCardTitle>
              <LazyBadge variant="light" color="success" size="sm">+5%</LazyBadge>
            </LazyCardHeader>
            <LazyCardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">18.5%</p>
                </div>
              </div>
              <div className="mt-4">
                <LazyButton size="sm" variant="outline" className="w-full">
                  View Details
                </LazyButton>
              </div>
            </LazyCardContent>
          </LazyCard>

          <LazyCard>
            <LazyCardHeader className="flex flex-row items-center justify-between">
              <LazyCardTitle className="text-sm font-medium">Avg. Deal Size</LazyCardTitle>
              <LazyBadge variant="light" color="success" size="sm">+12%</LazyBadge>
            </LazyCardHeader>
            <LazyCardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarLineIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$7,224</p>
                </div>
              </div>
              <div className="mt-4">
                <LazyButton size="sm" variant="outline" className="w-full">
                  View Details
                </LazyButton>
              </div>
            </LazyCardContent>
          </LazyCard>

          <LazyCard>
            <LazyCardHeader className="flex flex-row items-center justify-between">
              <LazyCardTitle className="text-sm font-medium">Avg. Sales Cycle</LazyCardTitle>
              <LazyBadge variant="light" color="success" size="sm">-8%</LazyBadge>
            </LazyCardHeader>
            <LazyCardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <TimeIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45 days</p>
                </div>
              </div>
              <div className="mt-4">
                <LazyButton size="sm" variant="outline" className="w-full">
                  View Details
                </LazyButton>
              </div>
            </LazyCardContent>
          </LazyCard>

          <LazyCard>
            <LazyCardHeader className="flex flex-row items-center justify-between">
              <LazyCardTitle className="text-sm font-medium">Win Rate</LazyCardTitle>
              <LazyBadge variant="light" color="success" size="sm">+3%</LazyBadge>
            </LazyCardHeader>
            <LazyCardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">68%</p>
                </div>
              </div>
              <div className="mt-4">
                <LazyButton size="sm" variant="outline" className="w-full">
                  View Details
                </LazyButton>
              </div>
            </LazyCardContent>
          </LazyCard>
        </div>
      </LazyComponentCard>

      {/* Quick Actions */}
      <LazyComponentCard title="Quick Actions" desc="Frequently used CRM actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LazyButton variant="primary" className="justify-start" startIcon={<PlusIcon />}>
            Add New Lead
          </LazyButton>
          <LazyButton variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
            Create Opportunity
          </LazyButton>
          <LazyButton variant="outline" className="justify-start" startIcon={<UserCircleIcon />}>
            Add Customer
          </LazyButton>
          <LazyButton variant="outline" className="justify-start" startIcon={<PieChartIcon />}>
            View Reports
          </LazyButton>
        </div>
      </LazyComponentCard>
    </DashboardLayout>
  );
});

CRMDashboardPage.displayName = 'CRMDashboardPage';

export default CRMDashboardPage;