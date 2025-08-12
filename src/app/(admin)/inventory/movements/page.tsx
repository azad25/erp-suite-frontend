"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, ArrowUpIcon, ArrowDownIcon } from "@/icons";

interface Movement {
  id: string;
  product: string;
  type: "In" | "Out" | "Transfer";
  quantity: number;
  reason: string;
  reference: string;
  date: string;
  user: string;
}

const StockMovementsPage = () => {
  const [movements] = useState<Movement[]>([
    { id: "MOV-001", product: "Laptop Pro", type: "In", quantity: 50, reason: "Purchase Order", reference: "PO-001", date: "2024-02-25", user: "John Smith" },
    { id: "MOV-002", product: "Office Chair", type: "Out", quantity: -5, reason: "Sale", reference: "INV-002", date: "2024-02-24", user: "Sarah Johnson" },
    { id: "MOV-003", product: "Wireless Mouse", type: "In", quantity: 100, reason: "Stock Adjustment", reference: "ADJ-001", date: "2024-02-23", user: "Mike Wilson" },
    { id: "MOV-004", product: "Software License", type: "Out", quantity: -10, reason: "Sale", reference: "INV-003", date: "2024-02-22", user: "Alice Cooper" },
    { id: "MOV-005", product: "Desk Lamp", type: "Transfer", quantity: 15, reason: "Warehouse Transfer", reference: "TRF-001", date: "2024-02-21", user: "David Brown" },
  ]);

  const handleViewMovement = (movement: Movement) => {
    console.log("View movement:", movement);
    // Navigate to movement detail page
  };

  const handleViewProduct = (movement: Movement) => {
    console.log("View product for movement:", movement);
    // Navigate to product detail page
  };

  const handleViewReference = (movement: Movement) => {
    console.log("View reference for movement:", movement);
    // Navigate to reference document
  };

  const columns: DataTableColumn<Movement>[] = [
    {
      key: "id",
      header: "Movement ID",
      searchable: true,
      render: (movement) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{movement.id}</span>
      ),
    },
    {
      key: "product",
      header: "Product",
      searchable: true,
    },
    {
      key: "type",
      header: "Type",
      render: (movement) => {
        const typeColors = {
          In: "success" as const,
          Out: "error" as const,
          Transfer: "info" as const,
        };
        return (
          <Badge color={typeColors[movement.type]}>
            {movement.type}
          </Badge>
        );
      },
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (movement) => (
        <span className={`font-medium ${movement.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      searchable: true,
    },
    {
      key: "reference",
      header: "Reference",
      searchable: true,
      render: (movement) => (
        <span className="text-gray-600 dark:text-gray-400">{movement.reference}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (movement) => (
        <span className="text-gray-600 dark:text-gray-400">{movement.date}</span>
      ),
    },
    {
      key: "user",
      header: "User",
      searchable: true,
    },
  ];

  const actions: DataTableAction<Movement>[] = [
    {
      key: "view",
      label: "View Movement",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewMovement,
      variant: "ghost",
    },
    {
      key: "viewProduct",
      label: "View Product",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewProduct,
      variant: "ghost",
    },
    {
      key: "viewReference",
      label: "View Reference",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewReference,
      variant: "ghost",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Stock Movements" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Movement Log
          </h3>
          <Button>Record Movement</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">+150</div>
            <div className="text-sm text-green-700 dark:text-green-300">Items In (Today)</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">-85</div>
            <div className="text-sm text-red-700 dark:text-red-300">Items Out (Today)</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Transfers</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">+65</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Net Change</div>
          </div>
        </div>

        <DataTable
          data={movements}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search movements..."
          searchKeys={["id", "product", "reason", "reference", "user"]}
          title="Inventory Movement Log"
          description="Track all inventory movements and stock changes"
          showHeader={true}
          emptyMessage="No movements found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default StockMovementsPage;