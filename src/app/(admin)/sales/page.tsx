"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import FeatureCard from "@/components/common/FeatureCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { DollarLineIcon, PieChartIcon, BoxIcon, TimeIcon, UserIcon, PlusIcon, CheckCircleIcon } from "@/icons";

const SalesDashboardPage = () => {
  const salesFeatures = [
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
  ];

  const recentSales = [
    { customer: "TechCorp Inc", amount: "$15,000", status: "Closed Won", date: "2 hours ago" },
    { customer: "Global Solutions", amount: "$8,500", status: "Proposal Sent", date: "1 day ago" },
    { customer: "StartupXYZ", amount: "$25,000", status: "Negotiation", date: "2 days ago" },
    { customer: "Enterprise Ltd", amount: "$12,000", status: "Qualified", date: "3 days ago" },
  ];

  const salesMetrics = [
    { metric: "Conversion Rate", value: "24.5%", change: "+5.2%" },
    { metric: "Avg. Deal Size", value: "$8,450", change: "+12%" },
    { metric: "Sales Cycle", value: "32 days", change: "-8%" },
    { metric: "Win Rate", value: "68%", change: "+3%" },
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

      {/* Sales Tools */}
      <ComponentCard title="Sales Tools & Features" desc="Access all your sales management tools">
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
              className="h-full"
            />
          ))}
        </div>
      </ComponentCard>

      {/* Recent Sales & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Recent Sales Activity" desc="Latest sales activities and updates">
          <div className="space-y-3">
            {recentSales.map((sale, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {sale.customer}
                    </h4>
                    <Badge 
                      variant="light" 
                      color={
                        sale.status === "Closed Won" ? "success" :
                        sale.status === "Proposal Sent" ? "info" :
                        sale.status === "Negotiation" ? "warning" : "primary"
                      }
                      size="sm"
                    >
                      {sale.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {sale.amount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sale.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard title="Performance Metrics" desc="Key sales performance indicators">
          <div className="space-y-4">
            {salesMetrics.map((metric, index) => (
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
      <ComponentCard title="Quick Actions" desc="Frequently used sales actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" className="justify-start" startIcon={<PlusIcon />}>
            Add New Lead
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
            Create Opportunity
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<BoxIcon />}>
            Generate Quote
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<CheckCircleIcon />}>
            Create Invoice
          </Button>
        </div>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default SalesDashboardPage; 