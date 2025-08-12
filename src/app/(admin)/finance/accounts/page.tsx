"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { DollarLineIcon, CheckCircleIcon, BoxIcon, EyeIcon, PencilIcon, LockIcon } from "@/icons";

interface Account {
  id: string;
  name: string;
  type: "Bank Account" | "Cash Account" | "Credit Account";
  bank: string;
  accountNumber: string;
  balance: string;
  status: "Active" | "Inactive" | "Frozen";
}

const AccountsPage = () => {
  const [accounts] = useState<Account[]>([
    { id: "ACC-001", name: "Main Business Account", type: "Bank Account", bank: "Chase Bank", accountNumber: "****1234", balance: "$125,450.00", status: "Active" },
    { id: "ACC-002", name: "Petty Cash", type: "Cash Account", bank: "-", accountNumber: "-", balance: "$2,500.00", status: "Active" },
    { id: "ACC-003", name: "Savings Account", type: "Bank Account", bank: "Wells Fargo", accountNumber: "****5678", balance: "$50,000.00", status: "Active" },
    { id: "ACC-004", name: "Payroll Account", type: "Bank Account", bank: "Bank of America", accountNumber: "****9012", balance: "$75,200.00", status: "Active" },
    { id: "ACC-005", name: "Credit Line", type: "Credit Account", bank: "Chase Bank", accountNumber: "****3456", balance: "-$15,000.00", status: "Active" },
  ]);

  const handleViewAccount = (account: Account) => {
    console.log("View account:", account);
    // Navigate to account detail page
  };

  const handleEditAccount = (account: Account) => {
    console.log("Edit account:", account);
    // Navigate to edit account page
  };

  const handleFreezeAccount = (account: Account) => {
    console.log("Freeze account:", account);
    // Freeze account
  };

  const columns: DataTableColumn<Account>[] = [
    {
      key: "name",
      header: "Account Name",
      searchable: true,
      render: (account) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{account.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{account.id}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (account) => {
        const typeColors = {
          "Bank Account": "primary" as const,
          "Cash Account": "success" as const,
          "Credit Account": "warning" as const,
        };
        return (
          <Badge color={typeColors[account.type]}>
            {account.type}
          </Badge>
        );
      },
    },
    {
      key: "bank",
      header: "Bank/Institution",
      searchable: true,
      render: (account) => (
        <span className="text-gray-600 dark:text-gray-400">{account.bank}</span>
      ),
    },
    {
      key: "accountNumber",
      header: "Account Number",
      render: (account) => (
        <span className="text-gray-600 dark:text-gray-400">{account.accountNumber}</span>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      render: (account) => (
        <span className={`font-medium ${account.balance.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white/90'}`}>
          {account.balance}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (account) => {
        const statusColors = {
          Active: "success" as const,
          Inactive: "light" as const,
          Frozen: "error" as const,
        };
        return (
          <Badge color={statusColors[account.status]}>
            {account.status}
          </Badge>
        );
      },
    },
  ];

  const actions: DataTableAction<Account>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewAccount,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditAccount,
      variant: "ghost",
      hidden: (account) => account.status === "Frozen",
    },
    {
      key: "freeze",
      label: "Freeze",
      icon: <LockIcon className="w-4 h-4" />,
      onClick: handleFreezeAccount,
      variant: "ghost",
      hidden: (account) => account.status === "Frozen",
    },
  ];

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

        <DataTable
          data={accounts}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search accounts..."
          searchKeys={["name", "bank", "type"]}
          title="Financial Accounts"
          description="View and manage all your business accounts"
          showHeader={true}
          emptyMessage="No accounts found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
};

export default AccountsPage;