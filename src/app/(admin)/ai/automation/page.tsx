"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/Tabs";
import { 
  ArrowRightIcon as PlayIcon, 
  CloseIcon as PauseIcon, 
  PlusIcon, 
  BoxIcon as SettingsIcon,
  TimeIcon as ClockIcon,
  CheckCircleIcon,
  CloseIcon as XCircleIcon,
  BoltIcon as ZapIcon
} from "@/icons";

const AutomationPage = () => {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Invoice Approval Workflow",
      description: "Automatically route invoices for approval based on amount",
      status: "active",
      trigger: "Invoice Created",
      actions: ["Send Notification", "Route for Approval"],
      lastRun: "2 hours ago",
      executions: 45
    },
    {
      id: 2,
      name: "Lead Follow-up Automation",
      description: "Send follow-up emails to new leads after 24 hours",
      status: "active",
      trigger: "Lead Created",
      actions: ["Wait 24 hours", "Send Email"],
      lastRun: "1 day ago",
      executions: 23
    },
    {
      id: 3,
      name: "Inventory Reorder Alert",
      description: "Alert when stock levels fall below minimum threshold",
      status: "paused",
      trigger: "Stock Level Change",
      actions: ["Check Threshold", "Send Alert"],
      lastRun: "3 days ago",
      executions: 12
    }
  ]);

  const [templates] = useState([
    {
      id: 1,
      name: "Sales Pipeline Automation",
      description: "Automate lead progression through sales stages",
      category: "Sales"
    },
    {
      id: 2,
      name: "Employee Onboarding",
      description: "Streamline new employee setup process",
      category: "HR"
    },
    {
      id: 3,
      name: "Purchase Order Approval",
      description: "Route purchase orders for multi-level approval",
      category: "Procurement"
    }
  ]);

  const toggleWorkflowStatus = (id: number) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === id 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircleIcon className="h-4 w-4 text-green-500" />
    ) : (
      <XCircleIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'solid' : 'light'} color={status === 'active' ? 'success' : 'light'}>
        {status === 'active' ? 'Active' : 'Paused'}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workflow Automation</h1>
          <p className="text-gray-600 mt-2">
            Automate repetitive tasks and streamline business processes
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(workflow.status)}
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(workflow.status)}
                      <Switch
                        checked={workflow.status === 'active'}
                        onCheckedChange={() => toggleWorkflowStatus(workflow.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Trigger</p>
                      <p className="text-gray-600">{workflow.trigger}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Actions</p>
                      <p className="text-gray-600">{workflow.actions.join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Last Run</p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {workflow.lastRun}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Executions</p>
                      <p className="text-gray-600">{workflow.executions} times</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <SettingsIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      {workflow.status === 'active' ? (
                        <>
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Resume
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ZapIcon className="h-5 w-5 text-blue-500" />
                    <Badge variant="light" color="primary">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-600">3 active, 9 paused</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-gray-600">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationPage;