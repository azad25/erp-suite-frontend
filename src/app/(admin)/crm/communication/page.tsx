"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const CommunicationPage = () => {
  const [communications] = useState([
    { id: "COM-001", customer: "Tech Corp", type: "Email", subject: "Project Update", status: "Sent", date: "2024-02-26", channel: "Email" },
    { id: "COM-002", customer: "Design Studio", type: "SMS", subject: "Payment Reminder", status: "Delivered", date: "2024-02-25", channel: "SMS" },
    { id: "COM-003", customer: "Marketing Inc", type: "WhatsApp", subject: "Meeting Confirmation", status: "Read", date: "2024-02-24", channel: "WhatsApp" },
    { id: "COM-004", customer: "Startup Inc", type: "Email", subject: "Proposal Follow-up", status: "Pending", date: "2024-02-23", channel: "Email" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Delivered": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Read": return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Failed": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
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

        <div className="mb-4 flex gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Channels</option>
            <option>Email</option>
            <option>SMS</option>
            <option>WhatsApp</option>
            <option>Phone</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Status</option>
            <option>Sent</option>
            <option>Delivered</option>
            <option>Read</option>
            <option>Pending</option>
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
                Customer
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Channel
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subject
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communications.map((comm) => (
              <TableRow key={comm.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{comm.customer}</div>
                    <div className="text-xs text-gray-500">{comm.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getChannelIcon(comm.channel)}</span>
                    {comm.channel}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {comm.subject}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(comm.status)}`}>
                    {comm.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {comm.date}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">View</Button>
                  <Button variant="link">Reply</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommunicationPage;