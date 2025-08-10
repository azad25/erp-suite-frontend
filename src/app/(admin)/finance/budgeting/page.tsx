"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const BudgetingPage = () => {
  const [budgets] = useState([
    { id: "BUD-001", category: "Marketing", budgeted: "$50,000", actual: "$45,200", variance: "-$4,800", percentage: 90.4, status: "On Track", period: "Q1 2024" },
    { id: "BUD-002", category: "Operations", budgeted: "$120,000", actual: "$135,500", variance: "+$15,500", percentage: 112.9, status: "Over Budget", period: "Q1 2024" },
    { id: "BUD-003", category: "IT & Technology", budgeted: "$75,000", actual: "$68,300", variance: "-$6,700", percentage: 91.1, status: "Under Budget", period: "Q1 2024" },
    { id: "BUD-004", category: "Human Resources", budgeted: "$200,000", actual: "$198,750", variance: "-$1,250", percentage: 99.4, status: "On Track", period: "Q1 2024" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Under Budget": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Over Budget": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "At Risk": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getVarianceColor = (variance: string) => {
    if (variance.startsWith('+')) return 'text-red-600 dark:text-red-400';
    if (variance.startsWith('-')) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Budgeting" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Budget Management
          </h3>
          <Button>Create Budget</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$445K</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Budget</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$447.75K</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Actual Spend</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">+$2.75K</div>
            <div className="text-sm text-red-700 dark:text-red-300">Over Budget</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">100.6%</div>
            <div className="text-sm text-green-700 dark:text-green-300">Budget Utilization</div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>Q1 2024</option>
            <option>Q2 2024</option>
            <option>Q3 2024</option>
            <option>Q4 2024</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Categories</option>
            <option>Marketing</option>
            <option>Operations</option>
            <option>IT & Technology</option>
            <option>Human Resources</option>
          </select>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Budgeted
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actual
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Variance
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Utilization
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Period
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{budget.category}</div>
                    <div className="text-xs text-gray-500">{budget.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {budget.budgeted}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {budget.actual}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={getVarianceColor(budget.variance)}>
                    {budget.variance}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          budget.percentage > 100 ? 'bg-red-600' :
                          budget.percentage > 90 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                    {budget.percentage}%
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(budget.status)}`}>
                    {budget.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {budget.period}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Edit</Button>
                  <Button variant="link">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BudgetingPage;