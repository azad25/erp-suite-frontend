"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { organizationManagementService, Organization } from "../../services/organizationManagement";

interface OrganizationListData {
  organizations: Organization[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function OrganizationListTable() {
  const [organizationListData, setOrganizationListData] = useState<OrganizationListData>({
    organizations: [],
    total: 0,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrganizations();
  }, [searchTerm]);

  const loadOrganizations = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * limit;
      const data = await organizationManagementService.getOrganizations(limit, offset, searchTerm || undefined);
      setOrganizationListData(data);
    } catch (err) {
      console.error('Error loading organizations:', err);
      setError('Failed to load organizations. Please try again.');
      // Set fallback data for development
      setOrganizationListData({
        organizations: [],
        total: 0,
        page: 1,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteOrganization = async (organizationId: string) => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await organizationManagementService.deleteOrganization(organizationId);
      if (result.success) {
        await loadOrganizations();
      } else {
        console.error('Failed to delete organization:', result.errors);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const handleToggleOrganizationStatus = async (organizationId: string, isActive: boolean) => {
    try {
      const result = isActive 
        ? await organizationManagementService.deactivateOrganization(organizationId)
        : await organizationManagementService.activateOrganization(organizationId);
      
      if (result.success) {
        await loadOrganizations();
      } else {
        console.error('Failed to toggle organization status:', result.errors);
      }
    } catch (error) {
      console.error('Error toggling organization status:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadOrganizations(newPage, organizationListData.limit);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                Error Loading Organizations
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
              <button 
                onClick={() => loadOrganizations()}
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
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Organization Management
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage organizations and their settings ({organizationListData.total} total)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Organization
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200 dark:border-gray-800">
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Organization
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Users
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
              {organizationListData.organizations.length > 0 ? (
                organizationListData.organizations.map((organization) => (
                  <tr key={organization.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-lg dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {organization.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {organization.domain}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {organization.userCount}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          users
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({organization.activeUserCount} active)
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <Badge 
                          color={organization.isActive ? "success" : "light"}
                          size="sm"
                        >
                          {organization.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {formatDate(organization.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/users/organizations/${organization.id}`}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          title="View Organization"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleToggleOrganizationStatus(organization.id, organization.isActive)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          title={organization.isActive ? "Deactivate Organization" : "Activate Organization"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteOrganization(organization.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-red-300 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Delete Organization"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No organizations found matching your search.' : 'No organizations found.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {organizationListData.total > organizationListData.limit && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((organizationListData.page - 1) * organizationListData.limit) + 1} to {Math.min(organizationListData.page * organizationListData.limit, organizationListData.total)} of {organizationListData.total} organizations
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(organizationListData.page - 1)}
                  disabled={!organizationListData.hasPreviousPage}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm">
                  Page {organizationListData.page}
                </span>
                <button
                  onClick={() => handlePageChange(organizationListData.page + 1)}
                  disabled={!organizationListData.hasNextPage}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


    </>
  );
}