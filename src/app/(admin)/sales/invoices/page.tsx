"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { DollarLineIcon, PlusIcon, CheckCircleIcon, AlertIcon, EyeIcon, SendIcon, CreditCardIcon } from "@/icons";

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue" | "Draft" | "Sent";
  dueDate: string;
  issueDate: string;
}

const InvoicesPage = () => {
  const [invoices] = useState<Invoice[]>([
    { id: "INV-001", customer: "Tech Corp", amount: "$25,000", status: "Paid", dueDate: "2024-03-15", issueDate: "2024-02-15" },
    { id: "INV-002", customer: "Design Studio", amount: "$12,000", status: "Pending", dueDate: "2024-03-20", issueDate: "2024-02-18" },
    { id: "INV-003", customer: "Marketing Inc", amount: "$8,500", status: "Overdue", dueDate: "2024-02-25", issueDate: "2024-01-25" },
    { id: "INV-004", customer: "Startup Inc", amount: "$15,750", status: "Draft", dueDate: "2024-03-25", issueDate: "2024-02-20" },
    { id: "INV-005", customer: "Enterprise Ltd", amount: "$32,000", status: "Sent", dueDate: "2024-03-30", issueDate: "2024-02-22" },
    { id: "INV-006", customer: "Consulting Group", amount: "$18,500", status: "Pending", dueDate: "2024-03-10", issueDate: "2024-02-25" },
  ]);

  const handleViewInvoice = (invoice: Invoice) => {
    // Navigate to invoice detail page
  };

  const handleSendInvoice = (invoice: Invoice) => {
    // Send invoice logic
  };

  const handleRecordPayment = (invoice: Invoice) => {
    // Record payment logic
  };

  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "id",
      header: "Invoice ID",
      searchable: true,
      render: (invoice) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{invoice.id}</span>
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
      render: (invoice) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{invoice.amount}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (invoice) => {
        const statusColors = {
          Paid: "success" as const,
          Pending: "warning" as const,
          Overdue: "error" as const,
          Draft: "light" as const,
          Sent: "info" as const,
        };
        return (
          <Badge color={statusColors[invoice.status]}>
            {invoice.status}
          </Badge>
        );
      },
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (invoice) => (
        <span className="text-gray-800 dark:text-white/90">{invoice.issueDate}</span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (invoice) => (
        <span className="text-gray-800 dark:text-white/90">{invoice.dueDate}</span>
      ),
    },
  ];

  const actions: DataTableAction<Invoice>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewInvoice,
      variant: "ghost",
    },
    {
      key: "send",
      label: "Send",
      icon: <SendIcon className="w-4 h-4" />,
      onClick: handleSendInvoice,
      variant: "ghost",
      hidden: (invoice) => invoice.status === "Paid" || invoice.status === "Sent",
    },
    {
      key: "payment",
      label: "Record Payment",
      icon: <CreditCardIcon className="w-4 h-4" />,
      onClick: handleRecordPayment,
      variant: "ghost",
      hidden: (invoice) => invoice.status === "Paid" || invoice.status === "Draft",
    },
  ];

  return (
    <DashboardLayout
      title="Sales Invoices"
      description="Manage and track sales invoices and payments"
      icon={<DollarLineIcon />}
    >
      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Invoiced"
          value="$93,250"
          icon={<DollarLineIcon />}
          color="blue"
        />
        <StatsCard
          title="Paid"
          value="$25,000"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Outstanding"
          value="$59,750"
          icon={<DollarLineIcon />}
          color="yellow"
        />
        <StatsCard
          title="Overdue"
          value="$8,500"
          icon={<AlertIcon />}
          color="red"
        />
      </div>

      {/* Invoice List */}
      <ComponentCard 
        title="Invoice Management" 
        desc="Complete list of sales invoices with payment tracking"
      >
        <div className="flex justify-end mb-6">
          <Button startIcon={<PlusIcon />}>Create Invoice</Button>
        </div>

        <DataTable
          data={invoices}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search invoices..."
          searchKeys={["id", "customer", "status"]}
          title="Invoice List"
          description="Manage and track all sales invoices"
          showHeader={true}
          emptyMessage="No invoices found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
};

export default InvoicesPage;