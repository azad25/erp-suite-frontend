"use client";

import React, { lazy, Suspense } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import { LazyComponent, ComponentSkeleton } from "@/components/performance/FastPageLoader";
import LoadingLogo from "@/components/common/LoadingLogo";
import { PlugInIcon, ChatIcon, BoltIcon, BellIcon, BoxIcon, PlusIcon, CheckCircleIcon } from "@/icons";

const LazyComponentCard = lazy(() => import("@/components/common/ComponentCard"));
const LazyFeatureCard = lazy(() => import("@/components/common/FeatureCard"));
const LazyStatsCard = lazy(() => import("@/components/common/StatsCard"));
const LazyCard = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.Card })));
const LazyCardContent = lazy(() => import("@/components/ui/card/Card").then(mod => ({ default: mod.CardContent })));
const LazyBadge = lazy(() => import("@/components/ui/badge/Badge"));
const LazyButton = lazy(() => import("@/components/ui/button/Button"));

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
    <Suspense fallback={<LoadingLogo withText />}>
      <DashboardLayout
        title="AI Copilot Dashboard"
        description="Leverage artificial intelligence to enhance your workflow and productivity"
        icon={<BoltIcon />}
      >
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="AI Conversations"
              value="1,234"
              icon={<ChatIcon />}
              color="blue"
            />
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Insights Generated"
              value="567"
              icon={<BoltIcon />}
              color="green"
            />
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Tasks Automated"
              value="89"
              icon={<BellIcon />}
              color="yellow"
            />
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-24" />}>
            <LazyStatsCard
              title="Active Workflows"
              value="45"
              icon={<BoxIcon />}
              color="purple"
            />
          </LazyComponent>
        </div>
        {/* AI Features */}
        <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
          <LazyComponentCard title="AI Features & Tools" desc="Access and manage AI-powered tools and features">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, index) => (
                <LazyComponent key={index} fallback={<ComponentSkeleton height="h-32" />}>
                  <LazyFeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    path={feature.path}
                    color={feature.color}
                    stats={feature.stats}
                    className="h-full"
                  />
                </LazyComponent>
              ))}
            </div>
          </LazyComponentCard>
        </LazyComponent>
        {/* Recent Activity & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
            <LazyComponentCard title="Recent AI Activity" desc="Latest AI interactions and automated actions">
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <LazyComponent key={index} fallback={<ComponentSkeleton height="h-20" />}>
                    <LazyCard>
                      <LazyCardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {activity.action}
                              </p>
                              <LazyBadge
                                variant="light"
                                color={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : 'error'}
                                size="sm"
                              >
                                {activity.status}
                              </LazyBadge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Type: {activity.type}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </LazyCardContent>
                    </LazyCard>
                  </LazyComponent>
                ))}
              </div>
            </LazyComponentCard>
          </LazyComponent>
          <LazyComponent fallback={<ComponentSkeleton height="h-64" />}>
            <LazyComponentCard title="AI Performance Metrics" desc="Key AI performance indicators">
              <div className="space-y-4">
                {aiMetrics.map((metric, index) => (
                  <LazyComponent key={index} fallback={<ComponentSkeleton height="h-20" />}>
                    <LazyCard>
                      <LazyCardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {metric.metric}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {metric.value}
                            </p>
                          </div>
                          <LazyBadge
                            variant="light"
                            color={metric.change.startsWith('+') || metric.change.startsWith('-') && metric.metric.includes('Time') ? "success" : "info"}
                            size="sm"
                          >
                            {metric.change}
                          </LazyBadge>
                        </div>
                      </LazyCardContent>
                    </LazyCard>
                  </LazyComponent>
                ))}
              </div>
            </LazyComponentCard>
          </LazyComponent>
        </div>
        {/* Quick Actions */}
        <LazyComponentCard title="Quick Actions" desc="Frequently used AI actions and configurations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LazyButton variant="primary" className="justify-start" startIcon={<ChatIcon />}>
              Start AI Chat
            </LazyButton>
            <LazyButton variant="outline" className="justify-start" startIcon={<BoltIcon />}>
              Generate Insights
            </LazyButton>
            <LazyButton variant="outline" className="justify-start" startIcon={<PlusIcon />}>
              Create Workflow
            </LazyButton>
            <LazyButton variant="outline" className="justify-start" startIcon={<CheckCircleIcon />}>
              Configure AI
            </LazyButton>
          </div>
        </LazyComponentCard>
      </DashboardLayout>
    </Suspense>
  );
};

export default AIDashboardPage; 