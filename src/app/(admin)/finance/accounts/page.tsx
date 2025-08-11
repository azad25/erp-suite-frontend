"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { DollarLineIcon, CheckCircleIcon, BoxIcon } from "@/icons";


const AccountsPage = () => {
  const [accounts] = useState([
    { id: "ACC-001", name: "Main Business Account", type: "Bank Account", bank: "Chase Bank", accountNumber: "****1234", balance: "$125,450.00", status: "Active" },
    { id: "ACC-002", name: "Petty Cash", type: "Cash Account", bank: "-", accountNumber: "-", balance: "$2,500.00", status: "Active" },
    { id: "ACC-003", name: "Savings Account", type: "Bank Account", bank: "Wells Fargo", accountNumber: "****5678", balance: "$50,000.00", status: "Active" },
    { id: "ACC-004", name: "Payroll Account", type: "Bank Account", bank: "Bank of America", accountNumber: "****9012", balance: "$75,200.00", status: "Active" },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bank Account": return "primary";
      case "Cash Account": return "success";
      case "Credit Account": return "warning";
      default: return "light";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "light";
      case "Frozen": return "error";
      default: return "light";
    }
  };



  return (
    <DashboardLayout title="Accounts" description="Manage your financial accounts">
      <ComponentCard
        title="Financial Accounts"
        desc="View and manage all your business accounts"
      >
        <div className="flex justify-end mb-6">
          <Button>Add Account</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Balance"
            value="$253K"
            icon={<DollarLineIcon />}
            color="blue"
          />
          <StatsCard
            title="Active Accounts"
            value="4"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatsCard
            title="Main Account"
            value="$125K"
            icon={<BoxIcon />}
            color="purple"
          />
          <StatsCard
            title="Cash on Hand"
            value="$2.5K"
            icon={<DollarLineIcon />}
            color="yellow"
          />
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Account Name
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Bank/Institution
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Account Number
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Balance
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
            {accounts.map((account) => (
              <TableRow key={account.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{account.name}</div>
                    <div className="text-xs text-gray-500">{account.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getTypeColor(account.type)}>
                    {account.type}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {account.bank}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {account.accountNumber}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {account.balance}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getStatusColor(account.status)}>
                    {account.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Edit</Button>
                  <Button variant="link">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default AccountsPage;