"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import OrganizationListTable from "@/components/organization-management/OrganizationListTable";
import OrganizationDashboard from "@/components/organization-management/OrganizationDashboard";
import { organizationManagementService, OrganizationStats } from "@/services/organizationManagement";
import { useUserRole } from "@/hooks/useUserRole";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAppAdmin, loading: roleLoading } = useUserRole();
  const router = useRouter();

  usePageTitle("Organizations", "Manage organizations and their users across your platform");

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
        
        <Button size="sm" onClick={() => router.push("/users/organizations/create")}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Organization
        </Button>
      </div>



      {/* Organization Dashboard */}
      <OrganizationDashboard />

      {/* Organization List */}
      <OrganizationListTable />
    </div>
  );
}