"use client";
import React, { useState, useEffect } from "react";
import Switch from "../form/switch/Switch";
import Badge from "../ui/badge/Badge";
import { userManagementService } from "../../services/userManagement";

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

interface UserPermissionsProps {
  userId?: string;
  onPermissionChange?: (permissionId: string, granted: boolean) => void;
}

export default function UserPermissions({ userId, onPermissionChange }: UserPermissionsProps) {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPermissions();
  }, [userId]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all available permissions
      const allPermissions = await userManagementService.getPermissions();

      // If we have a userId, load the user's current permissions
      let userPermissions: any[] = [];
      if (userId) {
        const user = await userManagementService.getUserById(userId);
        userPermissions = user.userRoles?.flatMap((ur: any) =>
          ur.role.rolePermissions?.map((rp: any) => rp.permission) || []
        ) || [];
      }

      // Group permissions by resource
      const groupedPermissions = groupPermissionsByResource(allPermissions, userPermissions);
      setPermissionGroups(groupedPermissions);
    } catch (err) {
      console.error('Error loading permissions:', err);
      setError('Failed to load permissions.');
      setPermissionGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const groupPermissionsByResource = (allPermissions: any[], userPermissions: any[]): PermissionGroup[] => {
    const resourceGroups: { [key: string]: Permission[] } = {};

    allPermissions.forEach(permission => {
      const resource = permission.resource;
      const isGranted = userPermissions.some(up => up.id === permission.id);

      if (!resourceGroups[resource]) {
        resourceGroups[resource] = [];
      }

      resourceGroups[resource].push({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        description: permission.description || `${permission.action} ${permission.resource}`,
        granted: isGranted
      });
    });

    // Convert to PermissionGroup format
    return Object.entries(resourceGroups).map(([resource, permissions]) => ({
      name: formatResourceName(resource),
      description: `Manage ${resource} related operations`,
      permissions
    }));
  };

  const formatResourceName = (resource: string): string => {
    return resource
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePermissionToggle = async (groupIndex: number, permissionIndex: number) => {
    const updatedGroups = [...permissionGroups];
    const permission = updatedGroups[groupIndex].permissions[permissionIndex];
    const newGrantedState = !permission.granted;

    // Optimistically update UI
    permission.granted = newGrantedState;
    setPermissionGroups(updatedGroups);

    if (onPermissionChange) {
      onPermissionChange(permission.id, newGrantedState);
    }

    // TODO: Implement actual permission assignment/revocation
    // This would require additional API endpoints for individual permission management
    // For now, this is just a UI demonstration
  };

  const getPermissionCount = (group: PermissionGroup) => {
    const granted = group.permissions.filter(p => p.granted).length;
    const total = group.permissions.length;
    return { granted, total };
  };

  if (loading) {
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
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl dark:border-gray-800">
              <div className="p-5 lg:p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="border border-red-200 rounded-2xl bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <div className="p-5 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-semibold text-red-800 dark:text-red-200">
                  Error Loading Permissions
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {error}
                </p>
                <button
                  onClick={loadPermissions}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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