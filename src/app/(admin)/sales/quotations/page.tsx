"use client";
import React, { memo, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { DocsIcon, CheckCircleIcon, DollarLineIcon } from "@/icons";

// Memoized table row component for better performance
const QuotationRow = memo(({ quotation, getStatusColor }: { 
  quotation: any; 
  getStatusColor: (status: string) => "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";
}) => (
  <TableRow className="border-b border-gray-200 dark:border-gray-700">
    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      {quotation.id}
    </TableCell>
    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
      {quotation.customer}
    </TableCell>
    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      {quotation.amount}
    </TableCell>
    <TableCell className="px-6 py-4 whitespace-nowrap">
      <Badge color={getStatusColor(quotation.status)}>
        {quotation.status}
      </Badge>
    </TableCell>
    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
      {quotation.validUntil}
    </TableCell>
    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <Button variant="link" className="mr-4">Edit</Button>
      <Button variant="link" className="mr-4">Send</Button>
      <Button variant="link">Convert to Invoice</Button>
    </TableCell>
  </TableRow>
));

QuotationRow.displayName = 'QuotationRow';

const QuotationsPage = memo(() => {
  // Static data - no need for useState
  const quotations = useMemo(() => [
    { id: "QUO-001", customer: "Tech Corp", amount: "$25,000", status: "Sent", validUntil: "2024-03-15", createdDate: "2024-02-15" },
    { id: "QUO-002", customer: "Design Studio", amount: "$12,000", status: "Accepted", validUntil: "2024-03-20", createdDate: "2024-02-18" },
    { id: "QUO-003", customer: "Marketing Inc", amount: "$8,500", status: "Draft", validUntil: "2024-03-25", createdDate: "2024-02-20" },
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

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quotation ID
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Valid Until
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((quotation) => (
              <QuotationRow 
                key={quotation.id} 
                quotation={quotation} 
                getStatusColor={getStatusColor}
              />
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </DashboardLayout>
  );
});

QuotationsPage.displayName = 'QuotationsPage';

export default QuotationsPage;