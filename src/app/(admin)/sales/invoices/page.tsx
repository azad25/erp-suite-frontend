"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { DollarLineIcon, PlusIcon, CheckCircleIcon, AlertIcon } from "@/icons";

const InvoicesPage = () => {
  const [invoices] = useState([
    { id: "INV-001", customer: "Tech Corp", amount: "$25,000", status: "Paid", dueDate: "2024-03-15", issueDate: "2024-02-15" },
    { id: "INV-002", customer: "Design Studio", amount: "$12,000", status: "Pending", dueDate: "2024-03-20", issueDate: "2024-02-18" },
    { id: "INV-003", customer: "Marketing Inc", amount: "$8,500", status: "Overdue", dueDate: "2024-02-25", issueDate: "2024-01-25" },
    { id: "INV-004", customer: "Startup Inc", amount: "$15,750", status: "Draft", dueDate: "2024-03-25", issueDate: "2024-02-20" },
    { id: "INV-005", customer: "Enterprise Ltd", amount: "$32,000", status: "Sent", dueDate: "2024-03-30", issueDate: "2024-02-22" },
  ]);

  return (
    <DashboardLayout
      title="Sales Invoices"
      description="Manage and track sales invoices and payments"
      icon={<DollarLineIcon />}
    >
      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search invoices..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Status</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Pending</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
          <Button startIcon={<PlusIcon />}>Create Invoice</Button>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Invoice ID
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
                Issue Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Due Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.id}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {invoice.customer}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.amount}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant="light" 
                    color={
                      invoice.status === "Paid" ? "success" :
                      invoice.status === "Overdue" ? "error" :
                      invoice.status === "Pending" ? "warning" :
                      invoice.status === "Sent" ? "info" : "light"
                    }
                    size="sm"
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {invoice.issueDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {invoice.dueDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">View</Button>
                  <Button variant="link" className="mr-4">Send</Button>
                  <Button variant="link">Record Payment</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default InvoicesPage;