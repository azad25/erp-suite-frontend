"use client";

import React, { memo, useMemo } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import FeatureCard from "@/components/common/FeatureCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
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
        <StatsCard
          title="Total Leads"
          value="156"
          icon={<UserIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Opportunities"
          value="34"
          icon={<DollarLineIcon />}
          color="green"
        />
        <StatsCard
          title="Total Customers"
          value="89"
          icon={<UserCircleIcon />}
          color="purple"
        />
        <StatsCard
          title="Pipeline Value"
          value="$245,600"
          icon={<PieChartIcon />}
          color="yellow"
        />
      </div>

      {/* CRM Tools using existing card grid layout */}
      <ComponentCard title="CRM Tools & Features" desc="Access all your customer relationship management tools">
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
              className="h-full"
            />
          ))}
        </div>
      </ComponentCard>

      {/* Pipeline Overview & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Pipeline Overview" desc="Track your sales pipeline progress">
          <div className="space-y-3">
            {pipelineOverview.map((stage, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {stage.stage}
                    </p>
                    <Badge variant="light" color={stage.color as any} size="sm">
                      {stage.count}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stage.value || `${stage.count} items`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard title="Recent Activities" desc="Latest CRM activities and updates">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <Card key={index}>
                <CardContent className="p-4">
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
                    <Badge
                      variant="light"
                      color={
                        activity.type === "lead" ? "primary" :
                          activity.type === "opportunity" ? "success" :
                            activity.type === "feedback" ? "warning" : "info"
                      }
                      size="sm"
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Performance Metrics using existing stats card pattern */}
      <ComponentCard title="Performance Metrics" desc="Key performance indicators for your CRM">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
              <Badge variant="light" color="success" size="sm">+5%</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">18.5%</p>
                </div>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
              <Badge variant="light" color="success" size="sm">+12%</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarLineIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$7,224</p>
                </div>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Sales Cycle</CardTitle>
              <Badge variant="light" color="success" size="sm">-8%</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <TimeIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45 days</p>
                </div>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Badge variant="light" color="success" size="sm">+3%</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">68%</p>
                </div>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ComponentCard>

      {/* Quick Actions */}
      <ComponentCard title="Quick Actions" desc="Frequently used CRM actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" className="justify-start" startIcon={<PlusIcon />}>
            Add New Lead
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
            Create Opportunity
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<UserCircleIcon />}>
            Add Customer
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<PieChartIcon />}>
            View Reports
          </Button>
        </div>
      </ComponentCard>
    </DashboardLayout>
  );
});

CRMDashboardPage.displayName = 'CRMDashboardPage';

export default CRMDashboardPage;