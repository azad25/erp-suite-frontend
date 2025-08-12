"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PencilIcon, CheckCircleIcon } from "@/icons";

interface Bill {
  id: string;
  supplier: string;
  amount: string;
  status: "Draft" | "Pending" | "Paid" | "Overdue";
  billDate: string;
  dueDate: string;
  poNumber: string;
}

const BillsPage = () => {
  const [bills] = useState<Bill[]>([
    { id: "BILL-001", supplier: "Tech Solutions Ltd", amount: "$15,000", status: "Pending", billDate: "2024-02-25", dueDate: "2024-03-25", poNumber: "PO-001" },
    { id: "BILL-002", supplier: "Office Supplies Co", amount: "$3,500", status: "Paid", billDate: "2024-02-20", dueDate: "2024-03-20", poNumber: "PO-002" },
    { id: "BILL-003", supplier: "Manufacturing Parts Inc", amount: "$25,000", status: "Overdue", billDate: "2024-01-15", dueDate: "2024-02-15", poNumber: "PO-003" },
    { id: "BILL-004", supplier: "Software Licenses Co", amount: "$8,500", status: "Draft", billDate: "2024-02-28", dueDate: "2024-03-28", poNumber: "PO-004" },
    { id: "BILL-005", supplier: "Consulting Services", amount: "$12,000", status: "Paid", billDate: "2024-02-10", dueDate: "2024-03-10", poNumber: "PO-005" },
  ]);

  const handleViewBill = (bill: Bill) => {
    console.log("View bill:", bill);
    // Navigate to bill detail page
  };

  const handleEditBill = (bill: Bill) => {
    console.log("Edit bill:", bill);
    // Navigate to edit bill page
  };

  const handlePayBill = (bill: Bill) => {
    console.log("Pay bill:", bill);
    // Process bill payment
  };

  const columns: DataTableColumn<Bill>[] = [
    {
      key: "id",
      header: "Bill Number",
      searchable: true,
      render: (bill) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{bill.id}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">PO: {bill.poNumber}</div>
        </div>
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
      render: (bill) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{bill.amount}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (bill) => {
        const statusColors = {
          Draft: "light" as const,
          Pending: "warning" as const,
          Paid: "success" as const,
          Overdue: "error" as const,
        };
        return (
          <Badge color={statusColors[bill.status]}>
            {bill.status}
          </Badge>
        );
      },
    },
    {
      key: "billDate",
      header: "Bill Date",
      render: (bill) => (
        <span className="text-gray-600 dark:text-gray-400">{bill.billDate}</span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (bill) => (
        <span className={`${bill.status === 'Overdue' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {bill.dueDate}
        </span>
      ),
    },
  ];

  const actions: DataTableAction<Bill>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewBill,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditBill,
      variant: "ghost",
      hidden: (bill) => bill.status === "Paid",
    },
    {
      key: "pay",
      label: "Pay",
      icon: <CheckCircleIcon className="w-4 h-4" />,
      onClick: handlePayBill,
      variant: "ghost",
      hidden: (bill) => bill.status === "Paid" || bill.status === "Draft",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Bills" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Supplier Bills
          </h3>
          <Button>Record Bill</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">$43.5K</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Pending Bills</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$125K</div>
            <div className="text-sm text-green-700 dark:text-green-300">Paid This Month</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">$25K</div>
            <div className="text-sm text-red-700 dark:text-red-300">Overdue</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">15</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Bills</div>
          </div>
        </div>

        <DataTable
          data={bills}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search bills..."
          searchKeys={["id", "supplier", "poNumber"]}
          title="Supplier Bills"
          description="Track and manage all supplier bills and payments"
          showHeader={true}
          emptyMessage="No bills found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default BillsPage;