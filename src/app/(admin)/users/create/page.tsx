"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userManagementService } from "@/services/userManagement";
import { organizationManagementService } from "@/services/organizationManagement";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { Card } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import { usePageTitle } from "@/hooks/usePageTitle";

interface CreateUserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
}

const initialFormData: CreateUserFormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  is_active: true,
  is_verified: false,
  role: "user"
};

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
  { value: "viewer", label: "Viewer" }
];

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [orgStats, setOrgStats] = useState<any>(null);

  usePageTitle("Create User", "Add a new user to your organization");

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const loadOrganizationData = async () => {
    try {
      // Get current user's organization
      const currentUserResponse = await userManagementService.getCurrentUser();
      const currentUser = (currentUserResponse as any)?.data || currentUserResponse;
      if (currentUser?.organization?.id) {
        const orgData = await organizationManagementService.getOrganizationById(currentUser.organization.id);
        setOrganization(orgData);
      }
      
      // Get organization stats
      const stats = await organizationManagementService.getOrganizationStats();
      setOrgStats(stats);
    } catch (error) {
      console.error('Error loading organization data:', error);
    }
  };

  const handleInputChange = (field: keyof CreateUserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.first_name,
        lastName: formData.last_name,
        isActive: formData.is_active,
        isVerified: formData.is_verified,
        roleIds: formData.role ? [formData.role] : undefined,
      };
      
      const result = await userManagementService.createUser(payload);
      if (result.success) {
        router.push("/users");
      } else {
        console.error(result.errors);
        // Handle API errors
        if (result.errors) {
          const apiErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, messages]) => {
            if (Array.isArray(messages)) {
              apiErrors[key] = messages[0];
            }
          });
          setErrors(apiErrors);
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Create User</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new user to your organization</p>
        </div>
        <Button onClick={() => router.push("/users")} variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </Button>
      </div>

      {/* Organization Info Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organization</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {organization?.name || 'Loading...'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          {organization && (
            <div className="mt-2 flex items-center gap-2">
              <Badge color={organization.isActive ? "success" : "light"} size="sm">
                {organization.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {organization.domain}
              </span>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {organization?.userCount || orgStats?.totalUsers || 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {organization?.activeUserCount || orgStats?.activeUsers || 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Domain</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate">
                {organization?.domain || 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* User Creation Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">User Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to create a new user account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>First Name *</Label>
                <Input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Enter first name"
                  className={errors.first_name ? "border-red-300 dark:border-red-700" : ""}
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <Label>Last Name *</Label>
                <Input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                  className={errors.last_name ? "border-red-300 dark:border-red-700" : ""}
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-300 dark:border-red-700" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Security
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter password"
                  className={errors.password ? "border-red-300 dark:border-red-700" : ""}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                  placeholder="Confirm password"
                  className={errors.password_confirmation ? "border-red-300 dark:border-red-700" : ""}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Permissions & Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Permissions & Settings
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Role</Label>
                <Select
                  defaultValue={formData.role}
                  onChange={(value) => handleInputChange("role", value)}
                  options={roleOptions}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      Active Status
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      User can log in and access the system
                    </p>
                  </div>
                  <Switch
                    label=""
                    defaultChecked={formData.is_active}
                    onChange={(checked) => handleInputChange("is_active", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      Email Verified
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mark email as verified (skip email verification)
                    </p>
                  </div>
                  <Switch
                    label=""
                    defaultChecked={formData.is_verified}
                    onChange={(checked) => handleInputChange("is_verified", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/users")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}