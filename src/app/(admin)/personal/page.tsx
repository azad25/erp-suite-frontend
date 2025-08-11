"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import FeatureCard from "@/components/common/FeatureCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/Tabs";
import { 
  UserIcon, 
  DollarLineIcon, 
  ListIcon, 
  BoxIcon, 
  TimeIcon,
  CalenderIcon,
  DocsIcon,
  TaskIcon,
  CheckCircleIcon,
  PlusIcon,
  BellIcon
} from "@/icons";

const PersonalDashboardPage = () => {
  const personalFeatures = [
    {
      title: "Personal Finance",
      description: "Track expenses, budgets, and financial goals",
      icon: <DollarLineIcon className="w-8 h-8" />,
      path: "/personal/finance",
      color: "green" as const,
      stats: "$2,450 this month",
    },
    {
      title: "Task Management",
      description: "Organize tasks, projects, and deadlines",
      icon: <TaskIcon className="w-8 h-8" />,
      path: "/personal/tasks",
      color: "blue" as const,
      stats: "8 pending tasks",
    },
    {
      title: "Document Vault",
      description: "Secure storage for personal documents",
      icon: <DocsIcon className="w-8 h-8" />,
      path: "/personal/documents",
      color: "purple" as const,
      stats: "45 documents",
    },
    {
      title: "Calendar & Events",
      description: "Schedule and manage personal events",
      icon: <CalenderIcon className="w-8 h-8" />,
      path: "/personal/calendar",
      color: "indigo" as const,
      stats: "12 upcoming events",
    },
    {
      title: "Notes & Ideas",
      description: "Capture thoughts and organize ideas",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/personal/notes",
      color: "yellow" as const,
      stats: "23 notes",
    },
    {
      title: "Goal Tracking",
      description: "Set and monitor personal goals",
      icon: <CheckCircleIcon className="w-8 h-8" />,
      path: "/personal/goals",
      color: "red" as const,
      stats: "5 active goals",
    },
  ];

  const recentTasks = [
    { task: "Review quarterly budget", priority: "high", due: "Today" },
    { task: "Update insurance documents", priority: "medium", due: "Tomorrow" },
    { task: "Plan weekend trip", priority: "low", due: "This week" },
    { task: "Organize photo collection", priority: "low", due: "Next week" },
  ];

  const upcomingEvents = [
    { event: "Team meeting", time: "2:00 PM", date: "Today" },
    { event: "Doctor appointment", time: "10:30 AM", date: "Tomorrow" },
    { event: "Birthday party", time: "6:00 PM", date: "Saturday" },
    { event: "Conference call", time: "9:00 AM", date: "Monday" },
  ];

  const financialSummary = [
    { category: "Income", amount: "$5,200", change: "+12%" },
    { category: "Expenses", amount: "$2,450", change: "-5%" },
    { category: "Savings", amount: "$2,750", change: "+18%" },
    { category: "Investments", amount: "$12,500", change: "+7%" },
  ];

  return (
    <DashboardLayout
      title="Personal Workspace"
      description="Your personal productivity and life management hub"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Tasks"
          value="8"
          icon={<TaskIcon />}
          color="blue"
        />
        <StatsCard
          title="Monthly Expenses"
          value="$2,450"
          icon={<DollarLineIcon />}
          color="red"
        />
        <StatsCard
          title="Documents"
          value="45"
          icon={<DocsIcon />}
          color="green"
        />
        <StatsCard
          title="Upcoming Events"
          value="12"
          icon={<CalenderIcon />}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Personal Features */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    path={feature.path}
                    color={feature.color}
                    stats={feature.stats}
                    className="h-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Overview */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Recent Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Button size="sm" variant="ghost">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTasks.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {item.task}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {item.due}
                      </p>
                    </div>
                    <Badge 
                      color={
                        item.priority === "high" ? "error" :
                        item.priority === "medium" ? "warning" : "info"
                      }
                      size="sm"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button size="sm" variant="ghost">
                <CalenderIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.event}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.time} • {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Overview & Quick Actions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Financial Summary */}
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {financialSummary.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {item.category}
                      </p>
                      <Badge 
                        color={item.change.startsWith('+') ? "success" : "error"}
                        size="sm"
                      >
                        {item.change}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tasks">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                  <TabsTrigger value="docs">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tasks" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ListIcon className="w-4 h-4 mr-2" />
                    View All Tasks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Mark Completed
                  </Button>
                </TabsContent>
                
                <TabsContent value="finance" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarLineIcon className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Set Budget Goal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DocsIcon className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </TabsContent>
                
                <TabsContent value="docs" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BoxIcon className="w-4 h-4 mr-2" />
                    Organize Files
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DocsIcon className="w-4 h-4 mr-2" />
                    Create Folder
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PersonalDashboardPage;