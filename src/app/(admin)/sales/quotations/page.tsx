"use client";
import React, { memo, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { DocsIcon, CheckCircleIcon, DollarLineIcon, EditIcon, SendIcon, FileTextIcon } from "@/icons";

interface Quotation {
  id: string;
  customer: string;
  amount: string;
  status: string;
  validUntil: string;
  createdDate: string;
}

const QuotationsPage = memo(() => {
  // Static data - no need for useState
  const quotations = useMemo<Quotation[]>(() => [
    { id: "QUO-001", customer: "Tech Corp", amount: "$25,000", status: "Sent", validUntil: "2024-03-15", createdDate: "2024-02-15" },
    { id: "QUO-002", customer: "Design Studio", amount: "$12,000", status: "Accepted", validUntil: "2024-03-20", createdDate: "2024-02-18" },
    { id: "QUO-003", customer: "Marketing Inc", amount: "$8,500", status: "Draft", validUntil: "2024-03-25", createdDate: "2024-02-20" },
    { id: "QUO-004", customer: "Startup XYZ", amount: "$18,000", status: "Rejected", validUntil: "2024-03-10", createdDate: "2024-02-12" },
    { id: "QUO-005", customer: "Enterprise Solutions", amount: "$45,000", status: "Sent", validUntil: "2024-03-30", createdDate: "2024-02-22" },
  ], []);

  const getStatusColor = useCallback((status: string): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
    switch (status) {
      case "Draft": return "light";
      case "Sent": return "info";
      case "Accepted": return "success";
      case "Rejected": return "error";
      default: return "light";
    }
  }, []);

  const handleEditQuotation = (quotation: Quotation) => {
    console.log("Edit quotation:", quotation);
    // Navigate to edit quotation page
  };

  const handleSendQuotation = (quotation: Quotation) => {
    console.log("Send quotation:", quotation);
    // Send quotation logic
  };

  const handleConvertToInvoice = (quotation: Quotation) => {
    console.log("Convert to invoice:", quotation);
    // Convert to invoice logic
  };

  const columns: DataTableColumn<Quotation>[] = [
    {
      key: "id",
      header: "Quotation ID",
      searchable: true,
      render: (quotation) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{quotation.id}</span>
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
      render: (quotation) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{quotation.amount}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (quotation) => (
        <Badge color={getStatusColor(quotation.status)}>
          {quotation.status}
        </Badge>
      ),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      render: (quotation) => (
        <span className="text-gray-800 dark:text-white/90">{quotation.validUntil}</span>
      ),
    },
  ];

  const actions: DataTableAction<Quotation>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: handleEditQuotation,
      variant: "ghost",
    },
    {
      key: "send",
      label: "Send",
      icon: <SendIcon className="w-4 h-4" />,
      onClick: handleSendQuotation,
      variant: "ghost",
      hidden: (quotation) => quotation.status === "Sent" || quotation.status === "Accepted",
    },
    {
      key: "convert",
      label: "Convert to Invoice",
      icon: <FileTextIcon className="w-4 h-4" />,
      onClick: handleConvertToInvoice,
      variant: "ghost",
      hidden: (quotation) => quotation.status !== "Accepted",
    },
  ];

  return (
    <DashboardLayout title="Quotations" description="Manage sales quotations and proposals">
      <ComponentCard
        title="Sales Quotations"
        desc="Create, track, and manage customer quotations"
      >
        <div className="flex justify-end mb-6">
          <Button>Create Quotation</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Quotations"
            value="24"
            icon={<DocsIcon />}
            color="blue"
          />
          <StatsCard
            title="Sent"
            value="8"
            icon={<CheckCircleIcon />}
            color="purple"
          />
          <StatsCard
            title="Accepted"
            value="12"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatsCard
            title="Total Value"
            value="$145K"
            icon={<DollarLineIcon />}
            color="yellow"
          />
        </div>

        <DataTable
          data={quotations}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search quotations..."
          searchKeys={["id", "customer", "status"]}
          title="Quotation List"
          description="Manage and track all sales quotations"
          showHeader={true}
          emptyMessage="No quotations found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
});

QuotationsPage.displayName = 'QuotationsPage';

export default QuotationsPage;