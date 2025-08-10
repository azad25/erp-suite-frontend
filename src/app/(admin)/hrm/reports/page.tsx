"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

const HRReportsPage = () => {
  const reports = [
    {
      title: "Headcount Report",
      description: "Employee count by department and position",
      icon: "👥",
      lastGenerated: "2024-02-25",
    },
    {
      title: "Turnover Rate Analysis",
      description: "Employee retention and turnover statistics",
      icon: "📊",
      lastGenerated: "2024-02-24",
    },
    {
      title: "Payroll Costs",
      description: "Salary expenses and benefit costs breakdown",
      icon: "💰",
      lastGenerated: "2024-02-23",
    },
    {
      title: "Attendance Summary",
      description: "Employee attendance patterns and trends",
      icon: "📅",
      lastGenerated: "2024-02-22",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="HR Reports" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            HR Analytics & Reports
          </h3>
          <Button>Custom Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{report.icon}</span>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {report.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last generated: {report.lastGenerated}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {report.description}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Report
                </Button>
                <Button size="sm">
                  Generate
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            Quick Stats
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-600">125</div>
              <div className="text-sm text-gray-500">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-500">Retention Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-500">New Hires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$850K</div>
              <div className="text-sm text-gray-500">Monthly Payroll</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRReportsPage;