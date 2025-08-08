"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// Lazy-load tab content using dynamic() pattern
const UserPermissions = dynamic(() => import("@/components/user-management/UserPermissions"));
const UserActivityLog = dynamic(() => import("@/components/user-management/UserActivityLog"));
const UserSecuritySettings = dynamic(() => import("@/components/user-management/UserSecuritySettings"));
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { userManagementService } from "@/services/userManagement";
import { User } from "@/types/user";
import Image from "next/image";

interface UserDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'permissions' | 'security' | 'activity'>('permissions');
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userManagementService.getUserById(userId);
      setUser(userData);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user || !confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await userManagementService.deleteUser(user.id);
      if (result.success) {
        router.push('/users');
      } else {
        console.error('Failed to delete user:', result.errors);
        alert('Failed to delete user. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleToggleUserStatus = async () => {
    if (!user) return;

    try {
      const result = (user.isActive ?? user.is_active) 
        ? await userManagementService.deactivateUser(user.id)
        : await userManagementService.activateUser(user.id);
      
      if (result.success) {
        await loadUser(); // Reload user data
      } else {
        console.error('Failed to toggle user status:', result.errors);
        alert('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              User Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              User not found or failed to load
            </p>
          </div>
          <Button onClick={() => router.push('/users')} variant="outline">
            Back to Users
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
                  Error Loading User
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {error || 'User not found'}
                </p>
                <button 
                  onClick={loadUser}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            User Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user information, permissions, and security settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push('/users')} variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Button>
          
          <Button onClick={handleToggleUserStatus} variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {(user.isActive ?? user.is_active) ? 'Deactivate' : 'Activate'}
          </Button>
          
          <Button onClick={handleDeleteUser} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete User
          </Button>
        </div>
      </div>

      {/* User Profile Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
              width={80}
              height={80}
              src="/images/user/owner.jpg"
              alt={`${user.firstName || user.first_name} ${user.lastName || user.last_name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {user.firstName || user.first_name} {user.lastName || user.last_name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {user.email}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Badge 
                color={(user.isActive ?? user.is_active) ? "success" : "light"}
                size="sm"
              >
                {(user.isActive ?? user.is_active) ? "Active" : "Inactive"}
              </Badge>
              {(user.isVerified ?? user.is_verified) && (
                <Badge color="info" size="sm">
                  Verified
                </Badge>
              )}
              {user.organization && (
                <Badge color="light" size="sm">
                  {user.organization.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Information Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {(user.isActive ?? user.is_active) ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {(user.isVerified ?? user.is_verified) ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90 font-mono">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Activity
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatLastLogin(user.lastLoginAt || user.last_login_at)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(user.createdAt || user.created_at || new Date().toISOString())}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Updated</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(user.updatedAt || user.updated_at || new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Organization
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organization</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.organization?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Domain</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.organization?.domain || 'N/A'}
              </p>
            </div>
            {/* User Roles */}
            <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
              <h6 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
                Roles & Permissions
              </h6>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assigned Roles</p>
                  <div className="mt-2">
                    {user.roles && user.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <Badge key={role.id} color="light" size="sm">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No roles assigned
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Direct Permissions</p>
                  <div className="mt-2">
                    {user.permissions && user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <Badge key={permission.id} color="info" size="sm">
                            {permission.resource}:{permission.action}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No direct permissions
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('permissions')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'permissions'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Permissions
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'security'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Security
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'activity'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Activity Log
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'permissions' && <UserPermissions userId={userId} />}
        {activeTab === 'security' && <UserSecuritySettings userId={userId} />}
        {activeTab === 'activity' && <UserActivityLog userId={userId} />}
      </div>
    </div>
  );
}