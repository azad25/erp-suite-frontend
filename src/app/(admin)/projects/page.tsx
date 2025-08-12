"use client";
import React, { lazy, Suspense, useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import LoadingLogo from "@/components/common/LoadingLogo";
import { ListIcon, CheckCircleIcon, TimeIcon, DollarLineIcon, EyeIcon, EditIcon } from "@/icons";

const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyButton = lazy(() => import("@/components/ui/button/Button"));
const LazyDataTable = lazy(() => import("@/components/common/DataTable"));
const LazyComponentCard = lazy(() => import("@/components/common/ComponentCard"));

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
    <Suspense fallback={<LoadingLogo withText />}>
      <DashboardLayout
        title="Project Management"
        description="Manage your projects, tasks, and team collaboration"
        icon={<ListIcon />}
      >
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <LazyStatsCard
            title="Active Projects"
            value="12"
            icon={<ListIcon />}
            color="blue"
          />
          <LazyStatsCard
            title="In Progress"
            value="8"
            icon={<TimeIcon />}
            color="yellow"
          />
          <LazyStatsCard
            title="Completed"
            value="25"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <LazyStatsCard
            title="Total Value"
            value="$2.5M"
            icon={<DollarLineIcon />}
            color="purple"
          />
        </div>

        {/* Projects Table */}
        <Suspense fallback={<LoadingLogo withText />}>
          <LazyComponentCard 
            title="Project List" 
            desc="Complete list of projects with status and progress information"
          >
            <div className="flex justify-end mb-6">
              <LazyButton>Create Project</LazyButton>
            </div>

            <LazyDataTable
              data={projects}
              columns={[
                {
                  key: "name",
                  header: "Project Name",
                  render: (project: any) => (
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.id}</div>
                    </div>
                  ),
                },
                {
                  key: "client",
                  header: "Client",
                },
                {
                  key: "manager",
                  header: "Manager",
                },
                {
                  key: "progress",
                  header: "Progress",
                  render: (project: any) => (
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-brand-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      {project.progress}%
                    </div>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (project: any) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  ),
                },
                {
                  key: "deadline",
                  header: "Deadline",
                },
              ]}
              actions={[
                {
                  key: "view",
                  label: "View",
                  icon: <EyeIcon className="w-4 h-4" />,
                  onClick: (project: any) => console.log("View project:", project),
                  variant: "ghost",
                },
                {
                  key: "edit",
                  label: "Edit",
                  icon: <EditIcon className="w-4 h-4" />,
                  onClick: (project: any) => console.log("Edit project:", project),
                  variant: "ghost",
                },
              ]}
              searchable={true}
              searchPlaceholder="Search projects..."
              searchKeys={["name", "client", "manager"] as any}
              title="Project List"
              description="Complete list of projects with status and progress information"
              showHeader={true}
              emptyMessage="No projects found"
              sortable={true}
            />
          </LazyComponentCard>
        </Suspense>
      </DashboardLayout>
    </Suspense>
  );
};

export default ProjectsPage;