"use client";

import React from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import FeatureCard from "@/components/common/FeatureCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { PlugInIcon, ChatIcon, BoltIcon, BellIcon, BoxIcon, PlusIcon, CheckCircleIcon } from "@/icons";

const AIDashboardPage = () => {
  const aiFeatures = [
    {
      title: "Chat Assistant",
      description: "Get instant help and answers to your questions",
      icon: <ChatIcon className="w-8 h-8" />,
      path: "/ai/chat",
      color: "blue" as const,
      stats: "1,234 conversations",
    },
    {
      title: "AI Insights",
      description: "Discover patterns and insights in your data",
      icon: <BoltIcon className="w-8 h-8" />,
      path: "/ai/insights",
      color: "green" as const,
      stats: "567 insights generated",
    },
    {
      title: "Smart Alerts",
      description: "Stay informed with intelligent notifications",
      icon: <BellIcon className="w-8 h-8" />,
      path: "/ai/alerts",
      color: "yellow" as const,
      stats: "89 active alerts",
    },
    {
      title: "Workflow Automation",
      description: "Automate repetitive tasks with AI",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/ai/automation",
      color: "purple" as const,
      stats: "45 workflows active",
    },
  ];

  const recentActivity = [
    { action: "Generated sales insights report", time: "2 minutes ago", type: "insights", status: "success" },
    { action: "Automated invoice processing", time: "15 minutes ago", type: "automation", status: "success" },
    { action: "Answered customer query", time: "1 hour ago", type: "chat", status: "success" },
    { action: "Sent inventory alert", time: "2 hours ago", type: "alerts", status: "warning" },
  ];

  const aiMetrics = [
    { metric: "Automation Rate", value: "85%", change: "+12%" },
    { metric: "Response Time", value: "0.3s", change: "-0.1s" },
    { metric: "Accuracy Score", value: "96.8%", change: "+2.1%" },
    { metric: "Tasks Automated", value: "1,245", change: "+156" },
  ];

  return (
    <DashboardLayout
      title="AI Copilot Dashboard"
      description="Leverage artificial intelligence to enhance your workflow and productivity"
      icon={<BoltIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="AI Conversations"
          value="1,234"
          icon={<ChatIcon />}
          color="blue"
        />
        <StatsCard
          title="Insights Generated"
          value="567"
          icon={<BoltIcon />}
          color="green"
        />
        <StatsCard
          title="Tasks Automated"
          value="89"
          icon={<BellIcon />}
          color="yellow"
        />
        <StatsCard
          title="Active Workflows"
          value="45"
          icon={<BoxIcon />}
          color="purple"
        />
      </div>

      {/* AI Features */}
      <ComponentCard title="AI Features & Tools" desc="Access and manage AI-powered tools and features">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature, index) => (
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
      </ComponentCard>

      {/* Recent Activity & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Recent AI Activity" desc="Latest AI interactions and automated actions">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <Badge 
                          variant="light" 
                          color={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : 'error'}
                          size="sm"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Type: {activity.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard title="AI Performance Metrics" desc="Key AI performance indicators">
          <div className="space-y-4">
            {aiMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {metric.metric}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                    <Badge 
                      variant="light" 
                      color={metric.change.startsWith('+') || metric.change.startsWith('-') && metric.metric.includes('Time') ? "success" : "info"}
                      size="sm"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Quick Actions */}
      <ComponentCard title="Quick Actions" desc="Frequently used AI actions and configurations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" className="justify-start" startIcon={<ChatIcon />}>
            Start AI Chat
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<BoltIcon />}>
            Generate Insights
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<PlusIcon />}>
            Create Workflow
          </Button>
          <Button variant="outline" className="justify-start" startIcon={<CheckCircleIcon />}>
            Configure AI
          </Button>
        </div>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default AIDashboardPage; 