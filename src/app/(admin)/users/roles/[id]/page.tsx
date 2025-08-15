"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Card } from "@/components/ui/card/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { userManagementService } from "@/services/userManagement";

export default function RoleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [role, setRole] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  usePageTitle("Role Details", "View role information and permissions");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const roles = await userManagementService.getRoles();
        const r = roles.find((x: any) => x.id === String(params?.id ?? ""));
        setRole(r || null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Role Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Role not found</p>
          </div>
          <Button onClick={() => router.push("/users/roles")} variant="outline">
            Back to Roles
          </Button>
        </div>
        
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
                  Role Not Found
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  The role you're looking for doesn't exist or has been deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">{role.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description || 'No description provided'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Badge color={role.isSystem ? "warning" : "info"} size="sm">
              {role.isSystem ? "System" : "Custom"}
            </Badge>
            <Badge color={role.isActive ? "success" : "light"} size="sm">
              {role.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Button onClick={() => router.push("/users/roles")} variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Roles
          </Button>
        </div>
      </div>

      {/* Role Info Card */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {role.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {role.description || 'No description provided'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color={role.isSystem ? "warning" : "info"} size="sm">
                {role.isSystem ? "System Role" : "Custom Role"}
              </Badge>
              <Badge color={role.isActive ? "success" : "light"} size="sm">
                {role.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Permissions */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Permissions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Permissions assigned to this role
          </p>
        </div>

        {role.permissions && role.permissions.length > 0 ? (
          <div className="space-y-3">
            {role.permissions.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="font-medium">{p.resource}</span> - {p.action}
                  </p>
                  {p.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="light" size="sm">{p.scope}</Badge>
                  {p.isSystem && (
                    <Badge color="warning" size="sm">System</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No permissions assigned to this role
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

