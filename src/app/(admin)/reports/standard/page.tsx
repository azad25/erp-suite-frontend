"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

const StandardReportsPage = () => {
  const [reports] = useState([
    {
      category: "Sales",
      reports: [
        { name: "Sales Summary", description: "Daily, weekly, monthly sales overview", icon: "📊" },
        { name: "Customer Report", description: "Customer list with contact details", icon: "👥" },
        { name: "Product Performance", description: "Best and worst selling products", icon: "📈" },
      ]
    },
    {
      category: "Finance",
      reports: [
        { name: "Profit & Loss", description: "Income statement for specified period", icon: "💰" },
        { name: "Balance Sheet", description: "Assets, liabilities, and equity", icon: "⚖️" },
        { name: "Cash Flow", description: "Cash inflows and outflows", icon: "💸" },
      ]
    },
    {
      category: "Inventory",
      reports: [
        { name: "Stock Report", description: "Current inventory levels", icon: "📦" },
        { name: "Low Stock Alert", description: "Items below reorder point", icon: "⚠️" },
        { name: "Inventory Valuation", description: "Total inventory value", icon: "💎" },
      ]
    },
    {
      category: "HR",
      reports: [
        { name: "Employee List", description: "All employees with details", icon: "👨‍💼" },
        { name: "Attendance Report", description: "Employee attendance summary", icon: "📅" },
        { name: "Payroll Summary", description: "Salary and deduction details", icon: "💵" },
      ]
    }
  ]);

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Standard Reports" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Standard Business Reports
          </h3>
          <Button variant="outline">Export All</Button>
        </div>

        <div className="space-y-8">
          {reports.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {category.category} Reports
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.reports.map((report, reportIndex) => (
                  <div
                    key={reportIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{report.icon}</span>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.name}
                      </h5>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                      {report.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                      <Button size="sm">
                        Generate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">Generate Monthly Summary</Button>
            <Button size="sm" variant="outline">Export Financial Package</Button>
            <Button size="sm" variant="outline">Send Reports via Email</Button>
            <Button size="sm" variant="outline">Schedule Automated Reports</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardReportsPage;