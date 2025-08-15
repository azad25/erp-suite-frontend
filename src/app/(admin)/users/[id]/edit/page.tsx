"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userManagementService } from "@/services/userManagement";
import { organizationManagementService } from "@/services/organizationManagement";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select/Select";
import { Switch } from "@/components/ui/switch/Switch";
import { Card } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { User } from "@/types/user";

interface EditUserFormData {
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
}

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
  { value: "viewer", label: "Viewer" }
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<EditUserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    is_active: true,
    is_verified: false,
    role: "user"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] = useState<any>(null);

  usePageTitle("Edit User", "Update user details and permissions");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = String(params?.id ?? "");
        if (!id) {
          setError("Invalid user ID");
          return;
        }
        const u = await userManagementService.getUserById(id);
        if (u === null) {
          setError("User not found");
        } else {
          setUser(u);
          // Populate form with user data
          setFormData({
            first_name: u.firstName || u.first_name || "",
            last_name: u.lastName || u.last_name || "",
            email: u.email || "",
            is_active: u.isActive ?? u.is_active ?? true,
            is_verified: u.isVerified ?? u.is_verified ?? false,
            role: u.roles?.[0]?.name || "user"
          });

          // Load organization data if user has organization
          if (u.organization?.id) {
            try {
              const orgData = await organizationManagementService.getOrganizationById(u.organization.id);
              setOrganization(orgData);
            } catch (orgError) {
              console.error('Error loading organization:', orgError);
            }
          }
        }
      } catch (e) {
        console.error("Error loading user:", e);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const handleInputChange = (field: keyof EditUserFormData, value: string | boolean) => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        firstName: formData.first_name,
        lastName: formData.last_name,
        isActive: formData.is_active,
        isVerified: formData.is_verified,
        roleIds: formData.role ? [formData.role] : undefined,
      };
      
      const result = await userManagementService.updateUser(user.id, payload);
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
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit User</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">User not found or failed to load</p>
          </div>
          <Button onClick={() => router.push("/users")} variant="outline">
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
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-gray-600 dark:text-gray-400">User not found</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit User</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update user details and permissions</p>
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
                {organization?.name || user.organization?.name || 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          {(organization || user.organization) && (
            <div className="mt-2 flex items-center gap-2">
              <Badge color={organization?.isActive ? "success" : "light"} size="sm">
                {organization?.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {organization?.domain || user.organization?.domain}
              </span>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User Status</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {(user.isActive ?? user.is_active) ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <Badge color={(user.isActive ?? user.is_active) ? "success" : "light"} size="sm">
              {(user.isActive ?? user.is_active) ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Status</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {(user.isVerified ?? user.is_verified) ? "Verified" : "Unverified"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <Badge color={(user.isVerified ?? user.is_verified) ? "info" : "light"} size="sm">
              {(user.isVerified ?? user.is_verified) ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User Role</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate">
                {user.roles?.[0]?.name || 'No Role'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* User Info Header */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {user.firstName || user.first_name} {user.lastName || user.last_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color={(user.isActive ?? user.is_active) ? "success" : "light"} size="sm">
                {(user.isActive ?? user.is_active) ? "Active" : "Inactive"}
              </Badge>
              {(user.isVerified ?? user.is_verified) && (
                <Badge color="info" size="sm">Verified</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">User Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the user's details and permissions
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
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      Email Verified
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mark email as verified
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_verified}
                    onCheckedChange={(checked) => handleInputChange("is_verified", checked)}
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
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

