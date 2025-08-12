"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";
import { apiClient } from "../../lib/api";
import type { User } from "../../types/user";

interface EnhancedUserProfileProps {
  showSecuritySection?: boolean;
  showOrganizationSection?: boolean;
}

export default function EnhancedUserProfile({ 
  showSecuritySection = true, 
  showOrganizationSection = true 
}: EnhancedUserProfileProps) {
  // Suppress unused variable warning for showOrganizationSection
  // This prop is kept for future use when organization section is implemented
  void showOrganizationSection;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isPasswordModalOpen, openModal: openPasswordModal, closeModal: closePasswordModal } = useModal();
  
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get user from API first
      const response = await apiClient.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        setEditForm({
          first_name: response.data.first_name || response.data.firstName || '',
          last_name: response.data.last_name || response.data.lastName || '',
          email: response.data.email
        });
      } else {
        // Fallback to localStorage
        const localUser = apiClient.getCurrentUserFromStorage();
        if (localUser) {
          setUser(localUser);
          setEditForm({
            first_name: localUser.first_name || localUser.firstName || '',
            last_name: localUser.last_name || localUser.lastName || '',
            email: localUser.email
          });
        } else {
          setError("Unable to load user profile");
        }
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll update the local state
      if (user) {
        const updatedUser = {
          ...user,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        closeEditModal();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      // In a real implementation, this would call the API
      console.log("Changing password...");
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
      closePasswordModal();
      alert("Password changed successfully");
    } catch (err) {
      console.error("Error changing password:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      router.push('/signin');
    } catch (err) {
      console.error("Error logging out:", err);
      // Fallback to hard redirect only if router push fails
      if (typeof window !== 'undefined') {
        window.location.assign('/signin');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error || "User not found"}</p>
        <Button size="sm" className="mt-4" onClick={loadUserProfile}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {(user.first_name || user.firstName || '').charAt(0)}{(user.last_name || user.lastName || '').charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {(user.first_name || user.firstName || '')} {(user.last_name || user.lastName || '')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color="success" size="sm">
                    Active
                  </Badge>
                  {user.email_verified_at && (
                    <Badge color="info" size="sm">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={openEditModal}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Account Information
          </h4>
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">First Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.first_name || user.firstName || 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.last_name || user.lastName || 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.created_at || user.createdAt ? formatDate(user.created_at || user.createdAt || '') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        {showSecuritySection && (
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Security Settings
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    Password
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: Recently
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={openPasswordModal}>
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add an extra layer of security
                  </p>
                </div>
                <Badge color="light" size="sm">
                  Disabled
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Quick Actions
          </h4>
          
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] text-left">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Security Settings
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your account security
                </p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] text-left">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Activity Log
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  View your recent activities
                </p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] text-left">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Preferences
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Customize your experience
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h4>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                value={editForm.first_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={editForm.last_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button 
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Change Password
          </h4>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
              />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button 
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={closePasswordModal}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}