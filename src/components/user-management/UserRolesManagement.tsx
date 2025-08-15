"use client";
import React, { useState, useEffect } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { userManagementService } from "../../services/userManagement";

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  scope: string;
  description: string;
}

export default function UserRolesManagement() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  useEffect(() => {
    loadRolesAndPermissions();
  }, [debouncedSearch]);

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [rolesData, permissionsData] = await Promise.all([
        userManagementService.getRoles(),
        userManagementService.getPermissions()
      ]);
      
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      console.error('Error loading roles and permissions:', err);
      setError('Failed to load roles and permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRole = (role: Role) => {
    router.push(`/users/roles/${role.id}`);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      const result = await userManagementService.deleteRole(roleId);
      if (result.success) {
        await loadRolesAndPermissions();
      } else {
        console.error('Failed to delete role:', result.errors);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <div className="p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-red-800 dark:text-red-200">
                Error Loading Roles
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
              <button 
                onClick={loadRolesAndPermissions}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Roles & Permissions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage user roles and their permissions ({roles.length} total)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <Link href="/users/roles/create" className="inline-block">
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Role
              </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200 dark:border-gray-800">
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Role
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Type
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Created
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {roles.length > 0 ? (
                roles
                  .filter((role) => {
                    const q = debouncedSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      role.name.toLowerCase().includes(q) ||
                      (role.description || "").toLowerCase().includes(q)
                    );
                  })
                  .map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4 lg:px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {role.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {role.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <Badge 
                        color={role.isSystem ? "warning" : "info"}
                        size="sm"
                      >
                        {role.isSystem ? "System" : "Custom"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <Badge 
                        color={role.isActive ? "success" : "light"}
                        size="sm"
                      >
                        {role.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {new Date(role.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewRole(role)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          title="View Role"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {!role.isSystem && (
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full border border-red-300 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Delete Role"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No roles found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}