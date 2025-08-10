"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const ConversationsPage = () => {
  const [conversations] = useState([
    { id: "CONV-001", subject: "Project Update Discussion", participants: ["John Smith", "Sarah Johnson"], lastMessage: "Let's schedule a meeting for next week", unread: 2, lastActivity: "2024-02-26 14:30", status: "Active" },
    { id: "CONV-002", subject: "Budget Review Q1", participants: ["Mike Wilson", "Alice Cooper"], lastMessage: "The numbers look good for this quarter", unread: 0, lastActivity: "2024-02-25 16:45", status: "Active" },
    { id: "CONV-003", subject: "Customer Feedback Analysis", participants: ["Sarah Johnson", "Bob Johnson"], lastMessage: "We need to address the delivery concerns", unread: 5, lastActivity: "2024-02-24 11:20", status: "Urgent" },
    { id: "CONV-004", subject: "New Product Launch", participants: ["John Smith", "Carol Smith", "Mike Wilson"], lastMessage: "Marketing materials are ready for review", unread: 1, lastActivity: "2024-02-23 09:15", status: "Active" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Urgent": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Archived": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Conversations" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Team Conversations
          </h3>
          <Button>Start New Conversation</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Conversations</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-green-700 dark:text-green-300">Active</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-sm text-red-700 dark:text-red-300">Unread Messages</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Urgent</div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Urgent</option>
            <option>Archived</option>
          </select>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subject
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Participants
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Message
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Unread
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Activity
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
            {conversations.map((conversation) => (
              <TableRow key={conversation.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div className="flex items-center">
                      {conversation.unread > 0 && (
                        <div className="w-2 h-2 bg-brand-500 rounded-full mr-2"></div>
                      )}
                      {conversation.subject}
                    </div>
                    <div className="text-xs text-gray-500">{conversation.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex flex-wrap gap-1">
                    {conversation.participants.map((participant, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {participant}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                  {conversation.lastMessage}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {conversation.unread > 0 ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-brand-100 text-brand-800 dark:bg-brand-800 dark:text-brand-100">
                      {conversation.unread}
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {conversation.lastActivity}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conversation.status)}`}>
                    {conversation.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Open</Button>
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

export default ConversationsPage;