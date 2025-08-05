"use client";
import React, { useState } from "react";
import Switch from "../form/switch/Switch";
import Badge from "../ui/badge/Badge";

interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
  granted: boolean;
}

interface PermissionGroup {
  name: string;
  description: string;
  permissions: Permission[];
}

const mockPermissions: PermissionGroup[] = [
  {
    name: "User Management",
    description: "Manage users, roles, and permissions",
    permissions: [
      { id: "user.create", resource: "users", action: "create", description: "Create new users", granted: true },
      { id: "user.read", resource: "users", action: "read", description: "View user information", granted: true },
      { id: "user.update", resource: "users", action: "update", description: "Edit user details", granted: false },
      { id: "user.delete", resource: "users", action: "delete", description: "Delete users", granted: false },
    ]
  },
  {
    name: "Organization",
    description: "Manage organization settings and data",
    permissions: [
      { id: "org.read", resource: "organization", action: "read", description: "View organization details", granted: true },
      { id: "org.update", resource: "organization", action: "update", description: "Edit organization settings", granted: false },
      { id: "org.billing", resource: "organization", action: "billing", description: "Manage billing and subscriptions", granted: false },
    ]
  },
  {
    name: "Reports & Analytics",
    description: "Access reports and analytics data",
    permissions: [
      { id: "reports.read", resource: "reports", action: "read", description: "View reports", granted: true },
      { id: "reports.export", resource: "reports", action: "export", description: "Export report data", granted: false },
      { id: "analytics.read", resource: "analytics", action: "read", description: "View analytics dashboard", granted: true },
    ]
  }
];

interface UserPermissionsProps {
  userId?: string;
  onPermissionChange?: (permissionId: string, granted: boolean) => void;
}

export default function UserPermissions({ userId, onPermissionChange }: UserPermissionsProps) {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(mockPermissions);

  const handlePermissionToggle = (groupIndex: number, permissionIndex: number) => {
    const updatedGroups = [...permissionGroups];
    const permission = updatedGroups[groupIndex].permissions[permissionIndex];
    permission.granted = !permission.granted;
    
    setPermissionGroups(updatedGroups);
    
    if (onPermissionChange) {
      onPermissionChange(permission.id, permission.granted);
    }
  };

  const getPermissionCount = (group: PermissionGroup) => {
    const granted = group.permissions.filter(p => p.granted).length;
    const total = group.permissions.length;
    return { granted, total };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
          User Permissions
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage what this user can access and do within the system
        </p>
      </div>

      {permissionGroups.map((group, groupIndex) => {
        const { granted, total } = getPermissionCount(group);
        
        return (
          <div key={group.name} className="border border-gray-200 rounded-2xl dark:border-gray-800">
            <div className="p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    {group.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {group.description}
                  </p>
                </div>
                <Badge 
                  color={granted === total ? "success" : granted > 0 ? "warning" : "light"}
                  size="sm"
                >
                  {granted}/{total}
                </Badge>
              </div>

              <div className="space-y-3">
                {group.permissions.map((permission, permissionIndex) => (
                  <div 
                    key={permission.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {permission.description}
                        </p>
                        <Badge color="light" size="sm">
                          {permission.action}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Resource: {permission.resource}
                      </p>
                    </div>
                    <Switch
                      label=""
                      defaultChecked={permission.granted}
                      onChange={() => handlePermissionToggle(groupIndex, permissionIndex)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Permission Summary */}
      <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] lg:p-6">
        <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-3">
          Permission Summary
        </h4>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {permissionGroups.map((group) => {
            const { granted, total } = getPermissionCount(group);
            const percentage = Math.round((granted / total) * 100);
            
            return (
              <div key={group.name} className="text-center">
                <div className="mb-2">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {group.name}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}