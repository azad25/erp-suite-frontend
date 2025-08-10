"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const QuotationsPage = () => {
  const [quotations] = useState([
    { id: "QUO-001", customer: "Tech Corp", amount: "$25,000", status: "Sent", validUntil: "2024-03-15", createdDate: "2024-02-15" },
    { id: "QUO-002", customer: "Design Studio", amount: "$12,000", status: "Accepted", validUntil: "2024-03-20", createdDate: "2024-02-18" },
    { id: "QUO-003", customer: "Marketing Inc", amount: "$8,500", status: "Draft", validUntil: "2024-03-25", createdDate: "2024-02-20" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "Sent": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Accepted": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Rejected": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Quotations" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Quotations
          </h3>
          <Button>Create Quotation</Button>
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
              <TableRow key={quotation.id} className="border-b border-gray-200 dark:border-gray-700">
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
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
                    {quotation.status}
                  </span>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuotationsPage;