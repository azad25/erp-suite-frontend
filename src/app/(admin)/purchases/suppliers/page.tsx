"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { UserIcon, CheckCircleIcon, ShootingStarIcon, PieChartIcon, EyeIcon, PencilIcon, MessageIcon } from "@/icons";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
  status: "Active" | "Inactive" | "Suspended";
}

const SuppliersPage = () => {
  const [suppliers] = useState<Supplier[]>([
    { id: "SUP-001", name: "Tech Solutions Ltd", contact: "John Doe", email: "john@techsolutions.com", phone: "+1234567890", rating: 4.5, status: "Active" },
    { id: "SUP-002", name: "Office Supplies Co", contact: "Jane Smith", email: "jane@officesupplies.com", phone: "+1234567891", rating: 4.2, status: "Active" },
    { id: "SUP-003", name: "Manufacturing Parts Inc", contact: "Mike Johnson", email: "mike@mfgparts.com", phone: "+1234567892", rating: 3.8, status: "Inactive" },
    { id: "SUP-004", name: "Software Licenses Co", contact: "Sarah Wilson", email: "sarah@softwarelicenses.com", phone: "+1234567893", rating: 4.8, status: "Active" },
    { id: "SUP-005", name: "Consulting Services", contact: "David Brown", email: "david@consulting.com", phone: "+1234567894", rating: 2.5, status: "Suspended" },
  ]);

  const handleViewSupplier = (supplier: Supplier) => {
    console.log("View supplier:", supplier);
    // Navigate to supplier detail page
  };

  const handleEditSupplier = (supplier: Supplier) => {
    console.log("Edit supplier:", supplier);
    // Navigate to edit supplier page
  };

  const handleContactSupplier = (supplier: Supplier) => {
    console.log("Contact supplier:", supplier);
    // Open contact modal
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "name",
      header: "Supplier",
      searchable: true,
      render: (supplier) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{supplier.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{supplier.id}</div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact Person",
      searchable: true,
    },
    {
      key: "contactInfo",
      header: "Contact Info",
      render: (supplier) => (
        <div>
          <div className="text-gray-800 dark:text-white/90">{supplier.email}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{supplier.phone}</div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (supplier) => renderStars(supplier.rating),
    },
    {
      key: "status",
      header: "Status",
      render: (supplier) => {
        const statusColors = {
          Active: "success" as const,
          Inactive: "light" as const,
          Suspended: "error" as const,
        };
        return (
          <Badge color={statusColors[supplier.status]}>
            {supplier.status}
          </Badge>
        );
      },
    },
  ];

  const actions: DataTableAction<Supplier>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewSupplier,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditSupplier,
      variant: "ghost",
      hidden: (supplier) => supplier.status === "Suspended",
    },
    {
      key: "contact",
      label: "Contact",
      icon: <MessageIcon className="w-4 h-4" />,
      onClick: handleContactSupplier,
      variant: "ghost",
    },
  ];

  return (
    <DashboardLayout title="Suppliers" description="Manage your supplier relationships">
      <ComponentCard
        title="Supplier Management"
        desc="View and manage all your business suppliers"
      >
        <div className="flex justify-end mb-6">
          <Button>Add Supplier</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Suppliers"
            value="48"
            icon={<UserIcon />}
            color="blue"
          />
          <StatsCard
            title="Active Suppliers"
            value="42"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatsCard
            title="Average Rating"
            value="4.2"
            icon={<ShootingStarIcon />}
            color="yellow"
          />
          <StatsCard
            title="Performance"
            value="92%"
            icon={<PieChartIcon />}
            color="purple"
          />
        </div>

        <DataTable
          data={suppliers}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search suppliers..."
          searchKeys={["name", "contact", "email"]}
          title="Supplier Management"
          description="View and manage all your business suppliers"
          showHeader={true}
          emptyMessage="No suppliers found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
};

export default SuppliersPage;