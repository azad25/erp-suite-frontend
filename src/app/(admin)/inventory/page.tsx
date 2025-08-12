"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/performance/FastPageLoader";
import { useLoading } from "@/context/LoadingContext";
import { BoxIcon, PieChartIcon, TimeIcon, UserIcon, DollarLineIcon, PlusIcon, CheckCircleIcon, AlertIcon } from "@/icons";

// Lazy load heavy components
const LazyComponentCard = lazy(() => import("@/components/common/ComponentCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyCard = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.Card })));
const LazyCardContent = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardContent })));
const LazyBadge = lazy(() => import("@/components/ui/badge/Badge"));
const LazyButton = lazy(() => import("@/components/ui/button/Button"));

const InventoryDashboardPage = () => {
  const { showLoading, hideLoading } = useLoading();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isAlertsLoading, setIsAlertsLoading] = useState(true);

  // Show loading when component mounts
  useEffect(() => {
    showLoading("Loading inventory dashboard...");
    
    // Simulate data loading time
    const timer = setTimeout(() => {
      hideLoading();
      setIsDataLoading(false);
    }, 1500); // Show loading for 1.5 seconds

    // Simulate stats loading
    const statsTimer = setTimeout(() => {
      setIsStatsLoading(false);
    }, 2000);

    // Simulate alerts loading
    const alertsTimer = setTimeout(() => {
      setIsAlertsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
      clearTimeout(alertsTimer);
      hideLoading();
    };
  }, [showLoading, hideLoading]);

  const inventoryFeatures = [
    {
      title: "Product Catalog",
      description: "Manage your product catalog and services",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/inventory/products",
      color: "blue" as const,
      stats: "1,247 products",
    },
    {
      title: "Warehouse Management",
      description: "Organize and manage storage locations",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/inventory/warehouses",
      color: "green" as const,
      stats: "8 warehouses",
    },
    {
      title: "Stock Monitoring",
      description: "Monitor inventory quantities and alerts",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/inventory/stock-levels",
      color: "yellow" as const,
      stats: "23 low stock alerts",
    },
    {
      title: "Stock Movements",
      description: "Track inventory transactions and movements",
      icon: <TimeIcon className="w-8 h-8" />,
      path: "/inventory/movements",
      color: "purple" as const,
      stats: "156 movements today",
    },
    {
      title: "Inventory Reports",
      description: "Generate comprehensive inventory reports",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/inventory/reports",
      color: "red" as const,
      stats: "15 reports",
    },
  ];

  const lowStockItems = [
    { product: "Office Paper A4", currentStock: 15, minStock: 50, warehouse: "Main Warehouse" },
    { product: "Printer Ink Cartridge", currentStock: 3, minStock: 10, warehouse: "Office Supplies" },
    { product: "USB Flash Drives", currentStock: 8, minStock: 25, warehouse: "Tech Storage" },
    { product: "Cleaning Supplies", currentStock: 2, minStock: 20, warehouse: "Maintenance" },
  ];

  const recentMovements = [
    { product: "Laptop Dell XPS", type: "Stock In", quantity: 25, warehouse: "Tech Storage", date: "2 hours ago" },
    { product: "Office Chairs", type: "Stock Out", quantity: 12, warehouse: "Furniture", date: "4 hours ago" },
    { product: "Printer Paper", type: "Transfer", quantity: 100, warehouse: "Main → Branch", date: "1 day ago" },
    { product: "Mobile Phones", type: "Stock In", quantity: 15, warehouse: "Electronics", date: "2 days ago" },
  ];

  const inventoryMetrics = [
    { metric: "Inventory Turnover", value: "4.2x", change: "+0.3" },
    { metric: "Stock Accuracy", value: "98.5%", change: "+1.2%" },
    { metric: "Avg. Days in Stock", value: "45 days", change: "-5 days" },
    { metric: "Fill Rate", value: "96.8%", change: "+2.1%" },
  ];

  return (
    <DashboardLayout
      title="Inventory Management"
      description="Manage your inventory and track stock levels across all locations"
      icon={<BoxIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isStatsLoading ? (
          <>
            <ComponentSkeleton height="h-24" />
            <ComponentSkeleton height="h-24" />
            <ComponentSkeleton height="h-24" />
            <ComponentSkeleton height="h-24" />
          </>
        ) : (
          <>
            <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
              <LazyStatsCard
                title="Total Products"
                value="1,247"
                icon={<BoxIcon />}
                color="blue"
              />
            </LazyComponent>
            <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
              <LazyStatsCard
                title="Low Stock Items"
                value="23"
                icon={<AlertIcon />}
                color="red"
              />
            </LazyComponent>
            <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
              <LazyStatsCard
                title="Total Value"
                value="$2.5M"
                icon={<DollarLineIcon />}
                color="green"
              />
            </LazyComponent>
            <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
              <LazyStatsCard
                title="Warehouses"
                value="8"
                icon={<UserIcon />}
                color="purple"
              />
            </LazyComponent>
          </>
        )}
      </div>

      {/* Inventory Tools */}
      <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
        <LazyComponentCard title="Inventory Management Tools" desc="Access all your inventory management features">
          {isDataLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventoryFeatures.map((feature, index) => (
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
          )}
        </LazyComponentCard>
      </LazyComponent>

      {/* Low Stock Alerts & Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LazyComponentCard title="Low Stock Alerts" desc="Items that need immediate attention">
          {isAlertsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <LazyCard key={index}>
                  <LazyCardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.product}
                      </h4>
                      <LazyBadge variant="light" color="error" size="sm">
                        Low Stock
                      </LazyBadge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current: {item.currentStock} | Min: {item.minStock}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.warehouse}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                      ></div>
                    </div>
                  </LazyCardContent>
                </LazyCard>
              ))}
            </div>
          )}
        </LazyComponentCard>

        <LazyComponentCard title="Recent Stock Movements" desc="Latest inventory transactions">
          {isAlertsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentMovements.map((movement, index) => (
                <LazyCard key={index}>
                  <LazyCardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        movement.type === 'Stock In' ? 'bg-green-500' : 
                        movement.type === 'Stock Out' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {movement.product}
                          </h4>
                          <LazyBadge 
                            variant="light" 
                            color={
                              movement.type === 'Stock In' ? 'success' : 
                              movement.type === 'Stock Out' ? 'error' : 'info'
                            }
                            size="sm"
                          >
                            {movement.type}
                          </LazyBadge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Quantity: {movement.quantity} | {movement.warehouse}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {movement.date}
                        </p>
                      </div>
                    </div>
                  </LazyCardContent>
                </LazyCard>
              ))}
            </div>
          )}
        </LazyComponentCard>
      </div>

      {/* Performance Metrics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LazyComponentCard title="Performance Metrics" desc="Key inventory performance indicators">
          {isStatsLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {inventoryMetrics.map((metric, index) => (
                <LazyCard key={index}>
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
                      <LazyBadge 
                        variant="light" 
                        color={metric.change.startsWith('+') || metric.change.startsWith('-') && metric.metric.includes('Days') ? "success" : "info"}
                        size="sm"
                      >
                        {metric.change}
                      </LazyBadge>
                    </div>
                  </LazyCardContent>
                </LazyCard>
              ))}
            </div>
          )}
        </LazyComponentCard>

        <LazyComponentCard title="Quick Actions" desc="Frequently used inventory actions">
          {isDataLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <LazyButton variant="primary" className="w-full justify-start" startIcon={<PlusIcon />}>
                Add New Product
              </LazyButton>
              <LazyButton variant="outline" className="w-full justify-start" startIcon={<BoxIcon />}>
                Stock Adjustment
              </LazyButton>
              <LazyButton variant="outline" className="w-full justify-start" startIcon={<TimeIcon />}>
                Record Movement
              </LazyButton>
              <LazyButton variant="outline" className="w-full justify-start" startIcon={<CheckCircleIcon />}>
                Generate Report
              </LazyButton>
              <LazyButton variant="outline" className="w-full justify-start" startIcon={<AlertIcon />}>
                Set Stock Alerts
              </LazyButton>
            </div>
          )}
        </LazyComponentCard>
      </div>
    </DashboardLayout>
  );
};

export default InventoryDashboardPage; 