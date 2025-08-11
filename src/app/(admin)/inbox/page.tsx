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
  MailIcon, 
  ChatIcon, 
  BoxIcon, 
  ListIcon, 
  BellIcon,
  UserIcon,
  TimeIcon,
  PlusIcon,
  CheckCircleIcon,
  AlertIcon,
  DocsIcon
} from "@/icons";

const InboxDashboardPage = () => {
  const inboxFeatures = [
    {
      title: "Email Management",
      description: "Organize and manage email conversations",
      icon: <MailIcon className="w-8 h-8" />,
      path: "/inbox/emails",
      color: "blue" as const,
      stats: "23 unread emails",
    },
    {
      title: "Team Chat",
      description: "Real-time messaging and team collaboration",
      icon: <ChatIcon className="w-8 h-8" />,
      path: "/inbox/chat",
      color: "green" as const,
      stats: "5 active chats",
    },
    {
      title: "File Sharing",
      description: "Share and manage file attachments",
      icon: <BoxIcon className="w-8 h-8" />,
      path: "/inbox/files",
      color: "purple" as const,
      stats: "156 shared files",
    },
    {
      title: "Notifications",
      description: "System alerts and important updates",
      icon: <BellIcon className="w-8 h-8" />,
      path: "/inbox/notifications",
      color: "yellow" as const,
      stats: "8 new alerts",
    },
    {
      title: "Discussion Forums",
      description: "Team discussions and knowledge sharing",
      icon: <ListIcon className="w-8 h-8" />,
      path: "/inbox/discussions",
      color: "indigo" as const,
      stats: "12 active topics",
    },
    {
      title: "Message Archive",
      description: "Search and access archived messages",
      icon: <DocsIcon className="w-8 h-8" />,
      path: "/inbox/archive",
      color: "red" as const,
      stats: "2,340 archived",
    },
  ];

  const recentMessages = [
    { 
      sender: "Sarah Johnson", 
      subject: "Q4 Budget Review", 
      time: "2 min ago", 
      priority: "high",
      unread: true 
    },
    { 
      sender: "Mike Chen", 
      subject: "Project Update", 
      time: "15 min ago", 
      priority: "medium",
      unread: true 
    },
    { 
      sender: "Team Lead", 
      subject: "Weekly Standup", 
      time: "1 hour ago", 
      priority: "low",
      unread: false 
    },
    { 
      sender: "HR Department", 
      subject: "Policy Updates", 
      time: "3 hours ago", 
      priority: "medium",
      unread: false 
    },
  ];

  const activeChats = [
    { name: "Development Team", lastMessage: "Great work on the new feature!", time: "5 min ago", online: 8 },
    { name: "Marketing Team", lastMessage: "Campaign results are looking good", time: "12 min ago", online: 5 },
    { name: "Project Alpha", lastMessage: "Let's schedule a review meeting", time: "1 hour ago", online: 3 },
    { name: "Support Team", lastMessage: "Customer feedback is positive", time: "2 hours ago", online: 12 },
  ];

  const notifications = [
    { type: "system", message: "System maintenance scheduled", time: "10 min ago" },
    { type: "security", message: "New login from unknown device", time: "30 min ago" },
    { type: "update", message: "New feature available", time: "1 hour ago" },
    { type: "reminder", message: "Meeting starts in 15 minutes", time: "2 hours ago" },
  ];

  return (
    <DashboardLayout
      title="Communication Hub"
      description="Centralized communication and collaboration platform"
      icon={<MailIcon />}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Unread Messages"
          value="23"
          icon={<MailIcon />}
          color="red"
        />
        <StatsCard
          title="Active Chats"
          value="5"
          icon={<ChatIcon />}
          color="blue"
        />
        <StatsCard
          title="Team Members Online"
          value="28"
          icon={<UserIcon />}
          color="green"
        />
        <StatsCard
          title="Pending Notifications"
          value="8"
          icon={<BellIcon />}
          color="yellow"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Communication Tools */}
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Communication Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inboxFeatures.map((feature, index) => (
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

        {/* Recent Activity */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Messages</CardTitle>
              <Button size="sm" variant="ghost">
                <MailIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    message.unread 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className={`font-medium text-sm ${
                        message.unread ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`}>
                        {message.sender}
                      </p>
                      <Badge 
                        color={
                          message.priority === "high" ? "error" :
                          message.priority === "medium" ? "warning" : "info"
                        }
                        size="sm"
                      >
                        {message.priority}
                      </Badge>
                    </div>
                    <p className={`text-sm truncate ${
                      message.unread ? 'text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {message.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Button size="sm" variant="ghost">
                <BellIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "security" ? "bg-red-500" :
                      notification.type === "system" ? "bg-yellow-500" :
                      notification.type === "update" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Chats & Quick Actions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Active Team Chats */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Team Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChats.map((chat, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {chat.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {chat.online} online
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose">
                <TabsList>
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="manage">Manage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compose" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ChatIcon className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BellIcon className="w-4 h-4 mr-2" />
                    Send Announcement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BoxIcon className="w-4 h-4 mr-2" />
                    Share File
                  </Button>
                </TabsContent>
                
                <TabsContent value="manage" className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ListIcon className="w-4 h-4 mr-2" />
                    Organize Labels
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DocsIcon className="w-4 h-4 mr-2" />
                    Archive Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertIcon className="w-4 h-4 mr-2" />
                    Manage Filters
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

export default InboxDashboardPage;