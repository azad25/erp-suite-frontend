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
  BoxIcon, 
  UserIcon, 
  BellIcon, 
  ListIcon, 
  LockIcon, 
  PlugInIcon, 
  DocsIcon,
  CheckCircleIcon,
  AlertIcon,
  InfoIcon,
  DownloadIcon,
  TimeIcon
} from "@/icons";

const SettingsDashboardPage = () => {
  const settingsFeatures = [
    {
      title: "System Configuration",
      description: "Core system settings and global preferences",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/settings/system",
      color: "blue" as const,
      stats: "12 configurations",
    },
    {
      title: "User Management",
      description: "Manage user roles, permissions, and access control",
      icon: <UserIcon className="w-8 h-8" />,
      path: "/settings/users",
      color: "green" as const,
      stats: "24 active users",
    },
    {
      title: "Security Settings",
      description: "Configure security policies and authentication",
      icon: <LockIcon className="w-8 h-8" />,
      path: "/settings/security",
      color: "red" as const,
      stats: "8 security rules",
    },
    {
      title: "API Integrations",
      description: "Manage third-party integrations and webhooks",
      icon: <PlugInIcon className="w-8 h-8" />,
      path: "/settings/integrations",
      color: "purple" as const,
      stats: "5 active APIs",
    },
    {
      title: "Data Management",
      description: "Import, export, and backup system data",
      icon: <DocsIcon className="w-8 h-8" />,
      path: "/settings/data",
      color: "yellow" as const,
      stats: "3 data sources",
    },
    {
      title: "Notifications",
      description: "Configure system alerts and notification preferences",
      icon: <BellIcon className="w-8 h-8" />,
      path: "/settings/notifications",
      color: "indigo" as const,
      stats: "15 alert types",
    },
  ];

  const recentActivities = [
    { action: "System backup completed", time: "2 minutes ago", status: "success" },
    { action: "New user registered", time: "15 minutes ago", status: "info" },
    { action: "API rate limit updated", time: "1 hour ago", status: "warning" },
    { action: "Security scan completed", time: "3 hours ago", status: "success" },
  ];

  const systemHealth = [
    { component: "Database", status: "Healthy", uptime: "99.9%" },
    { component: "API Gateway", status: "Healthy", uptime: "99.8%" },
    { component: "File Storage", status: "Warning", uptime: "98.5%" },
    { component: "Email Service", status: "Healthy", uptime: "99.7%" },
  ];

  return (
    <DashboardLayout
      title="System Settings"
      description="Configure and manage your ERP system settings"
      icon={<BoxIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Users"
          value="24"
          icon={<UserIcon />}
          color="blue"
        />
        <StatsCard
          title="System Health"
          value="98.5%"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Active Integrations"
          value="5"
          icon={<PlugInIcon />}
          color="purple"
        />
        <StatsCard
          title="Security Alerts"
          value="2"
          icon={<AlertIcon />}
          color="red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Settings Categories */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Settings Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settingsFeatures.map((feature, index) => (
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

        {/* System Status & Activities */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealth.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {item.component}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uptime: {item.uptime}
                      </p>
                    </div>
                    <Badge 
                      color={item.status === "Healthy" ? "success" : "warning"}
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "success" ? "bg-green-500" :
                      activity.status === "warning" ? "bg-yellow-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="system">
            <TabsList>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <BoxIcon className="w-4 h-4 mr-2" />
                  System Maintenance
                </Button>
                <Button variant="outline" className="justify-start">
                  <InfoIcon className="w-4 h-4 mr-2" />
                  View System Logs
                </Button>
                <Button variant="outline" className="justify-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Run Health Check
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
                <Button variant="outline" className="justify-start">
                  <ListIcon className="w-4 h-4 mr-2" />
                  Manage Roles
                </Button>
                <Button variant="outline" className="justify-start">
                  <LockIcon className="w-4 h-4 mr-2" />
                  Reset Passwords
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <LockIcon className="w-4 h-4 mr-2" />
                  Security Scan
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertIcon className="w-4 h-4 mr-2" />
                  View Alerts
                </Button>
                <Button variant="outline" className="justify-start">
                  <BellIcon className="w-4 h-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="backup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <DocsIcon className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline" className="justify-start">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download Backup
                </Button>
                <Button variant="outline" className="justify-start">
                  <TimeIcon className="w-4 h-4 mr-2" />
                  Schedule Backup
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SettingsDashboardPage;