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
  PieChartIcon,
  TimeIcon,
  CheckCircleIcon,
  PlusIcon,
  ListIcon,
  CalenderIcon,
  AlertIcon,
  DocsIcon,
  ChatIcon,
  MailIcon
} from "@/icons";

const CRMLeadsPage = () => {
  const leadFeatures = [
    {
      title: "Lead Capture",
      description: "Capture leads from multiple sources and channels",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/crm/leads/capture",
      color: "blue" as const,
      stats: "156 total leads",
    },
    {
      title: "Lead Scoring",
      description: "Automated lead scoring and qualification",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/crm/leads/scoring",
      color: "green" as const,
      stats: "23 hot leads",
    },
    {
      title: "Lead Nurturing",
      description: "Automated email campaigns and follow-ups",
      icon: <MailIcon className="w-8 h-8" />,
      path: "/crm/leads/nurturing",
      color: "purple" as const,
      stats: "12 active campaigns",
    },
    {
      title: "Lead Assignment",
      description: "Intelligent lead routing and assignment",
      icon: <CheckCircleIcon className="w-8 h-8" />,
      path: "/crm/leads/assignment",
      color: "indigo" as const,
      stats: "8 sales reps",
    },
    {
      title: "Lead Analytics",
      description: "Track lead performance and conversion metrics",
      icon: <DocsIcon className="w-8 h-8" />,
      path: "/crm/leads/analytics",
      color: "yellow" as const,
      stats: "18.5% conversion",
    },
    {
      title: "Lead Communication",
      description: "Centralized communication history and notes",
      icon: <ChatIcon className="w-8 h-8" />,
      path: "/crm/leads/communication",
      color: "red" as const,
      stats: "245 interactions",
    },
  ];

  const leadSources = [
    { source: "Website", count: 45, percentage: "29%", trend: "+12%" },
    { source: "Social Media", count: 32, percentage: "21%", trend: "+8%" },
    { source: "Email Campaign", count: 28, percentage: "18%", trend: "+15%" },
    { source: "Referrals", count: 25, percentage: "16%", trend: "+5%" },
    { source: "Trade Shows", count: 18, percentage: "12%", trend: "-3%" },
    { source: "Cold Calls", count: 8, percentage: "5%", trend: "+2%" },
  ];

  const recentLeads = [
    {
      name: "Alice Johnson",
      company: "TechStart Inc",
      score: 85,
      source: "Website",
      status: "Hot",
      lastContact: "2 hours ago",
      assignedTo: "Sarah Wilson"
    },
    {
      name: "Bob Martinez",
      company: "Global Corp",
      score: 72,
      source: "Email Campaign",
      status: "Warm",
      lastContact: "1 day ago",
      assignedTo: "Mike Chen"
    },
    {
      name: "Carol Davis",
      company: "StartupXYZ",
      score: 58,
      source: "Social Media",
      status: "Cold",
      lastContact: "3 days ago",
      assignedTo: "Emily Davis"
    },
    {
      name: "David Wilson",
      company: "Enterprise Ltd",
      score: 91,
      source: "Referral",
      status: "Hot",
      lastContact: "5 hours ago",
      assignedTo: "John Smith"
    },
  ];

  const upcomingTasks = [
    { task: "Follow up with Alice Johnson", priority: "high", due: "Today 2:00 PM" },
    { task: "Send proposal to Global Corp", priority: "medium", due: "Tomorrow 10:00 AM" },
    { task: "Schedule demo with StartupXYZ", priority: "low", due: "Dec 12, 3:00 PM" },
    { task: "Qualify new leads from campaign", priority: "medium", due: "Dec 13, 9:00 AM" },
  ];

  const conversionFunnel = [
    { stage: "Visitors", count: 2450, conversion: "100%" },
    { stage: "Leads", count: 156, conversion: "6.4%" },
    { stage: "Qualified", count: 89, conversion: "57%" },
    { stage: "Opportunities", count: 34, conversion: "38%" },
    { stage: "Customers", count: 12, conversion: "35%" },
  ];

  return (
    <DashboardLayout
      title="Lead Management"
      description="Capture, qualify, and convert leads into opportunities"
      icon={<UserIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value="156"
          icon={<UserIcon />}
          color="blue"
        />
        <StatsCard
          title="Hot Leads"
          value="23"
          icon={<AlertIcon />}
          color="red"
        />
        <StatsCard
          title="Conversion Rate"
          value="18.5%"
          icon={<PieChartIcon />}
          color="green"
        />
        <StatsCard
          title="Avg. Response Time"
          value="2.4h"
          icon={<TimeIcon />}
          color="yellow"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Lead Management Tools */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leadFeatures.map((feature, index) => (
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

        {/* Lead Sources & Conversion Funnel */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leadSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {source.source}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {source.count} leads • {source.percentage}
                      </p>
                    </div>
                    <Badge
                      color={source.trend.startsWith('+') ? "success" : "error"}
                      size="sm"
                    >
                      {source.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversionFunnel.map((stage, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {stage.stage}
                      </p>
                      <Badge color="info" size="sm">
                        {stage.conversion}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stage.count.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Leads & Tasks */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Leads */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Button size="sm" variant="outline">
                <ListIcon className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.map((lead, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {lead.company} • {lead.source}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Assigned to: {lead.assignedTo}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            color={
                              lead.status === "Hot" ? "error" :
                                lead.status === "Warm" ? "warning" : "info"
                            }
                            size="sm"
                          >
                            {lead.status}
                          </Badge>
                          <Badge color="light" size="sm">
                            Score: {lead.score}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last contact: {lead.lastContact}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button size="sm" variant="ghost">
                <CalenderIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${task.priority === "high" ? "bg-red-500" :
                      task.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.task}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.due}
                      </p>
                    </div>
                    <Badge
                      color={
                        task.priority === "high" ? "error" :
                          task.priority === "medium" ? "warning" : "info"
                      }
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create">
                <TabsList>
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="manage">Manage</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Lead
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MailIcon className="w-4 h-4 mr-2" />
                    Send Email Campaign
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalenderIcon className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </TabsContent>

                <TabsContent value="manage" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    Lead Scoring Rules
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Assignment Rules
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DocsIcon className="w-4 h-4 mr-2" />
                    Export Leads
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

export default CRMLeadsPage;