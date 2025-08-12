"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { UserIcon, CheckCircleIcon, TimeIcon, PlusIcon, EyeIcon, EditIcon, TrashIcon } from "@/icons";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
}

const EmployeesPage = () => {
  const [employees] = useState<Employee[]>([
    { id: "EMP-001", name: "John Smith", position: "Software Engineer", department: "IT", email: "john.smith@company.com", phone: "+1234567890", status: "Active", joinDate: "2023-01-15" },
    { id: "EMP-002", name: "Sarah Johnson", position: "Marketing Manager", department: "Marketing", email: "sarah.johnson@company.com", phone: "+1234567891", status: "Active", joinDate: "2022-08-20" },
    { id: "EMP-003", name: "Mike Wilson", position: "Sales Representative", department: "Sales", email: "mike.wilson@company.com", phone: "+1234567892", status: "On Leave", joinDate: "2023-03-10" },
    { id: "EMP-004", name: "Emily Davis", position: "HR Specialist", department: "Human Resources", email: "emily.davis@company.com", phone: "+1234567893", status: "Active", joinDate: "2023-02-28" },
    { id: "EMP-005", name: "David Brown", position: "Financial Analyst", department: "Finance", email: "david.brown@company.com", phone: "+1234567894", status: "Inactive", joinDate: "2022-11-15" },
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

  const handleViewProfile = (employee: Employee) => {
    console.log("View profile:", employee);
    // Navigate to employee profile page
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log("Edit employee:", employee);
    // Navigate to edit employee page
  };

  const handleDeleteEmployee = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      console.log("Delete employee:", employee);
      // Delete employee logic
    }
  };

  const columns: DataTableColumn<Employee>[] = [
    {
      key: "name",
      header: "Employee",
      searchable: true,
      render: (employee) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{employee.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{employee.id}</div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Position",
      searchable: true,
    },
    {
      key: "department",
      header: "Department",
      searchable: true,
    },
    {
      key: "email",
      header: "Contact",
      searchable: true,
      render: (employee) => (
        <div>
          <div className="text-gray-800 dark:text-white/90">{employee.email}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">{employee.phone}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (employee) => (
        <Badge color={getStatusColor(employee.status)}>
          {employee.status}
        </Badge>
      ),
    },
    {
      key: "joinDate",
      header: "Join Date",
      render: (employee) => (
        <span className="text-gray-800 dark:text-white/90">{employee.joinDate}</span>
      ),
    },
  ];

  const actions: DataTableAction<Employee>[] = [
    {
      key: "view",
      label: "View Profile",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewProfile,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: handleEditEmployee,
      variant: "ghost",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: handleDeleteEmployee,
      variant: "ghost",
      color: "error",
    },
  ];

  return (
    <DashboardLayout
      title="Employee Management"
      description="Manage your organization's employees and their information"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Employees"
          value="156"
          icon={<UserIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Employees"
          value="142"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="On Leave"
          value="8"
          icon={<TimeIcon />}
          color="yellow"
        />
        <StatsCard
          title="New This Month"
          value="6"
          icon={<PlusIcon />}
          color="purple"
        />
      </div>

      {/* Employee List Table */}
      <DataTable
        data={employees}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Search employees..."
        searchKeys={["name", "email", "position", "department"]}
        title="Employee Directory"
        description="Manage employees, view profiles, and update information"
        showHeader={true}
        emptyMessage="No employees found"
        onRowClick={handleViewProfile}
      />
    </DashboardLayout>
  );
};

export default EmployeesPage;