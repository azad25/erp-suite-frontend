"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ListIcon, UserIcon, TimeIcon, DollarLineIcon } from "@/icons";

const ProjectsPage = () => {
  const [projects] = useState([
    { 
      id: "PRJ-001", 
      name: "Website Redesign", 
      client: "Tech Corp", 
      manager: "John Smith", 
      status: "In Progress", 
      progress: 65, 
      deadline: "2024-04-15",
      budget: "$25,000"
    },
    { 
      id: "PRJ-002", 
      name: "Mobile App Development", 
      client: "Startup Inc", 
      manager: "Sarah Johnson", 
      status: "Planning", 
      progress: 15, 
      deadline: "2024-06-30",
      budget: "$80,000"
    },
    { 
      id: "PRJ-003", 
      name: "ERP Implementation", 
      client: "Manufacturing Ltd", 
      manager: "Mike Wilson", 
      status: "Completed", 
      progress: 100, 
      deadline: "2024-02-28",
      budget: "$150,000"
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "On Hold": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <DashboardLayout
      title="Project Management"
      description="Manage your projects, tasks, and team collaboration"
      icon={<ListIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Active Projects"
          value="12"
          icon={<ListIcon />}
          color="blue"
        />
        <StatsCard
          title="In Progress"
          value="8"
          icon={<TimeIcon />}
          color="yellow"
        />
        <StatsCard
          title="Completed"
          value="25"
          icon={<UserIcon />}
          color="green"
        />
        <StatsCard
          title="Total Value"
          value="$2.5M"
          icon={<DollarLineIcon />}
          color="purple"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project List
          </h3>
          <Button>Create Project</Button>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project Name
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Manager
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Progress
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Deadline
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{project.name}</div>
                    <div className="text-xs text-gray-500">{project.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.client}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.manager}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-brand-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    {project.progress}%
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.deadline}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">View</Button>
                  <Button variant="link">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;