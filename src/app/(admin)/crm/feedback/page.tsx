"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PencilIcon, ShootingStarIcon } from "@/icons";

interface Feedback {
  id: string;
  customer: string;
  type: "Survey" | "Feedback" | "Review";
  subject: string;
  rating: number;
  status: "Completed" | "Reviewed" | "Pending" | "Archived";
  date: string;
  response: string;
}

const FeedbackPage = () => {
  const [feedback] = useState<Feedback[]>([
    { id: "FB-001", customer: "Tech Corp", type: "Survey", subject: "Service Quality Survey", rating: 4.5, status: "Completed", date: "2024-02-25", response: "Excellent service!" },
    { id: "FB-002", customer: "Design Studio", type: "Feedback", subject: "Product Improvement", rating: 3.8, status: "Reviewed", date: "2024-02-23", response: "Good but needs improvement" },
    { id: "FB-003", customer: "Marketing Inc", type: "Survey", subject: "Customer Satisfaction", rating: 5.0, status: "Pending", date: "2024-02-22", response: "Outstanding experience" },
    { id: "FB-004", customer: "Startup Inc", type: "Review", subject: "Product Review", rating: 4.2, status: "Completed", date: "2024-02-21", response: "Great product, highly recommend" },
    { id: "FB-005", customer: "Enterprise Solutions", type: "Survey", subject: "Support Quality", rating: 2.5, status: "Reviewed", date: "2024-02-20", response: "Support needs improvement" },
  ]);

  const handleViewFeedback = (item: Feedback) => {
    console.log("View feedback:", item);
    // Navigate to feedback detail page
  };

  const handleEditFeedback = (item: Feedback) => {
    console.log("Edit feedback:", item);
    // Navigate to edit feedback page
  };

  const handleRespondToFeedback = (item: Feedback) => {
    console.log("Respond to feedback:", item);
    // Open response modal
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

  const columns: DataTableColumn<Feedback>[] = [
    {
      key: "customer",
      header: "Customer",
      searchable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{item.customer}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{item.id}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => {
        const typeColors = {
          Survey: "info" as const,
          Feedback: "warning" as const,
          Review: "success" as const,
        };
        return (
          <Badge color={typeColors[item.type]}>
            {item.type}
          </Badge>
        );
      },
    },
    {
      key: "subject",
      header: "Subject",
      searchable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{item.subject}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{item.response}</div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (item) => renderStars(item.rating),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const statusColors = {
          Completed: "success" as const,
          Reviewed: "info" as const,
          Pending: "warning" as const,
          Archived: "light" as const,
        };
        return (
          <Badge color={statusColors[item.status]}>
            {item.status}
          </Badge>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400">{item.date}</span>
      ),
    },
  ];

  const actions: DataTableAction<Feedback>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewFeedback,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditFeedback,
      variant: "ghost",
      hidden: (item) => item.status === "Archived",
    },
    {
      key: "respond",
      label: "Respond",
      icon: <ShootingStarIcon className="w-4 h-4" />,
      onClick: handleRespondToFeedback,
      variant: "ghost",
      hidden: (item) => item.status === "Completed" || item.status === "Archived",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Feedback & Surveys" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Feedback & Surveys
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Create Survey</Button>
            <Button>Send Feedback Request</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Responses</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">4.2</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Avg Rating</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-green-700 dark:text-green-300">Satisfaction Rate</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Active Surveys</div>
          </div>
        </div>

        <DataTable
          data={feedback}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search feedback..."
          searchKeys={["customer", "subject", "response"]}
          title="Customer Feedback & Surveys"
          description="Track and manage all customer feedback and survey responses"
          showHeader={true}
          emptyMessage="No feedback found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;