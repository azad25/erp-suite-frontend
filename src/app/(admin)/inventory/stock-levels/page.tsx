"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PencilIcon, AlertIcon } from "@/icons";

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: "Good" | "Low Stock" | "Out of Stock" | "Overstock";
}

const StockLevelsPage = () => {
  const [stockItems] = useState<StockItem[]>([
    { id: "PRD-001", name: "Laptop Pro", currentStock: 25, minStock: 10, maxStock: 100, reorderPoint: 15, status: "Good" },
    { id: "PRD-002", name: "Office Chair", currentStock: 12, minStock: 5, maxStock: 50, reorderPoint: 8, status: "Good" },
    { id: "PRD-003", name: "Software License", currentStock: 0, minStock: 5, maxStock: 25, reorderPoint: 5, status: "Out of Stock" },
    { id: "PRD-004", name: "Wireless Mouse", currentStock: 3, minStock: 10, maxStock: 100, reorderPoint: 15, status: "Low Stock" },
    { id: "PRD-005", name: "Desk Lamp", currentStock: 45, minStock: 5, maxStock: 30, reorderPoint: 8, status: "Overstock" },
  ]);

  const handleViewStock = (item: StockItem) => {
    console.log("View stock item:", item);
    // Navigate to stock detail page
  };

  const handleAdjustStock = (item: StockItem) => {
    console.log("Adjust stock for item:", item);
    // Open stock adjustment modal
  };

  const handleReorder = (item: StockItem) => {
    console.log("Reorder item:", item);
    // Create reorder request
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const columns: DataTableColumn<StockItem>[] = [
    {
      key: "name",
      header: "Product",
      searchable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{item.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{item.id}</div>
        </div>
      ),
    },
    {
      key: "currentStock",
      header: "Current Stock",
      render: (item) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {item.currentStock} / {item.maxStock}
        </span>
      ),
    },
    {
      key: "stockLevel",
      header: "Stock Level",
      render: (item) => {
        const percentage = getStockPercentage(item.currentStock, item.maxStock);
        const color = item.status === 'Good' ? 'bg-green-600' : 
                     item.status === 'Low Stock' ? 'bg-yellow-600' : 
                     item.status === 'Out of Stock' ? 'bg-red-600' : 'bg-blue-600';
        
        return (
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(percentage)}%</span>
          </div>
        );
      },
    },
    {
      key: "reorderPoint",
      header: "Reorder Point",
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400">{item.reorderPoint}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const statusColors = {
          Good: "success" as const,
          "Low Stock": "warning" as const,
          "Out of Stock": "error" as const,
          Overstock: "info" as const,
        };
        return (
          <Badge color={statusColors[item.status]}>
            {item.status}
          </Badge>
        );
      },
    },
  ];

  const actions: DataTableAction<StockItem>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewStock,
      variant: "ghost",
    },
    {
      key: "adjust",
      label: "Adjust",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleAdjustStock,
      variant: "ghost",
    },
    {
      key: "reorder",
      label: "Reorder",
      icon: <AlertIcon className="w-4 h-4" />,
      onClick: handleReorder,
      variant: "ghost",
      hidden: (item) => item.status === "Good" || item.status === "Overstock",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Stock Levels" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Stock Levels
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Generate Reorder Report</Button>
            <Button>Adjust Stock</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-green-700 dark:text-green-300">Items in Stock</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Low Stock Items</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-red-700 dark:text-red-300">Out of Stock</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$45K</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Value</div>
          </div>
        </div>

        <DataTable
          data={stockItems}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search stock items..."
          searchKeys={["name", "id", "status"]}
          title="Inventory Stock Levels"
          description="Monitor and manage inventory stock levels"
          showHeader={true}
          emptyMessage="No stock items found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default StockLevelsPage;