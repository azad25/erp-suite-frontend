"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import Switch from "../form/switch/Switch";
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
  { value: "viewer", label: "Viewer" },
];

interface EditUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: EditUserFormData) => Promise<void> | void;
}

export default function EditUserForm({ isOpen, onClose, user, onSubmit }: EditUserFormProps) {
  const [formData, setFormData] = useState<EditUserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    is_active: true,
    is_verified: false,
    role: "user",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.firstName || user.first_name || "",
        last_name: user.lastName || user.last_name || "",
        email: user.email || "",
        is_active: user.isActive ?? user.is_active ?? true,
        is_verified: user.isVerified ?? user.is_verified ?? false,
        role: user.roles && user.roles.length > 0 ? (user.roles[0].name || "user") : "user",
      });
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (field: keyof EditUserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit User</h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Update user details and status.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
            <div className="space-y-6">
              <div>
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Personal Information</h5>
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
                    {errors.first_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.first_name}</p>}
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
                    {errors.last_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.last_name}</p>}
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
                    {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Permissions & Settings</h5>
                <div className="space-y-4">
                  <div>
                    <Label>Role</Label>
                    <Select
                      defaultValue={formData.role}
                      onChange={(value) => handleInputChange("role", value)}
                      options={roleOptions}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">Active Status</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">User can log in and access the system</p>
                    </div>
                    <Switch label="" defaultChecked={formData.is_active} onChange={(checked) => handleInputChange("is_active", checked)} />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">Email Verified</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mark email as verified</p>
                    </div>
                    <Switch label="" defaultChecked={formData.is_verified} onChange={(checked) => handleInputChange("is_verified", checked)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <button
              className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

