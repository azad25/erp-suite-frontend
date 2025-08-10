"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const AIAlertsPage = () => {
  const [alerts] = useState([
    { id: "ALT-001", type: "Anomaly Detection", title: "Unusual Sales Pattern", description: "Sales dropped 40% compared to last week", severity: "High", status: "Active", triggered: "2024-02-26 09:15", category: "Sales" },
    { id: "ALT-002", type: "Threshold Alert", title: "Low Inventory Warning", description: "Laptop Pro stock below minimum threshold", severity: "Medium", status: "Acknowledged", triggered: "2024-02-25 14:30", category: "Inventory" },
    { id: "ALT-003", type: "Predictive Alert", title: "Customer Churn Risk", description: "Tech Corp showing signs of potential churn", severity: "High", status: "Active", triggered: "2024-02-24 11:45", category: "CRM" },
    { id: "ALT-004", type: "Financial Alert", title: "Cash Flow Warning", description: "Projected cash shortage in 15 days", severity: "Critical", status: "Escalated", triggered: "2024-02-23 16:20", category: "Finance" },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "High": return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Acknowledged": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Resolved": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Escalated": return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sales": return "📈";
      case "Inventory": return "📦";
      case "CRM": return "👥";
      case "Finance": return "💰";
      case "System": return "⚙️";
      default: return "🚨";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="AI Alerts" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI-Driven Alert System
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Configure Alerts</Button>
            <Button>Mark All Read</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-red-700 dark:text-red-300">Active Alerts</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Critical</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">High Priority</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-green-700 dark:text-green-300">Resolved Today</div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Categories</option>
            <option>Sales</option>
            <option>Inventory</option>
            <option>CRM</option>
            <option>Finance</option>
            <option>System</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Acknowledged</option>
            <option>Resolved</option>
            <option>Escalated</option>
          </select>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Alert
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Severity
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Triggered
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div className="flex items-center">
                      <span className="mr-2">{getCategoryIcon(alert.category)}</span>
                      {alert.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{alert.description}</div>
                    <div className="text-xs text-gray-400">{alert.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {alert.type}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {alert.category}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {alert.triggered}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">View</Button>
                  <Button variant="link" className="mr-4">Acknowledge</Button>
                  <Button variant="link">Escalate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AIAlertsPage;