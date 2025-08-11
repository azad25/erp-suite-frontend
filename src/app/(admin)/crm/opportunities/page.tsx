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
  DollarLineIcon, 
  PieChartIcon, 
  UserIcon, 
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

const CRMOpportunitiesPage = () => {
  const opportunityFeatures = [
    {
      title: "Pipeline Management",
      description: "Visual pipeline with drag-and-drop functionality",
      icon: <PieChartIcon className="w-8 h-8" />,
      path: "/crm/opportunities/pipeline",
      color: "blue" as const,
      stats: "34 active deals",
    },
    {
      title: "Deal Tracking",
      description: "Track deal progress and key milestones",
      icon: <CheckCircleIcon className="w-8 h-8" />,
      path: "/crm/opportunities/tracking",
      color: "green" as const,
      stats: "12 closing this month",
    },
    {
      title: "Forecasting",
      description: "Revenue forecasting and predictive analytics",
      icon: <TimeIcon className="w-8 h-8" />,
      path: "/crm/opportunities/forecast",
      color: "purple" as const,
      stats: "$245K projected",
    },
    {
      title: "Contact Management",
      description: "Manage opportunity contacts and stakeholders",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/crm/opportunities/contacts",
      color: "indigo" as const,
      stats: "156 contacts",
    },
    {
      title: "Activity Timeline",
      description: "Track all opportunity-related activities",
      icon: <CalenderIcon className="w-8 h-8" />,
      path: "/crm/opportunities/activities",
      color: "yellow" as const,
      stats: "89 activities",
    },
    {
      title: "Document Center",
      description: "Store proposals, contracts, and documents",
      icon: <DocsIcon className="w-8 h-8" />,
      path: "/crm/opportunities/documents",
      color: "red" as const,
      stats: "67 documents",
    },
  ];

  const pipelineStages = [
    { stage: "Prospecting", count: 8, value: "$45,200", color: "blue" },
    { stage: "Qualification", count: 12, value: "$78,400", color: "yellow" },
    { stage: "Proposal", count: 7, value: "$89,600", color: "purple" },
    { stage: "Negotiation", count: 5, value: "$67,800", color: "orange" },
    { stage: "Closed Won", count: 2, value: "$32,400", color: "green" },
  ];

  const recentOpportunities = [
    { 
      company: "TechCorp Solutions", 
      value: "$45,000", 
      stage: "Proposal", 
      probability: "75%",
      closeDate: "Dec 15, 2024",
      owner: "Sarah Johnson"
    },
    { 
      company: "Global Industries", 
      value: "$78,500", 
      stage: "Negotiation", 
      probability: "85%",
      closeDate: "Dec 20, 2024",
      owner: "Mike Chen"
    },
    { 
      company: "StartupXYZ", 
      value: "$23,000", 
      stage: "Qualification", 
      probability: "45%",
      closeDate: "Jan 10, 2025",
      owner: "Emily Davis"
    },
    { 
      company: "Enterprise Ltd", 
      value: "$156,000", 
      stage: "Proposal", 
      probability: "65%",
      closeDate: "Jan 15, 2025",
      owner: "David Wilson"
    },
  ];

  const upcomingActivities = [
    { activity: "Demo call with TechCorp", time: "2:00 PM", date: "Today", type: "call" },
    { activity: "Proposal review meeting", time: "10:30 AM", date: "Tomorrow", type: "meeting" },
    { activity: "Contract negotiation", time: "3:00 PM", date: "Dec 12", type: "meeting" },
    { activity: "Follow-up email", time: "9:00 AM", date: "Dec 13", type: "email" },
  ];

  const performanceMetrics = [
    { metric: "Conversion Rate", value: "32%", change: "+5%" },
    { metric: "Avg. Deal Size", value: "$7,224", change: "+12%" },
    { metric: "Sales Cycle", value: "45 days", change: "-8%" },
    { metric: "Win Rate", value: "68%", change: "+3%" },
  ];

  return (
    <DashboardLayout
      title="Sales Opportunities"
      description="Manage your sales pipeline and track deal progress"
      icon={<DollarLineIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Open Opportunities"
          value="34"
          icon={<DollarLineIcon />}
          color="blue"
        />
        <StatsCard
          title="Pipeline Value"
          value="$245,600"
          icon={<PieChartIcon />}
          color="green"
        />
        <StatsCard
          title="Win Rate"
          value="68%"
          icon={<CheckCircleIcon />}
          color="yellow"
        />
        <StatsCard
          title="Avg. Deal Size"
          value="$7,224"
          icon={<TimeIcon />}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Opportunity Tools */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Management Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunityFeatures.map((feature, index) => (
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

        {/* Pipeline Overview */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Pipeline Stages */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pipelineStages.map((stage, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {stage.stage}
                      </p>
                      <Badge color={stage.color as any} size="sm">
                        {stage.count}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stage.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {metric.metric}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                    <Badge 
                      color={metric.change.startsWith('+') ? "success" : "error"}
                      size="sm"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Opportunities & Activities */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Opportunities */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Opportunities</CardTitle>
              <Button size="sm" variant="outline">
                <ListIcon className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOpportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {opportunity.company}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Owner: {opportunity.owner}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {opportunity.value}
                        </p>
                        <Badge color="info" size="sm">
                          {opportunity.probability}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge 
                        color={
                          opportunity.stage === "Closed Won" ? "success" :
                          opportunity.stage === "Negotiation" ? "warning" : "info"
                        }
                        size="sm"
                      >
                        {opportunity.stage}
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Close: {opportunity.closeDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Activities & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Upcoming Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Activities</CardTitle>
              <Button size="sm" variant="ghost">
                <CalenderIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "call" ? "bg-blue-500" :
                      activity.type === "meeting" ? "bg-green-500" : "bg-yellow-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time} • {activity.date}
                      </p>
                    </div>
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
                    New Opportunity
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalenderIcon className="w-4 h-4 mr-2" />
                    Schedule Activity
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DocsIcon className="w-4 h-4 mr-2" />
                    Create Proposal
                  </Button>
                </TabsContent>
                
                <TabsContent value="manage" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PieChartIcon className="w-4 h-4 mr-2" />
                    View Pipeline
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ListIcon className="w-4 h-4 mr-2" />
                    Manage Stages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertIcon className="w-4 h-4 mr-2" />
                    Set Reminders
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

export default CRMOpportunitiesPage;