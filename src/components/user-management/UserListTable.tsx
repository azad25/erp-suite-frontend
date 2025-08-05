"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import CreateUserForm from "./CreateUserForm";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  organization: {
    name: string;
    domain: string;
  };
}

const mockUsers: User[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@company.com",
    is_active: true,
    is_verified: true,
    last_login_at: "2024-01-15T10:30:00Z",
    created_at: "2024-01-01T00:00:00Z",
    organization: { name: "Tech Corp", domain: "techcorp.com" }
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@company.com",
    is_active: true,
    is_verified: false,
    last_login_at: "2024-01-14T15:45:00Z",
    created_at: "2024-01-02T00:00:00Z",
    organization: { name: "Tech Corp", domain: "techcorp.com" }
  },
  {
    id: "3",
    first_name: "Mike",
    last_name: "Johnson",
    email: "mike.johnson@company.com",
    is_active: false,
    is_verified: true,
    created_at: "2024-01-03T00:00:00Z",
    organization: { name: "Tech Corp", domain: "techcorp.com" }
  }
];

export default function UserListTable() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isCreateModalOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    openModal();
  };

  const handleCreateUser = async (userData: any) => {
    // In a real app, this would make an API call
    const newUser: User = {
      id: String(users.length + 1),
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      is_active: userData.is_active,
      is_verified: userData.is_verified,
      created_at: new Date().toISOString(),
      organization: { name: "Tech Corp", domain: "techcorp.com" }
    };
    
    setUsers(prev => [...prev, newUser]);
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
                Manage users, permissions, and access controls
              </p>
            </div>
            <Button size="sm" onClick={openCreateModal}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </Button>
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-4 lg:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                        <Image
                          width={40}
                          height={40}
                          src="/images/user/owner.jpg"
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 lg:px-6">
                    <div className="flex items-center gap-2">
                      <Badge 
                        color={user.is_active ? "success" : "light"}
                        size="sm"
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {user.is_verified && (
                        <Badge color="info" size="sm">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 lg:px-6">
                    <p className="text-sm text-gray-800 dark:text-white/90">
                      {formatLastLogin(user.last_login_at)}
                    </p>
                  </td>
                  <td className="px-5 py-4 lg:px-6">
                    <p className="text-sm text-gray-800 dark:text-white/90">
                      {formatDate(user.created_at)}
                    </p>
                  </td>
                  <td className="px-5 py-4 lg:px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        title="View Profile"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        title="Edit User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
        {selectedUser && (
          <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                User Profile
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                View and manage user information
              </p>
            </div>
            
            <div className="px-2 space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                <div className="w-16 h-16 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                  <Image
                    width={64}
                    height={64}
                    src="/images/user/owner.jpg"
                    alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      color={selectedUser.is_active ? "success" : "light"}
                      size="sm"
                    >
                      {selectedUser.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {selectedUser.is_verified && (
                      <Badge color="info" size="sm">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                  <h6 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
                    Account Information
                  </h6>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedUser.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Verified</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedUser.is_verified ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                  <h6 className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">
                    Activity
                  </h6>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {formatLastLogin(selectedUser.last_login_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {formatDate(selectedUser.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Organization</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {selectedUser.organization.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm">
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <CreateUserForm 
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateUser}
      />
    </>
  );
}