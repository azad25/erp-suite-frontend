"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PencilIcon, ArrowUpIcon } from "@/icons";

interface Opportunity {
  id: number;
  name: string;
  customer: string;
  stage: "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  probability: number;
  value: string;
  closeDate: string;
}

const OpportunitiesPage = () => {
  const [opportunities] = useState<Opportunity[]>([
    { id: 1, name: "Website Redesign", customer: "Tech Corp", stage: "Proposal", probability: 75, value: "$25,000", closeDate: "2024-03-15" },
    { id: 2, name: "ERP Implementation", customer: "Manufacturing Ltd", stage: "Negotiation", probability: 60, value: "$150,000", closeDate: "2024-04-20" },
    { id: 3, name: "Mobile App Development", customer: "Startup Inc", stage: "Qualification", probability: 40, value: "$80,000", closeDate: "2024-05-10" },
    { id: 4, name: "Cloud Migration", customer: "Enterprise Solutions", stage: "Closed Won", probability: 100, value: "$200,000", closeDate: "2024-02-28" },
    { id: 5, name: "Consulting Services", customer: "Small Business Co", stage: "Closed Lost", probability: 0, value: "$50,000", closeDate: "2024-03-01" },
  ]);

  const handleViewOpportunity = (opportunity: Opportunity) => {
    console.log("View opportunity:", opportunity);
    // Navigate to opportunity detail page
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    console.log("Edit opportunity:", opportunity);
    // Navigate to edit opportunity page
  };

  const handleUpdateStage = (opportunity: Opportunity) => {
    console.log("Update stage for opportunity:", opportunity);
    // Update opportunity stage
  };

  const columns: DataTableColumn<Opportunity>[] = [
    {
      key: "name",
      header: "Opportunity",
      searchable: true,
      render: (opportunity) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{opportunity.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{opportunity.customer}</div>
        </div>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      render: (opportunity) => {
        const stageColors = {
          Qualification: "info" as const,
          Proposal: "warning" as const,
          Negotiation: "warning" as const,
          "Closed Won": "success" as const,
          "Closed Lost": "error" as const,
        };
        return (
          <Badge color={stageColors[opportunity.stage]}>
            {opportunity.stage}
          </Badge>
        );
      },
    },
    {
      key: "probability",
      header: "Probability",
      render: (opportunity) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-brand-600 h-2 rounded-full" 
              style={{ width: `${opportunity.probability}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{opportunity.probability}%</span>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value",
      render: (opportunity) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{opportunity.value}</span>
      ),
    },
    {
      key: "closeDate",
      header: "Close Date",
      render: (opportunity) => (
        <span className="text-gray-600 dark:text-gray-400">{opportunity.closeDate}</span>
      ),
    },
  ];

  const actions: DataTableAction<Opportunity>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewOpportunity,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditOpportunity,
      variant: "ghost",
      hidden: (opportunity) => opportunity.stage === "Closed Won" || opportunity.stage === "Closed Lost",
    },
    {
      key: "updateStage",
      label: "Update Stage",
      icon: <ArrowUpIcon className="w-4 h-4" />,
      onClick: handleUpdateStage,
      variant: "ghost",
      hidden: (opportunity) => opportunity.stage === "Closed Won" || opportunity.stage === "Closed Lost",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Sales Opportunities" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Pipeline
          </h3>
          <Button>Add Opportunity</Button>
        </div>

        <DataTable
          data={opportunities}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search opportunities..."
          searchKeys={["name", "customer", "stage"]}
          title="Sales Opportunities"
          description="Manage and track all sales opportunities"
          showHeader={true}
          emptyMessage="No opportunities found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default OpportunitiesPage;