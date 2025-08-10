"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

const QuickActionsPage = () => {
  const quickActions = [
    {
      title: "Create Invoice",
      description: "Generate a new invoice for customers",
      icon: "📄",
      action: () => console.log("Create Invoice"),
    },
    {
      title: "Add Customer",
      description: "Add a new customer to the system",
      icon: "👤",
      action: () => console.log("Add Customer"),
    },
    {
      title: "Record Expense",
      description: "Log a new business expense",
      icon: "💰",
      action: () => console.log("Record Expense"),
    },
    {
      title: "Create Purchase Order",
      description: "Generate a new purchase order",
      icon: "📋",
      action: () => console.log("Create PO"),
    },
    {
      title: "Add Product",
      description: "Add a new product to inventory",
      icon: "📦",
      action: () => console.log("Add Product"),
    },
    {
      title: "Schedule Meeting",
      description: "Schedule a new meeting or appointment",
      icon: "📅",
      action: () => console.log("Schedule Meeting"),
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Quick Actions" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions Dashboard
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={action.action}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{action.icon}</span>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {action.title}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {action.description}
              </p>
              <Button size="sm" className="w-full">
                Execute
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPage;