"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlugInIcon as PlugIcon, 
  CheckCircleIcon, 
  CloseIcon as XCircleIcon,
  BoxIcon as SettingsIcon,
  ArrowUpIcon as RefreshCwIcon,
  ArrowRightIcon as ExternalLinkIcon,
  LockIcon as ShieldIcon,
  BoltIcon as ZapIcon,
  DocsIcon as DatabaseIcon,
  MailIcon,
  BoxIcon as CreditCardIcon,
  BoxCubeIcon as CloudIcon
} from "@/icons";

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "Slack",
      description: "Team communication and notifications",
      category: "Communication",
      status: "connected",
      icon: "💬",
      lastSync: "2 minutes ago",
      features: ["Real-time notifications", "Channel integration", "Bot commands"],
      isEnabled: true
    },
    {
      id: 2,
      name: "Google Workspace",
      description: "Email, calendar, and document integration",
      category: "Productivity",
      status: "connected",
      icon: "📧",
      lastSync: "5 minutes ago",
      features: ["Email sync", "Calendar integration", "Drive access"],
      isEnabled: true
    },
    {
      id: 3,
      name: "Stripe",
      description: "Payment processing and invoicing",
      category: "Finance",
      status: "connected",
      icon: "💳",
      lastSync: "1 hour ago",
      features: ["Payment processing", "Invoice generation", "Subscription management"],
      isEnabled: true
    },
    {
      id: 4,
      name: "Salesforce",
      description: "CRM data synchronization",
      category: "CRM",
      status: "disconnected",
      icon: "☁️",
      lastSync: "Never",
      features: ["Contact sync", "Lead management", "Opportunity tracking"],
      isEnabled: false
    },
    {
      id: 5,
      name: "QuickBooks",
      description: "Accounting and financial data",
      category: "Finance",
      status: "error",
      icon: "📊",
      lastSync: "2 days ago",
      features: ["Transaction sync", "Account mapping", "Report generation"],
      isEnabled: false
    },
    {
      id: 6,
      name: "Zapier",
      description: "Workflow automation platform",
      category: "Automation",
      status: "connected",
      icon: "⚡",
      lastSync: "30 minutes ago",
      features: ["Custom workflows", "Multi-app integration", "Trigger automation"],
      isEnabled: true
    }
  ]);

  const [availableIntegrations] = useState([
    {
      id: 7,
      name: "Microsoft Teams",
      description: "Team collaboration and communication",
      category: "Communication",
      icon: "👥",
      features: ["Chat integration", "Meeting scheduling", "File sharing"]
    },
    {
      id: 8,
      name: "HubSpot",
      description: "Marketing and sales automation",
      category: "Marketing",
      icon: "🎯",
      features: ["Lead tracking", "Email campaigns", "Analytics"]
    },
    {
      id: 9,
      name: "Dropbox",
      description: "Cloud file storage and sharing",
      category: "Storage",
      icon: "📁",
      features: ["File sync", "Shared folders", "Version control"]
    }
  ]);

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, isEnabled: !integration.isEnabled }
        : integration
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircleIcon className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <XCircleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      connected: 'success',
      disconnected: 'light',
      error: 'error'
    } as const;
    
    return (
      <Badge color={colorMap[status as keyof typeof colorMap] || 'light'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Communication':
        return <MailIcon className="h-4 w-4" />;
      case 'Finance':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'Productivity':
        return <CloudIcon className="h-4 w-4" />;
      case 'CRM':
        return <DatabaseIcon className="h-4 w-4" />;
      case 'Automation':
        return <ZapIcon className="h-4 w-4" />;
      default:
        return <PlugIcon className="h-4 w-4" />;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-gray-600 mt-2">
            Connect your favorite tools and services to streamline workflows
          </p>
        </div>
        <Button variant="outline">
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Sync All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlugIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{integrations.length}</p>
                <p className="text-sm text-gray-600">Total Integrations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{errorCount}</p>
                <p className="text-sm text-gray-600">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ZapIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableIntegrations.length}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connected">Connected ({connectedCount})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableIntegrations.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          {getStatusIcon(integration.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      <Switch
                        checked={integration.isEnabled}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                        disabled={integration.status !== 'connected'}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Category</p>
                      <div className="flex items-center gap-1 text-gray-600">
                        {getCategoryIcon(integration.category)}
                        <span>{integration.category}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Last Sync</p>
                      <p className="text-gray-600">{integration.lastSync}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="light" size="sm">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 2 && (
                          <Badge variant="light" size="sm">
                            +{integration.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <SettingsIcon className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCwIcon className="h-4 w-4 mr-1" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLinkIcon className="h-4 w-4 mr-1" />
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Category</p>
                      <div className="flex items-center gap-1 text-gray-600">
                        {getCategoryIcon(integration.category)}
                        <span>{integration.category}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="light" size="sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-sync enabled integrations</h3>
                  <p className="text-sm text-gray-600">Automatically sync data every 15 minutes</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Send sync notifications</h3>
                  <p className="text-sm text-gray-600">Get notified when sync completes or fails</p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable webhook endpoints</h3>
                  <p className="text-sm text-gray-600">Allow external services to send data via webhooks</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <ShieldIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">OAuth 2.0 Authentication</p>
                  <p className="text-sm text-blue-700">All integrations use secure OAuth 2.0 authentication</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Rate Limit</label>
                <Input defaultValue="1000" placeholder="Requests per hour" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook Secret</label>
                <Input type="password" defaultValue="••••••••••••" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;