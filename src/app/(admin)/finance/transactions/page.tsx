"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, EditIcon, ReceiptIcon } from "@/icons";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: string;
  type: "Income" | "Expense" | "Transfer";
  reference: string;
}

const TransactionsPage = () => {
  const [transactions] = useState<Transaction[]>([
    { id: "TXN-001", date: "2024-02-26", description: "Office Rent Payment", category: "Expense", account: "Main Business Account", amount: "-$5,000", type: "Expense", reference: "BILL-001" },
    { id: "TXN-002", date: "2024-02-25", description: "Client Payment - Tech Corp", category: "Revenue", account: "Main Business Account", amount: "+$25,000", type: "Income", reference: "INV-001" },
    { id: "TXN-003", date: "2024-02-24", description: "Software License Purchase", category: "Expense", account: "Main Business Account", amount: "-$2,500", type: "Expense", reference: "PO-002" },
    { id: "TXN-004", date: "2024-02-23", description: "Consulting Service Payment", category: "Revenue", account: "Main Business Account", amount: "+$8,000", type: "Income", reference: "INV-003" },
    { id: "TXN-005", date: "2024-02-22", description: "Utility Bill Payment", category: "Expense", account: "Main Business Account", amount: "-$850", type: "Expense", reference: "BILL-002" },
    { id: "TXN-006", date: "2024-02-21", description: "Product Sales Revenue", category: "Revenue", account: "Main Business Account", amount: "+$12,500", type: "Income", reference: "INV-004" },
  ]);

  const handleViewTransaction = (transaction: Transaction) => {
    console.log("View transaction:", transaction);
    // Navigate to transaction detail page
  };

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("Edit transaction:", transaction);
    // Navigate to edit transaction page
  };

  const handleViewReceipt = (transaction: Transaction) => {
    console.log("View receipt for transaction:", transaction);
    // Open receipt modal or navigate to receipt page
  };

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      searchable: true,
      render: (transaction) => (
        <span className="text-gray-800 dark:text-white/90">{transaction.date}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      searchable: true,
      render: (transaction) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{transaction.description}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.reference}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      searchable: true,
    },
    {
      key: "account",
      header: "Account",
      searchable: true,
    },
    {
      key: "type",
      header: "Type",
      render: (transaction) => {
        const typeColors = {
          Income: "success" as const,
          Expense: "error" as const,
          Transfer: "info" as const,
        };
        return (
          <Badge color={typeColors[transaction.type]}>
            {transaction.type}
          </Badge>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (transaction) => (
        <span className={`font-medium ${transaction.amount.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {transaction.amount}
        </span>
      ),
    },
  ];

  const actions: DataTableAction<Transaction>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewTransaction,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: handleEditTransaction,
      variant: "ghost",
    },
    {
      key: "receipt",
      label: "Receipt",
      icon: <ReceiptIcon className="w-4 h-4" />,
      onClick: handleViewReceipt,
      variant: "ghost",
    },
  ];

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

        <DataTable
          data={transactions}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search transactions..."
          searchKeys={["description", "category", "account", "reference"]}
          title="Transaction History"
          description="View and manage all financial transactions"
          showHeader={true}
          emptyMessage="No transactions found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;