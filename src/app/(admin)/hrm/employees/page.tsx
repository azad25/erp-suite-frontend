"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { UserIcon, CheckCircleIcon, TimeIcon, PlusIcon } from "@/icons";


const EmployeesPage = () => {
  const [employees] = useState([
    { id: "EMP-001", name: "John Smith", position: "Software Engineer", department: "IT", email: "john.smith@company.com", phone: "+1234567890", status: "Active", joinDate: "2023-01-15" },
    { id: "EMP-002", name: "Sarah Johnson", position: "Marketing Manager", department: "Marketing", email: "sarah.johnson@company.com", phone: "+1234567891", status: "Active", joinDate: "2022-08-20" },
    { id: "EMP-003", name: "Mike Wilson", position: "Sales Representative", department: "Sales", email: "mike.wilson@company.com", phone: "+1234567892", status: "On Leave", joinDate: "2023-03-10" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "On Leave": return "warning";
      case "Inactive": return "light";
      case "Terminated": return "error";
      default: return "light";
    }
  };

  const statsCards = [
    {
      title: "Total Employees",
      value: "125",
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600"
    },
    {
      title: "Active",
      value: "118",
      color: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600"
    },
    {
      title: "On Leave",
      value: "5",
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600"
    },
    {
      title: "New Hires",
      value: "8",
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600"
    }
  ];

  return (
    <DashboardLayout title="Employees" description="Manage your organization's employees">
      <ComponentCard
        title="Employee Management"
        desc="View and manage all employees in your organization"
      >
        <div className="flex justify-end mb-6">
          <Button>Add Employee</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Employees"
            value="125"
            icon={<UserIcon />}
            color="blue"
          />
          <StatsCard
            title="Active"
            value="118"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatsCard
            title="On Leave"
            value="5"
            icon={<TimeIcon />}
            color="yellow"
          />
          <StatsCard
            title="New Hires"
            value="8"
            icon={<PlusIcon />}
            color="purple"
          />
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employee
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Position
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Join Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {employee.position}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {employee.department}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div>
                    <div>{employee.email}</div>
                    <div className="text-xs text-gray-400">{employee.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {employee.joinDate}
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

export default EmployeesPage;