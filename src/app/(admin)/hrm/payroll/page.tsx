"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const PayrollPage = () => {
  const [payrollRecords] = useState([
    { id: "PAY-001", employee: "John Smith", position: "Software Engineer", baseSalary: "$8,000", overtime: "$500", deductions: "$800", netPay: "$7,700", status: "Processed", payDate: "2024-02-28" },
    { id: "PAY-002", employee: "Sarah Johnson", position: "Marketing Manager", baseSalary: "$7,500", overtime: "$0", deductions: "$750", netPay: "$6,750", status: "Processed", payDate: "2024-02-28" },
    { id: "PAY-003", employee: "Mike Wilson", position: "Sales Representative", baseSalary: "$6,000", overtime: "$300", deductions: "$630", netPay: "$5,670", status: "Pending", payDate: "2024-02-28" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Failed": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Payroll" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payroll Management
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Generate Payslips</Button>
            <Button>Process Payroll</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$125K</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Payroll</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">118</div>
            <div className="text-sm text-green-700 dark:text-green-300">Employees Paid</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">7</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Pending</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$15K</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Tax Deductions</div>
          </div>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employee
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Position
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Base Salary
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Overtime
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Deductions
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Net Pay
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollRecords.map((record) => (
              <TableRow key={record.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{record.employee}</div>
                    <div className="text-xs text-gray-500">{record.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.position}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {record.baseSalary}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.overtime}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                  {record.deductions}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                  {record.netPay}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">View Payslip</Button>
                  <Button variant="link">Process</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollPage;