"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PencilIcon, UserIcon } from "@/icons";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "New" | "Qualified" | "Contacted" | "Converted" | "Lost";
  source: string;
  value: string;
}

const LeadsPage = () => {
  const [leads] = useState<Lead[]>([
    { id: 1, name: "John Smith", company: "Tech Corp", email: "john@techcorp.com", phone: "+1234567890", status: "New", source: "Website", value: "$5,000" },
    { id: 2, name: "Sarah Johnson", company: "Design Studio", email: "sarah@design.com", phone: "+1234567891", status: "Qualified", source: "Referral", value: "$12,000" },
    { id: 3, name: "Mike Wilson", company: "Marketing Inc", email: "mike@marketing.com", phone: "+1234567892", status: "Contacted", source: "Cold Call", value: "$8,500" },
    { id: 4, name: "Emily Davis", company: "StartupXYZ", email: "emily@startup.com", phone: "+1234567893", status: "Converted", source: "LinkedIn", value: "$25,000" },
    { id: 5, name: "David Brown", company: "Consulting Co", email: "david@consulting.com", phone: "+1234567894", status: "Lost", source: "Trade Show", value: "$15,000" },
  ]);

  const handleViewLead = (lead: Lead) => {
    console.log("View lead:", lead);
    // Navigate to lead detail page
  };

  const handleEditLead = (lead: Lead) => {
    console.log("Edit lead:", lead);
    // Navigate to edit lead page
  };

  const handleConvertLead = (lead: Lead) => {
    console.log("Convert lead:", lead);
    // Convert lead to opportunity
  };

  const columns: DataTableColumn<Lead>[] = [
    {
      key: "name",
      header: "Name",
      searchable: true,
      render: (lead) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{lead.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{lead.company}</div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      searchable: true,
      render: (lead) => (
        <div>
          <div className="text-gray-800 dark:text-white/90">{lead.email}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{lead.phone}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (lead) => {
        const statusColors = {
          New: "info" as const,
          Qualified: "success" as const,
          Contacted: "warning" as const,
          Converted: "success" as const,
          Lost: "error" as const,
        };
        return (
          <Badge color={statusColors[lead.status]}>
            {lead.status}
          </Badge>
        );
      },
    },
    {
      key: "source",
      header: "Source",
      searchable: true,
    },
    {
      key: "value",
      header: "Value",
      render: (lead) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{lead.value}</span>
      ),
    },
  ];

  const actions: DataTableAction<Lead>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewLead,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditLead,
      variant: "ghost",
    },
    {
      key: "convert",
      label: "Convert",
      icon: <UserIcon className="w-4 h-4" />,
      onClick: handleConvertLead,
      variant: "ghost",
      hidden: (lead) => lead.status === "Converted" || lead.status === "Lost",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Leads Management" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Leads
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Import Leads</Button>
            <Button>Add Lead</Button>
          </div>
        </div>

        <DataTable
          data={leads}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search leads..."
          searchKeys={["name", "company", "email", "source"]}
          title="Sales Leads"
          description="Manage and track all sales leads"
          showHeader={true}
          emptyMessage="No leads found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default LeadsPage;