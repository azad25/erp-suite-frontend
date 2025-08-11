"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import FeatureCard from "@/components/common/FeatureCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/Tabs";
import { 
  PieChartIcon, 
  TimeIcon, 
  BoxIcon, 
  DollarLineIcon,
  DocsIcon,
  DownloadIcon,
  CalenderIcon,
  CheckCircleIcon,
  PlusIcon,
  ListIcon,
  UserIcon,
  AlertIcon
} from "@/icons";

const ReportsDashboardPage = () => {
  const reportFeatures = [
    {
      title: "Financial Reports",
      description: "Revenue, expenses, and profit analysis",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/reports/financial",
      color: "green" as const,
      stats: "15 financial reports",
    },
    {
      title: "Sales Analytics",
      description: "Sales performance and trend analysis",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/reports/sales",
      color: "blue" as const,
      stats: "12 sales reports",
    },
    {
      title: "User Activity",
      description: "User engagement and behavior insights",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/reports/users",
      color: "purple" as const,
      stats: "8 user reports",
    },
    {
      title: "Custom Builder",
      description: "Build custom reports with drag & drop",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/reports/builder",
      color: "indigo" as const,
      stats: "Create unlimited",
    },
    {
      title: "Scheduled Reports",
      description: "Automated report generation and delivery",
      icon: <TimeIcon className="w-8 h-8" />,
      path: "/reports/scheduled",
      color: "yellow" as const,
      stats: "8 active schedules",
    },
    {
      title: "Report Archive",
      description: "Access historical reports and data",
      icon: <DocsIcon className="w-8 h-8" />,
      path: "/reports/archive",
      color: "red" as const,
      stats: "245 archived reports",
    },
  ];

  const recentReports = [
    { 
      name: "Monthly Sales Summary", 
      type: "Sales", 
      generated: "2 hours ago", 
      status: "completed",
      size: "2.4 MB"
    },
    { 
      name: "User Engagement Report", 
      type: "Analytics", 
      generated: "5 hours ago", 
      status: "completed",
      size: "1.8 MB"
    },
    { 
      name: "Financial Overview Q4", 
      type: "Financial", 
      generated: "1 day ago", 
      status: "completed",
      size: "3.2 MB"
    },
    { 
      name: "Inventory Analysis", 
      type: "Operations", 
      generated: "2 days ago", 
      status: "processing",
      size: "Processing..."
    },
  ];

  const scheduledReports = [
    { name: "Weekly Sales Report", frequency: "Weekly", nextRun: "Tomorrow 9:00 AM" },
    { name: "Monthly Financial Summary", frequency: "Monthly", nextRun: "Dec 1, 9:00 AM" },
    { name: "Daily User Activity", frequency: "Daily", nextRun: "Today 11:59 PM" },
    { name: "Quarterly Business Review", frequency: "Quarterly", nextRun: "Jan 1, 2025" },
  ];

  const reportCategories = [
    { category: "Financial", count: 15, trend: "+12%" },
    { category: "Sales", count: 12, trend: "+8%" },
    { category: "Operations", count: 8, trend: "+5%" },
    { category: "Analytics", count: 10, trend: "+15%" },
  ];

  return (
    <DashboardLayout
      title="Reports & Analytics"
      description="Generate insights and analyze business performance"
      icon={<PieChartIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Reports"
          value="45"
          icon={<DocsIcon />}
          color="blue"
        />
        <StatsCard
          title="Generated Today"
          value="12"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Scheduled Active"
          value="8"
          icon={<TimeIcon />}
          color="yellow"
        />
        <StatsCard
          title="Data Sources"
          value="6"
          icon={<BoxIcon />}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Report Categories */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Report Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportFeatures.map((feature, index) => (
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
            </CardContent>
          </Card>
        </div>

        {/* Report Overview */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Report Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportCategories.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {item.category}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.count} reports
                      </p>
                    </div>
                    <Badge color="success" size="sm">
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Scheduled Reports</CardTitle>
              <Button size="sm" variant="ghost">
                <CalenderIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledReports.map((report, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {report.name}
                      </p>
                      <Badge color="info" size="sm">
                        {report.frequency}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Next: {report.nextRun}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Reports & Quick Actions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Reports */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button size="sm" variant="outline">
                <DocsIcon className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {report.name}
                        </h4>
                        <Badge 
                          color={report.status === "completed" ? "success" : "warning"}
                          size="sm"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.type} • {report.generated} • {report.size}
                      </p>
                    </div>
                    {report.status === "completed" && (
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="generate">
                <TabsList>
                  <TabsTrigger value="generate">Generate</TabsTrigger>
                  <TabsTrigger value="manage">Manage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BoxIcon className="w-4 h-4 mr-2" />
                    Custom Builder
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    Quick Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarLineIcon className="w-4 h-4 mr-2" />
                    Financial Summary
                  </Button>
                </TabsContent>
                
                <TabsContent value="manage" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <TimeIcon className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DocsIcon className="w-4 h-4 mr-2" />
                    View Archive
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ListIcon className="w-4 h-4 mr-2" />
                    Manage Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertIcon className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsDashboardPage;