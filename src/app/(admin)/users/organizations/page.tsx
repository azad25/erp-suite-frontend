"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import OrganizationListTable from "@/components/organization-management/OrganizationListTable";
import OrganizationDashboard from "@/components/organization-management/OrganizationDashboard";
import { organizationManagementService, OrganizationStats } from "@/services/organizationManagement";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAppAdmin, loading: roleLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (roleLoading) return;
    // Redirect non-app-admin users once
    if (!isAppAdmin) {
      router.replace('/users');
      return;
    }
    // Only load once after role resolves to app admin
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleLoading, isAppAdmin]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsData = await organizationManagementService.getOrganizationStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading organization stats:', err);
      setError('Failed to load organization statistics.');
      // Set fallback data for development
      setStats({
        totalOrganizations: 0,
        activeOrganizations: 0,
        inactiveOrganizations: 0,
        verifiedOrganizations: 0,
        unverifiedOrganizations: 0,
        totalUsers: 0,
        averageUsersPerOrg: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking role or loading data
  if (roleLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render anything if user is not app admin (will be redirected)
  if (!isAppAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Organizations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage organizations and their users across your platform ({stats?.totalOrganizations || 0} organizations)
          </p>
        </div>
        
        <Button size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Organization
        </Button>
      </div>

      {/* Organization Statistics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {stats?.totalOrganizations || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Organizations
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {stats?.activeOrganizations || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Organizations
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Users
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {stats?.averageUsersPerOrg ? Math.round(stats.averageUsersPerOrg) : 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Users/Org
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Dashboard */}
      <OrganizationDashboard />

      {/* Organization List */}
      <OrganizationListTable />
    </div>
  );
}