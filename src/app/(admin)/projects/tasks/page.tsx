"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ListIcon, TimeIcon, CheckCircleIcon, AlertIcon } from "@/icons";


const TasksPage = () => {
  const [tasks] = useState([
    { 
      id: "TSK-001", 
      title: "Design Homepage Mockup", 
      project: "Website Redesign", 
      assignee: "Alice Cooper", 
      priority: "High", 
      status: "In Progress",
      dueDate: "2024-03-10",
      progress: 75
    },
    { 
      id: "TSK-002", 
      title: "Database Schema Design", 
      project: "Mobile App Development", 
      assignee: "Bob Johnson", 
      priority: "Medium", 
      status: "To Do",
      dueDate: "2024-03-15",
      progress: 0
    },
    { 
      id: "TSK-003", 
      title: "User Authentication Module", 
      project: "Mobile App Development", 
      assignee: "Carol Smith", 
      priority: "High", 
      status: "Completed",
      dueDate: "2024-03-05",
      progress: 100
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "light";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do": return "light";
      case "In Progress": return "info";
      case "Review": return "warning";
      case "Completed": return "success";
      default: return "light";
    }
  };



  return (
    <DashboardLayout title="Tasks" description="Manage project tasks and assignments">
      <ComponentCard
        title="Task Management"
        desc="Track and manage all project tasks"
      >
        <div className="flex justify-end mb-6">
          <Button>Create Task</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Tasks"
            value="24"
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
            title="Pending Review"
            value="5"
            icon={<AlertIcon />}
            color="yellow"
          />
          <StatsCard
            title="Completed"
            value="11"
            icon={<CheckCircleIcon />}
            color="green"
          />
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Task
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assignee
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Priority
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Progress
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Due Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{task.title}</div>
                    <div className="text-xs text-gray-500">{task.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {task.project}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {task.assignee}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-brand-600 h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    {task.progress}%
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {task.dueDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Edit</Button>
                  <Button variant="link">Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default TasksPage;