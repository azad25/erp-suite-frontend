"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PencilIcon, PaperPlaneIcon } from "@/icons";

interface Communication {
  id: string;
  customer: string;
  type: string;
  subject: string;
  status: "Sent" | "Delivered" | "Read" | "Pending" | "Failed";
  date: string;
  channel: "Email" | "SMS" | "WhatsApp" | "Phone";
}

const CommunicationPage = () => {
  const [communications] = useState<Communication[]>([
    { id: "COM-001", customer: "Tech Corp", type: "Email", subject: "Project Update", status: "Sent", date: "2024-02-26", channel: "Email" },
    { id: "COM-002", customer: "Design Studio", type: "SMS", subject: "Payment Reminder", status: "Delivered", date: "2024-02-25", channel: "SMS" },
    { id: "COM-003", customer: "Marketing Inc", type: "WhatsApp", subject: "Meeting Confirmation", status: "Read", date: "2024-02-24", channel: "WhatsApp" },
    { id: "COM-004", customer: "Startup Inc", type: "Email", subject: "Proposal Follow-up", status: "Pending", date: "2024-02-23", channel: "Email" },
    { id: "COM-005", customer: "Enterprise Solutions", type: "Phone", subject: "Contract Discussion", status: "Failed", date: "2024-02-22", channel: "Phone" },
  ]);

  const handleViewCommunication = (communication: Communication) => {
    console.log("View communication:", communication);
    // Navigate to communication detail page
  };

  const handleEditCommunication = (communication: Communication) => {
    console.log("Edit communication:", communication);
    // Navigate to edit communication page
  };

  const handleResendCommunication = (communication: Communication) => {
    console.log("Resend communication:", communication);
    // Resend communication
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Email": return "📧";
      case "SMS": return "💬";
      case "WhatsApp": return "📱";
      case "Phone": return "📞";
      default: return "💬";
    }
  };

  const columns: DataTableColumn<Communication>[] = [
    {
      key: "customer",
      header: "Customer",
      searchable: true,
    },
    {
      key: "channel",
      header: "Channel",
      render: (communication) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getChannelIcon(communication.channel)}</span>
          <span className="text-gray-600 dark:text-gray-400">{communication.channel}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      searchable: true,
      render: (communication) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{communication.subject}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{communication.type}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (communication) => {
        const statusColors = {
          Sent: "info" as const,
          Delivered: "success" as const,
          Read: "success" as const,
          Pending: "warning" as const,
          Failed: "error" as const,
        };
        return (
          <Badge color={statusColors[communication.status]}>
            {communication.status}
          </Badge>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (communication) => (
        <span className="text-gray-600 dark:text-gray-400">{communication.date}</span>
      ),
    },
  ];

  const actions: DataTableAction<Communication>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewCommunication,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditCommunication,
      variant: "ghost",
      hidden: (communication) => communication.status === "Read" || communication.status === "Delivered",
    },
    {
      key: "resend",
      label: "Resend",
      icon: <PaperPlaneIcon className="w-4 h-4" />,
      onClick: handleResendCommunication,
      variant: "ghost",
      hidden: (communication) => communication.status === "Read" || communication.status === "Delivered",
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Communication" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Communication
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Send SMS</Button>
            <Button variant="outline">Send Email</Button>
            <Button>New Message</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">245</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Messages</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">198</div>
            <div className="text-sm text-green-700 dark:text-green-300">Delivered</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Read</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Pending</div>
          </div>
        </div>

        <DataTable
          data={communications}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search communications..."
          searchKeys={["customer", "subject", "type"]}
          title="Customer Communication"
          description="Track and manage all customer communications"
          showHeader={true}
          emptyMessage="No communications found"
          sortable={true}
        />
      </div>
    </div>
  );
};

export default CommunicationPage;