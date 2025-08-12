"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { ListIcon, TimeIcon, CheckCircleIcon, AlertIcon, EditIcon, UpdateIcon } from "@/icons";

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string;
  progress: number;
}

const TasksPage = () => {
  const [tasks] = useState<Task[]>([
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
    { 
      id: "TSK-004", 
      title: "API Integration Testing", 
      project: "E-commerce Platform", 
      assignee: "David Wilson", 
      priority: "Low", 
      status: "Review",
      dueDate: "2024-03-20",
      progress: 90
    },
    { 
      id: "TSK-005", 
      title: "UI Component Library", 
      project: "Design System", 
      assignee: "Emma Davis", 
      priority: "Medium", 
      status: "In Progress",
      dueDate: "2024-03-25",
      progress: 60
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

  const handleEditTask = (task: Task) => {
    console.log("Edit task:", task);
    // Navigate to edit task page
  };

  const handleUpdateTask = (task: Task) => {
    console.log("Update task:", task);
    // Update task logic
  };

  const columns: DataTableColumn<Task>[] = [
    {
      key: "title",
      header: "Task",
      searchable: true,
      render: (task) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{task.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{task.id}</div>
        </div>
      ),
    },
    {
      key: "project",
      header: "Project",
      searchable: true,
    },
    {
      key: "assignee",
      header: "Assignee",
      searchable: true,
    },
    {
      key: "priority",
      header: "Priority",
      render: (task) => (
        <Badge color={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (task) => (
        <Badge color={getStatusColor(task.status)}>
          {task.status}
        </Badge>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      render: (task) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-brand-600 h-2 rounded-full" 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-800 dark:text-white/90">{task.progress}%</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (task) => (
        <span className="text-gray-800 dark:text-white/90">{task.dueDate}</span>
      ),
    },
  ];

  const actions: DataTableAction<Task>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: handleEditTask,
      variant: "ghost",
    },
    {
      key: "update",
      label: "Update",
      icon: <UpdateIcon className="w-4 h-4" />,
      onClick: handleUpdateTask,
      variant: "ghost",
    },
  ];

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

        <DataTable
          data={tasks}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search tasks..."
          searchKeys={["title", "project", "assignee", "status"]}
          title="Task List"
          description="Track and manage all project tasks and assignments"
          showHeader={true}
          emptyMessage="No tasks found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
};

export default TasksPage;