import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/Tabs";
import Button from "@/components/ui/button/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import { UserIcon, DollarLineIcon, PieChartIcon, BoxIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tabs | Unibase ERP Dashboard",
  description: "Tab components for Unibase ERP Dashboard",
};

export default function TabsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tabs" />
      <div className="space-y-5 sm:space-y-6">
        
        {/* Basic Tabs */}
        <ComponentCard title="Basic Tabs">
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tab1">
              <p className="text-gray-600 dark:text-gray-400">
                This is the content for Tab 1. You can put any content here including text, images, forms, or other components.
              </p>
            </TabsContent>
            
            <TabsContent value="tab2">
              <p className="text-gray-600 dark:text-gray-400">
                This is the content for Tab 2. Each tab can have completely different content and layout.
              </p>
            </TabsContent>
            
            <TabsContent value="tab3">
              <p className="text-gray-600 dark:text-gray-400">
                This is the content for Tab 3. Tabs are great for organizing related information.
              </p>
            </TabsContent>
          </Tabs>
        </ComponentCard>

        {/* Tabs with Cards */}
        <ComponentCard title="Tabs with Card Content">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <DollarLineIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">$45,678</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <PieChartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View detailed analytics and reports</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Full Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <BoxIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">System Preferences</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configure system-wide settings</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ComponentCard>

        {/* Tabs with Actions */}
        <ComponentCard title="Tabs with Quick Actions">
          <Tabs defaultValue="create">
            <TabsList>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="primary" className="justify-start" startIcon={<UserIcon />}>
                  Add New User
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<BoxIcon />}>
                  Create Project
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
                  New Invoice
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<PieChartIcon />}>
                  Generate Report
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="manage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" startIcon={<UserIcon />}>
                  Manage Users
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<BoxIcon />}>
                  Project Settings
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
                  Financial Settings
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<PieChartIcon />}>
                  Analytics Config
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" startIcon={<PieChartIcon />}>
                  Sales Report
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<UserIcon />}>
                  User Activity
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<DollarLineIcon />}>
                  Financial Report
                </Button>
                <Button variant="outline" className="justify-start" startIcon={<BoxIcon />}>
                  Inventory Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </ComponentCard>

      </div>
    </div>
  );
}