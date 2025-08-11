"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { UserCircleIcon, PlusIcon } from "@/icons";

const CustomersPage = () => {
  const [customers] = useState([
    { id: "CUS-001", name: "Tech Corp", contact: "John Smith", email: "john@techcorp.com", phone: "+1234567890", type: "Enterprise", status: "Active", lastContact: "2024-02-20" },
    { id: "CUS-002", name: "Design Studio", contact: "Sarah Johnson", email: "sarah@design.com", phone: "+1234567891", type: "SMB", status: "Active", lastContact: "2024-02-18" },
    { id: "CUS-003", name: "Marketing Inc", contact: "Mike Wilson", email: "mike@marketing.com", phone: "+1234567892", type: "SMB", status: "Inactive", lastContact: "2024-01-15" },
  ]);

  return (
    <DashboardLayout
      title="Customer Management"
      description="Manage customer relationships and contact information"
      icon={<UserCircleIcon />}
    >
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Types</option>
              <option>Enterprise</option>
              <option>SMB</option>
              <option>Individual</option>
            </select>
          </div>
          <Button startIcon={<PlusIcon />}>Add Customer</Button>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact Person
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact Info
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Contact
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.contact}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div>
                    <div>{customer.email}</div>
                    <div className="text-xs text-gray-400">{customer.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant="light" 
                    color={
                      customer.type === "Enterprise" ? "primary" :
                      customer.type === "SMB" ? "info" : "success"
                    }
                    size="sm"
                  >
                    {customer.type}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant="light" 
                    color={customer.status === "Active" ? "success" : "light"}
                    size="sm"
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.lastContact}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Edit</Button>
                  <Button variant="link">View Profile</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default CustomersPage;