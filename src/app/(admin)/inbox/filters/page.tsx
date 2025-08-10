"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";

import { 
  FileIcon as FilterIcon, 
  PlusIcon, 
  PencilIcon as EditIcon,
  TrashBinIcon as TrashIcon,
  BoxIcon as SettingsIcon,
  CheckCircleIcon,
  CloseIcon as XCircleIcon
} from "@/icons";

const FiltersPage = () => {
  const [filters, setFilters] = useState([
    {
      id: 1,
      name: "High Priority Messages",
      description: "Messages marked as high priority or urgent",
      isActive: true,
      conditions: [
        { field: "priority", operator: "equals", value: "high" },
        { field: "subject", operator: "contains", value: "urgent" }
      ],
      actions: [
        { type: "label", value: "Priority" },
        { type: "notification", value: "email" }
      ],
      matchCount: 23,
      color: "red"
    },
    {
      id: 2,
      name: "Client Communications",
      description: "All messages from external clients",
      isActive: true,
      conditions: [
        { field: "sender_domain", operator: "not_contains", value: "company.com" },
        { field: "type", operator: "equals", value: "external" }
      ],
      actions: [
        { type: "label", value: "Client" },
        { type: "folder", value: "Client Communications" }
      ],
      matchCount: 156,
      color: "blue"
    },
    {
      id: 3,
      name: "Team Updates",
      description: "Internal team announcements and updates",
      isActive: false,
      conditions: [
        { field: "sender", operator: "in", value: "team-leads@company.com" },
        { field: "subject", operator: "contains", value: "update" }
      ],
      actions: [
        { type: "label", value: "Team" },
        { type: "mark_read", value: "true" }
      ],
      matchCount: 45,
      color: "green"
    },
    {
      id: 4,
      name: "Invoice Related",
      description: "Messages containing invoice attachments or references",
      isActive: true,
      conditions: [
        { field: "attachment_type", operator: "equals", value: "pdf" },
        { field: "subject", operator: "contains", value: "invoice" }
      ],
      actions: [
        { type: "label", value: "Finance" },
        { type: "forward", value: "finance@company.com" }
      ],
      matchCount: 78,
      color: "yellow"
    }
  ]);

  const [labels] = useState([
    { id: 1, name: "Priority", color: "red", count: 23 },
    { id: 2, name: "Client", color: "blue", count: 156 },
    { id: 3, name: "Team", color: "green", count: 45 },
    { id: 4, name: "Finance", color: "yellow", count: 78 },
    { id: 5, name: "Marketing", color: "purple", count: 34 },
    { id: 6, name: "Support", color: "orange", count: 67 }
  ]);

  const toggleFilter = (id: number) => {
    setFilters(filters.map(filter => 
      filter.id === id 
        ? { ...filter, isActive: !filter.isActive }
        : filter
    ));
  };

  const getColorClass = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderConditions = (conditions: Array<{field: string, operator: string, value: string}>) => {
    return conditions.map((condition, index) => (
      <div key={index} className="text-xs text-gray-600">
        <span className="font-medium">{condition.field}</span>
        <span className="mx-1">{condition.operator}</span>
        <span className="italic">"{condition.value}"</span>
      </div>
    ));
  };

  const renderActions = (actions: Array<{type: string, value: string}>) => {
    return actions.map((action, index) => (
      <Badge key={index} variant="light" size="sm">
        {action.type}: {action.value}
      </Badge>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Filters & Labels</h1>
          <p className="text-gray-600 mt-2">
            Automatically organize and categorize your messages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Message Filters</h2>
            <Badge variant="light" color="primary">
              {filters.filter(f => f.isActive).length} active
            </Badge>
          </div>

          <div className="space-y-4">
            {filters.map((filter) => (
              <Card key={filter.id} className={`border-l-4 ${filter.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{filter.name}</CardTitle>
                        {filter.isActive ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {filter.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Matched {filter.matchCount} messages</span>
                        <Badge color="light" size="sm">
                          {filter.color}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={filter.isActive}
                        onCheckedChange={() => toggleFilter(filter.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Conditions:</h4>
                      <div className="space-y-1">
                        {renderConditions(filter.conditions)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Actions:</h4>
                      <div className="flex flex-wrap gap-1">
                        {renderActions(filter.actions)}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <EditIcon className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Labels Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Labels</h2>
            <Button size="sm" variant="outline">
              <PlusIcon className="h-3 w-3 mr-1" />
              Add Label
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manage Labels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labels.map((label) => (
                  <div key={label.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${label.color}-500`}></div>
                      <span className="font-medium">{label.name}</span>
                      <Badge variant="light" size="sm">
                        {label.count}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Filters</span>
                  <span className="font-medium">{filters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Filters</span>
                  <span className="font-medium">{filters.filter(f => f.isActive).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Messages Processed</span>
                  <span className="font-medium">
                    {filters.reduce((acc, f) => acc + f.matchCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Labels Created</span>
                  <span className="font-medium">{labels.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FiltersPage;