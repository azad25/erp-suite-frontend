import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Usage & Analytics | Unibase ERP Dashboard",
  description: "Usage and Analytics for Unibase ERP Dashboard",
};

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
}

interface UsageHistory {
  date: string;
  users: number;
  apiCalls: number;
  storage: number;
}

const usageMetrics: UsageMetric[] = [
  {
    name: "Active Users",
    current: 18,
    limit: 25,
    unit: "users",
    percentage: 72,
    trend: "up",
    trendValue: "+2 this month",
  },
  {
    name: "API Calls",
    current: 7420,
    limit: 10000,
    unit: "calls",
    percentage: 74.2,
    trend: "up",
    trendValue: "+12% this month",
  },
  {
    name: "Storage Used",
    current: 45.2,
    limit: 100,
    unit: "GB",
    percentage: 45.2,
    trend: "stable",
    trendValue: "No change",
  },
  {
    name: "Reports Generated",
    current: 156,
    limit: 500,
    unit: "reports",
    percentage: 31.2,
    trend: "down",
    trendValue: "-5% this month",
  },
];

const usageHistory: UsageHistory[] = [
  { date: "2024-01-01", users: 15, apiCalls: 5200, storage: 42.1 },
  { date: "2024-01-08", users: 16, apiCalls: 5800, storage: 43.2 },
  { date: "2024-01-15", users: 17, apiCalls: 6500, storage: 44.1 },
  { date: "2024-01-22", users: 18, apiCalls: 7100, storage: 45.0 },
  { date: "2024-01-29", users: 18, apiCalls: 7420, storage: 45.2 },
];

const featureUsage = [
  { name: "CRM Module", usage: 85, color: "bg-blue-500" },
  { name: "Inventory Management", usage: 72, color: "bg-green-500" },
  { name: "Financial Reports", usage: 68, color: "bg-purple-500" },
  { name: "Project Management", usage: 45, color: "bg-orange-500" },
  { name: "HR Management", usage: 32, color: "bg-red-500" },
  { name: "Analytics Dashboard", usage: 28, color: "bg-yellow-500" },
];

export default function UsagePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Usage & Analytics" />
      
      <div className="space-y-6">
        {/* Usage Overview */}
        <ComponentCard title="Current Usage Overview">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {usageMetrics.map((metric) => (
              <div
                key={metric.name}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {metric.name}
                  </h3>
                  <Badge
                    color={
                      metric.trend === "up"
                        ? "success"
                        : metric.trend === "down"
                        ? "error"
                        : "warning"
                    }
                    size="sm"
                  >
                    {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"}
                  </Badge>
                </div>
                
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      / {metric.limit.toLocaleString()} {metric.unit}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {metric.percentage.toFixed(1)}% used
                      </span>
                      <span
                        className={`text-sm ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : metric.trend === "down"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {metric.trendValue}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${
                          metric.percentage > 80
                            ? "bg-red-500"
                            : metric.percentage > 60
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Feature Usage */}
        <ComponentCard title="Feature Usage">
          <div className="space-y-4">
            {featureUsage.map((feature) => (
              <div key={feature.name} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature.name}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${feature.color}`}
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-500 dark:text-gray-400">
                      {feature.usage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Usage History */}
        <ComponentCard title="Usage History">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <table className="w-full">
                  <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Users
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        API Calls
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Storage (GB)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {usageHistory.map((record) => (
                      <tr key={record.date}>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {record.users}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {record.apiCalls.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {record.storage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Usage Alerts */}
        <ComponentCard title="Usage Alerts & Recommendations">
          <div className="space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    API Usage Warning
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    You've used 74% of your monthly API calls. Consider upgrading to avoid service interruption.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                  <span className="text-sm text-blue-600 dark:text-blue-400">i</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Optimization Tip
                  </h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Your HR Management module has low usage. Consider training your team or reviewing your workflow.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                  <span className="text-sm text-green-600 dark:text-green-400">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Good Usage Pattern
                  </h4>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                    Your storage usage is well within limits and growing at a healthy rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}