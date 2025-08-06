"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { organizationManagementService, OrganizationStats } from "../../services/organizationManagement";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

export default function OrganizationDashboard() {
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

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
        totalOrganizations: 12,
        activeOrganizations: 10,
        inactiveOrganizations: 2,
        verifiedOrganizations: 8,
        unverifiedOrganizations: 4,
        totalUsers: 156,
        averageUsersPerOrg: 13,
      });
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const organizationStatusData: ChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      label: 'Organizations',
      data: [stats?.activeOrganizations || 0, stats?.inactiveOrganizations || 0],
      backgroundColor: ['#10B981', '#6B7280'],
      borderColor: ['#059669', '#4B5563'],
      borderWidth: 2,
    }]
  };

  const verificationStatusData: ChartData = {
    labels: ['Verified', 'Unverified'],
    datasets: [{
      label: 'Organizations',
      data: [stats?.verifiedOrganizations || 0, stats?.unverifiedOrganizations || 0],
      backgroundColor: ['#3B82F6', '#F59E0B'],
      borderColor: ['#2563EB', '#D97706'],
      borderWidth: 2,
    }]
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
          Organization Analytics
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of organization metrics and user distribution
        </p>
      </div>

      {/* Key Metrics Cards */}
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Organization Status Chart */}
        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Organization Status
            </h4>
          </div>
          <div className="space-y-4">
            {/* Simple bar representation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {stats?.activeOrganizations || 0}
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ 
                        width: `${((stats?.activeOrganizations || 0) / (stats?.totalOrganizations || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Inactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {stats?.inactiveOrganizations || 0}
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 bg-gray-500 rounded-full"
                      style={{ 
                        width: `${((stats?.inactiveOrganizations || 0) / (stats?.totalOrganizations || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Chart */}
        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Verification Status
            </h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {stats?.verifiedOrganizations || 0}
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ 
                        width: `${((stats?.verifiedOrganizations || 0) / (stats?.totalOrganizations || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Unverified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {stats?.unverifiedOrganizations || 0}
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ 
                        width: `${((stats?.unverifiedOrganizations || 0) / (stats?.totalOrganizations || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
              User Distribution
            </h4>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + (stats?.totalUsers || 0) / 10}% 0%, 100% 100%, 0% 100%)`
                }}></div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                    {stats?.averageUsersPerOrg ? Math.round(stats.averageUsersPerOrg) : 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Avg/Org
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Users</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {stats?.totalUsers || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Organizations</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {stats?.totalOrganizations || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            Organization Summary
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                    Active Organizations
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {stats?.activeOrganizations || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {stats?.totalOrganizations ? Math.round((stats.activeOrganizations / stats.totalOrganizations) * 100) : 0}%
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="success" size="sm">Healthy</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                    Verified Organizations
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {stats?.verifiedOrganizations || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {stats?.totalOrganizations ? Math.round((stats.verifiedOrganizations / stats.totalOrganizations) * 100) : 0}%
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="info" size="sm">Good</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                    Average Users per Org
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {stats?.averageUsersPerOrg ? Math.round(stats.averageUsersPerOrg) : 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    -
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="light" size="sm">Normal</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}