"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { PlugInIcon, ChatIcon, BoltIcon, BellIcon, BoxIcon } from "@/icons";

const AIDashboardPage = () => {
  const aiFeatures = [
    {
      title: "Chat Assistant",
      description: "Get instant help and answers to your questions",
      icon: <ChatIcon className="w-8 h-8 text-blue-500" />,
      path: "/ai/chat",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      stats: "1,234 conversations",
    },
    {
      title: "AI Insights",
      description: "Discover patterns and insights in your data",
      icon: <BoltIcon className="w-8 h-8 text-green-500" />,
      path: "/ai/insights",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      stats: "567 insights generated",
    },
    {
      title: "Smart Alerts",
      description: "Stay informed with intelligent notifications",
      icon: <BellIcon className="w-8 h-8 text-yellow-500" />,
      path: "/ai/alerts",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      stats: "89 active alerts",
    },
    {
      title: "Workflow Automation",
      description: "Automate repetitive tasks with AI",
      icon: <BoxIcon className="w-8 h-8 text-purple-500" />,
      path: "/ai/automation",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      stats: "45 workflows active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          AI Copilot Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Leverage artificial intelligence to enhance your workflow and productivity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <ChatIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                1,234
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI Conversations
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                567
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Insights Generated
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <BellIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                89
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tasks Automated
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <BoxIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                45
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active Workflows
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                AI Features
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Access and manage AI-powered tools and features
              </p>
            </div>
            <Button size="sm" variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure AI
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.path}
                className={`block p-5 rounded-xl border-2 transition-all duration-200 ${feature.color} hover:shadow-lg hover:scale-105`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {feature.description}
                    </p>
                    <div className="mt-3">
                      <Badge color="info" variant="light" size="sm">
                        {feature.stats}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Recent AI Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest AI interactions and automated actions
              </p>
            </div>
            <Button size="sm" variant="outline">
              View All Activity
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                action: "Generated sales insights report",
                time: "2 minutes ago",
                type: "insights",
                status: "success" as const,
              },
              {
                action: "Automated invoice processing",
                time: "15 minutes ago",
                type: "automation",
                status: "success" as const,
              },
              {
                action: "Answered customer query",
                time: "1 hour ago",
                type: "chat",
                status: "success" as const,
              },
              {
                action: "Sent inventory alert",
                time: "2 hours ago",
                type: "alerts",
                status: "warning" as const,
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {activity.action}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    color={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : 'error'} 
                    variant="light" 
                    size="sm"
                  >
                    {activity.status}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboardPage; 