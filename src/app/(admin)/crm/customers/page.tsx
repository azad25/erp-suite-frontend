"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { UserCircleIcon, PlusIcon, EyeIcon, PencilIcon as EditIcon, MailIcon as MessageIcon } from "@/icons";

interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  type: "Enterprise" | "SMB" | "Individual";
  status: "Active" | "Inactive";
  lastContact: string;
}

const CustomersPage = () => {
  const [customers] = useState<Customer[]>([
    { id: "CUS-001", name: "Tech Corp", contact: "John Smith", email: "john@techcorp.com", phone: "+1234567890", type: "Enterprise", status: "Active", lastContact: "2024-02-20" },
    { id: "CUS-002", name: "Design Studio", contact: "Sarah Johnson", email: "sarah@design.com", phone: "+1234567891", type: "SMB", status: "Active", lastContact: "2024-02-18" },
    { id: "CUS-003", name: "Marketing Inc", contact: "Mike Wilson", email: "mike@marketing.com", phone: "+1234567892", type: "SMB", status: "Inactive", lastContact: "2024-01-15" },
    { id: "CUS-004", name: "Startup XYZ", contact: "Emily Davis", email: "emily@startup.com", phone: "+1234567893", type: "SMB", status: "Active", lastContact: "2024-02-22" },
    { id: "CUS-005", name: "Enterprise Solutions", contact: "David Brown", email: "david@enterprise.com", phone: "+1234567894", type: "Enterprise", status: "Active", lastContact: "2024-02-25" },
    { id: "CUS-006", name: "Freelance Developer", contact: "Alex Chen", email: "alex@freelance.com", phone: "+1234567895", type: "Individual", status: "Active", lastContact: "2024-02-19" },
  ]);

  const handleViewCustomer = (customer: Customer) => {
    console.log("View customer:", customer);
    // Navigate to customer detail page
  };

  const handleEditCustomer = (customer: Customer) => {
    console.log("Edit customer:", customer);
    // Navigate to edit customer page
  };

  const handleContactCustomer = (customer: Customer) => {
    console.log("Contact customer:", customer);
    // Open contact form or communication modal
  };

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      searchable: true,
      render: (customer) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{customer.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{customer.id}</div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact Person",
      searchable: true,
    },
    {
      key: "email",
      header: "Contact Info",
      searchable: true,
      render: (customer) => (
        <div>
          <div className="text-gray-800 dark:text-white/90">{customer.email}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">{customer.phone}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (customer) => {
        const typeColors = {
          Enterprise: "primary" as const,
          SMB: "info" as const,
          Individual: "success" as const,
        };
        return (
          <Badge color={typeColors[customer.type]}>
            {customer.type}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (customer) => (
        <Badge color={customer.status === "Active" ? "success" : "light"}>
          {customer.status}
        </Badge>
      ),
    },
    {
      key: "lastContact",
      header: "Last Contact",
      render: (customer) => (
        <span className="text-gray-800 dark:text-white/90">{customer.lastContact}</span>
      ),
    },
  ];

  const actions: DataTableAction<Customer>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewCustomer,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: handleEditCustomer,
      variant: "ghost",
    },
    {
      key: "contact",
      label: "Contact",
      icon: <MessageIcon className="w-4 h-4" />,
      onClick: handleContactCustomer,
      variant: "ghost",
    },
  ];

  return (
    <DashboardLayout
      title="Customer Management"
      description="Manage customer relationships and contact information"
      icon={<UserCircleIcon />}
    >
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Customers"
          value="245"
          icon={<UserCircleIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Customers"
          value="198"
          icon={<UserCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Enterprise"
          value="45"
          icon={<UserCircleIcon />}
          color="purple"
        />
        <StatsCard
          title="New This Month"
          value="25"
          icon={<PlusIcon />}
          color="yellow"
        />
      </div>

      {/* Customer List */}
      <ComponentCard 
        title="Customer Directory" 
        desc="Complete list of customers with contact information and status"
      >
        <div className="flex justify-end mb-6">
          <Button startIcon={<PlusIcon />}>Add Customer</Button>
        </div>

        <DataTable
          data={customers}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search customers..."
          searchKeys={["name", "contact", "email", "type"]}
          title="Customer List"
          description="Manage all customer relationships and contact information"
          showHeader={true}
          emptyMessage="No customers found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
};

export default CustomersPage;