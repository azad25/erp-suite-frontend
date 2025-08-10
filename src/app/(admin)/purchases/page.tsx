"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { BoxIcon, DollarLineIcon, PieChartIcon, TimeIcon, UserIcon } from "@/icons";

const PurchasesDashboardPage = () => {
  const purchaseFeatures = [
    {
      title: "Suppliers",
      description: "Manage supplier relationships and information",
      icon: <UserIcon className="w-8 h-8 text-blue-500" />,
      path: "/purchases/suppliers",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      stats: "45 active suppliers",
    },
    {
      title: "Purchase Orders",
      description: "Create and track purchase orders",
      icon: <BoxIcon className="w-8 h-8 text-green-500" />,
      path: "/purchases/orders",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      stats: "23 pending orders",
    },
    {
      title: "Bills",
      description: "Manage vendor bills and payments",
      icon: <DollarLineIcon className="w-8 h-8 text-yellow-500" />,
      path: "/purchases/bills",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      stats: "67 bills",
    },
    {
      title: "Purchase Reports",
      description: "Analyze purchasing patterns and costs",
      icon: <PieChartIcon className="w-8 h-8 text-purple-500" />,
      path: "/purchases/reports",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      stats: "12 reports",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Purchases Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your purchasing operations and supplier relationships
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <DollarLineIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                $156,780
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Purchases
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                45
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active Suppliers
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <BoxIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                23
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending Orders
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                12.5%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cost Savings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Features Grid */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Purchase Tools
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Access and manage your purchasing operations
              </p>
            </div>
            <Button size="sm" variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Purchase Order
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {purchaseFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.path}
                className={`block p-5 rounded-xl border-2 transition-all duration-200 ${feature.color} hover:shadow-lg hover:scale-105`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {feature.description}
                    </p>
                    <div className="mt-3">
                      <Badge color="info" variant="light" size="sm">
                        {feature.stats}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Purchase Activity */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Recent Purchase Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest purchasing activities and updates
              </p>
            </div>
            <Button size="sm" variant="outline">
              View All Activity
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                activity: "New supplier added - TechParts Inc",
                amount: "$15,000",
                status: "Supplier Added",
                time: "2 minutes ago",
                type: "supplier" as const,
              },
              {
                activity: "Purchase order created - Office Supplies",
                amount: "$8,500",
                status: "Order Created",
                time: "1 hour ago",
                type: "order" as const,
              },
              {
                activity: "Bill received - Manufacturing Materials",
                amount: "$25,000",
                status: "Bill Received",
                time: "3 hours ago",
                type: "bill" as const,
              },
              {
                activity: "Payment sent - Raw Materials",
                amount: "$12,000",
                status: "Payment Sent",
                time: "1 day ago",
                type: "payment" as const,
              },
            ].map((purchase, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    purchase.type === 'supplier' ? 'bg-blue-500' : 
                    purchase.type === 'order' ? 'bg-green-500' : 
                    purchase.type === 'bill' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {purchase.activity}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {purchase.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-blue-600">
                    {purchase.amount}
                  </span>
                  <Badge 
                    color={purchase.type === 'supplier' ? 'info' : 
                           purchase.type === 'order' ? 'success' : 
                           purchase.type === 'bill' ? 'warning' : 'success'} 
                    variant="light" 
                    size="sm"
                  >
                    {purchase.type}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {purchase.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasesDashboardPage; 