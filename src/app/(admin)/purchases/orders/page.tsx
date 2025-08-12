"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, EditIcon, TruckIcon } from "@/icons";

interface PurchaseOrder {
  id: string;
  supplier: string;
  amount: string;
  status: "Draft" | "Pending" | "Approved" | "Delivered" | "Cancelled";
  orderDate: string;
  deliveryDate: string;
}

const PurchaseOrdersPage = () => {
  const [orders] = useState<PurchaseOrder[]>([
    { id: "PO-001", supplier: "Tech Solutions Ltd", amount: "$15,000", status: "Pending", orderDate: "2024-02-20", deliveryDate: "2024-03-05" },
    { id: "PO-002", supplier: "Office Supplies Co", amount: "$3,500", status: "Approved", orderDate: "2024-02-22", deliveryDate: "2024-03-01" },
    { id: "PO-003", supplier: "Manufacturing Parts Inc", amount: "$25,000", status: "Delivered", orderDate: "2024-02-15", deliveryDate: "2024-02-28" },
    { id: "PO-004", supplier: "Software Licenses Corp", amount: "$8,750", status: "Draft", orderDate: "2024-02-25", deliveryDate: "2024-03-10" },
    { id: "PO-005", supplier: "Hardware Suppliers", amount: "$12,300", status: "Approved", orderDate: "2024-02-18", deliveryDate: "2024-03-02" },
  ]);

  const handleViewOrder = (order: PurchaseOrder) => {
    console.log("View order:", order);
    // Navigate to order detail page
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    console.log("Edit order:", order);
    // Navigate to edit order page
  };

  const handleTrackOrder = (order: PurchaseOrder) => {
    console.log("Track order:", order);
    // Open tracking modal or navigate to tracking page
  };

  const columns: DataTableColumn<PurchaseOrder>[] = [
    {
      key: "id",
      header: "PO Number",
      searchable: true,
      render: (order) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{order.id}</span>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      searchable: true,
    },
    {
      key: "amount",
      header: "Amount",
      render: (order) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{order.amount}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => {
        const statusColors = {
          Draft: "light" as const,
          Pending: "warning" as const,
          Approved: "info" as const,
          Delivered: "success" as const,
          Cancelled: "error" as const,
        };
        return (
          <Badge color={statusColors[order.status]}>
            {order.status}
          </Badge>
        );
      },
    },
    {
      key: "orderDate",
      header: "Order Date",
      render: (order) => (
        <span className="text-gray-800 dark:text-white/90">{order.orderDate}</span>
      ),
    },
    {
      key: "deliveryDate",
      header: "Expected Delivery",
      render: (order) => (
        <span className="text-gray-800 dark:text-white/90">{order.deliveryDate}</span>
      ),
    },
  ];

  const actions: DataTableAction<PurchaseOrder>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewOrder,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: handleEditOrder,
      variant: "ghost",
      hidden: (order) => order.status === "Delivered" || order.status === "Cancelled",
    },
    {
      key: "track",
      label: "Track",
      icon: <TruckIcon className="w-4 h-4" />,
      onClick: handleTrackOrder,
      variant: "ghost",
      hidden: (order) => order.status === "Draft" || order.status === "Cancelled",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Purchase Orders" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Order Management
          </h3>
          <Button>Create Purchase Order</Button>
        </div>

        <DataTable
          data={orders}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search purchase orders..."
          searchKeys={["id", "supplier", "status"]}
          title="Purchase Orders"
          description="Manage and track all purchase orders"
          showHeader={true}
          emptyMessage="No purchase orders found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;