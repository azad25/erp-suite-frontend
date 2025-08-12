"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, CheckCircleIcon } from "@/icons";

interface Payment {
  id: string;
  invoice: string;
  customer: string;
  amount: string;
  method: string;
  status: "Completed" | "Partial" | "Pending" | "Failed";
  date: string;
}

const PaymentsPage = () => {
  const [payments] = useState<Payment[]>([
    { id: "PAY-001", invoice: "INV-001", customer: "Tech Corp", amount: "$25,000", method: "Bank Transfer", status: "Completed", date: "2024-02-20" },
    { id: "PAY-002", invoice: "INV-002", customer: "Design Studio", amount: "$6,000", method: "Credit Card", status: "Partial", date: "2024-02-22" },
    { id: "PAY-003", invoice: "INV-003", customer: "Marketing Inc", amount: "$8,500", method: "Check", status: "Pending", date: "2024-02-25" },
    { id: "PAY-004", invoice: "INV-004", customer: "Startup Inc", amount: "$12,000", method: "PayPal", status: "Failed", date: "2024-02-26" },
    { id: "PAY-005", invoice: "INV-005", customer: "Enterprise Solutions", amount: "$50,000", method: "Wire Transfer", status: "Completed", date: "2024-02-27" },
  ]);

  const handleViewPayment = (payment: Payment) => {
    console.log("View payment:", payment);
    // Navigate to payment detail page
  };

  const handleReconcilePayment = (payment: Payment) => {
    console.log("Reconcile payment:", payment);
    // Reconcile payment
  };

  const columns: DataTableColumn<Payment>[] = [
    {
      key: "id",
      header: "Payment ID",
      searchable: true,
      render: (payment) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{payment.id}</span>
      ),
    },
    {
      key: "invoice",
      header: "Invoice",
      searchable: true,
      render: (payment) => (
        <span className="text-gray-600 dark:text-gray-400">{payment.invoice}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      searchable: true,
    },
    {
      key: "amount",
      header: "Amount",
      render: (payment) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{payment.amount}</span>
      ),
    },
    {
      key: "method",
      header: "Method",
      searchable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (payment) => {
        const statusColors = {
          Completed: "success" as const,
          Partial: "warning" as const,
          Pending: "info" as const,
          Failed: "error" as const,
        };
        return (
          <Badge color={statusColors[payment.status]}>
            {payment.status}
          </Badge>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (payment) => (
        <span className="text-gray-600 dark:text-gray-400">{payment.date}</span>
      ),
    },
  ];

  const actions: DataTableAction<Payment>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewPayment,
      variant: "ghost",
    },
    {
      key: "reconcile",
      label: "Reconcile",
      icon: <CheckCircleIcon className="w-4 h-4" />,
      onClick: handleReconcilePayment,
      variant: "ghost",
      hidden: (payment) => payment.status === "Completed",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Payments" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Records
          </h3>
          <Button>Record Payment</Button>
        </div>

        <DataTable
          data={payments}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search payments..."
          searchKeys={["id", "invoice", "customer", "method"]}
          title="Payment Records"
          description="Track and manage all payment transactions"
          showHeader={true}
          emptyMessage="No payments found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default PaymentsPage;