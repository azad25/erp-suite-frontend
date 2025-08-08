"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import CreateUserForm from "./CreateUserForm";
import { userManagementService } from "../../services/userManagement";
import { User } from "@/types/user";

interface UserListData {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function UserListTable() {
  const [userListData, setUserListData] = useState<UserListData>({
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { isOpen: isCreateModalOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const loadUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * limit;
      const data = await userManagementService.getUsers(limit, offset, searchTerm || undefined);
      setUserListData(data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const createUserData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.first_name,
        lastName: userData.last_name,
        isActive: userData.is_active,
        isVerified: userData.is_verified,
        roleIds: userData.role ? [userData.role] : undefined,
      };

      const result = await userManagementService.createUser(createUserData);
      
      if (result.success) {
        // Reload users to show the new user
        await loadUsers();
        closeCreateModal();
      } else {
        console.error('Failed to create user:', result.errors);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const result = await userManagementService.deleteUser(userId);
      if (result.success) {
        await loadUsers(); // Reload users
      } else {
        console.error('Failed to delete user:', result.errors);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const result = isActive 
        ? await userManagementService.deactivateUser(userId)
        : await userManagementService.activateUser(userId);
      
      if (result.success) {
        await loadUsers(); // Reload users
      } else {
        console.error('Failed to toggle user status:', result.errors);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadUsers(newPage, userListData.limit);
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

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                Error Loading Users
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
              <button 
                onClick={() => loadUsers()}
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
                User Management
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage users, permissions, and access controls ({userListData.total} total)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <Button size="sm" onClick={openCreateModal}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200 dark:border-gray-800">
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  User
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Last Login
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
              {userListData.users.length > 0 ? (
                userListData.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                          <Image
                            width={40}
                            height={40}
                            src="/images/user/owner.jpg"
                            alt={`${user.firstName || user.first_name} ${user.lastName || user.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="text-left hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                          >
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                              {user.firstName || user.first_name} {user.lastName || user.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
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
                      </div>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {formatLastLogin(user.lastLoginAt || user.last_login_at)}
                      </p>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {formatDate(user.createdAt || user.created_at || new Date().toISOString())}
                      </p>
                    </td>
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          title="View User Profile"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.isActive ?? user.is_active ?? false)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                          title={(user.isActive ?? user.is_active) ? "Deactivate User" : "Activate User"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-red-300 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Delete User"
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
                  <td colSpan={5} className="px-5 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {userListData.total > userListData.limit && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((userListData.page - 1) * userListData.limit) + 1} to {Math.min(userListData.page * userListData.limit, userListData.total)} of {userListData.total} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(userListData.page - 1)}
                  disabled={!userListData.hasPreviousPage}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm">
                  Page {userListData.page}
                </span>
                <button
                  onClick={() => handlePageChange(userListData.page + 1)}
                  disabled={!userListData.hasNextPage}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Create User Modal */}
      <CreateUserForm 
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateUser}
      />
    </>
  );
}