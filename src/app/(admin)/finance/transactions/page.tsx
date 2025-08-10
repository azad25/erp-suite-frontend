"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const TransactionsPage = () => {
  const [transactions] = useState([
    { id: "TXN-001", date: "2024-02-26", description: "Office Rent Payment", category: "Expense", account: "Main Business Account", amount: "-$5,000", type: "Expense", reference: "BILL-001" },
    { id: "TXN-002", date: "2024-02-25", description: "Client Payment - Tech Corp", category: "Revenue", account: "Main Business Account", amount: "+$25,000", type: "Income", reference: "INV-001" },
    { id: "TXN-003", date: "2024-02-24", description: "Software License Purchase", category: "Expense", account: "Main Business Account", amount: "-$2,500", type: "Expense", reference: "PO-002" },
    { id: "TXN-004", date: "2024-02-23", description: "Consulting Service Payment", category: "Revenue", account: "Main Business Account", amount: "+$8,000", type: "Income", reference: "INV-003" },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Income": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Expense": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Transfer": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getAmountColor = (amount: string) => {
    return amount.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Transactions" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Financial Transactions
          </h3>
          <Button>Record Transaction</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">+$33K</div>
            <div className="text-sm text-green-700 dark:text-green-300">Total Income</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">-$7.5K</div>
            <div className="text-sm text-red-700 dark:text-red-300">Total Expenses</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">+$25.5K</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Net Income</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Transactions</div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Accounts</option>
            <option>Main Business Account</option>
            <option>Savings Account</option>
            <option>Petty Cash</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
            <option>Transfer</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue="2024-02-26"
          />
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Account
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Reference
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {transaction.date}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{transaction.description}</div>
                    <div className="text-xs text-gray-500">{transaction.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {transaction.category}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {transaction.account}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                  <span className={getAmountColor(transaction.amount)}>
                    {transaction.amount}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {transaction.reference}
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

export default TransactionsPage;