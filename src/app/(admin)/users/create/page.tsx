"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CreateUserForm from "@/components/user-management/CreateUserForm";
import { userManagementService } from "@/services/userManagement";

export default function CreateUserPage() {
  const router = useRouter();

  const handleCreateUser = async (userData: any) => {
    const payload = {
      email: userData.email,
      password: userData.password,
      firstName: userData.first_name,
      lastName: userData.last_name,
      isActive: userData.is_active,
      isVerified: userData.is_verified,
      roleIds: userData.role ? [userData.role] : undefined,
    };
    const result = await userManagementService.createUser(payload);
    if (result.success) {
      router.push("/users");
    } else {
      // Let the form show inline errors in the future; for now, console log
      console.error(result.errors);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Create User</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new user to your organization</p>
      </div>
      <CreateUserForm isOpen={true} onClose={() => router.push("/users")} onSubmit={handleCreateUser} />
    </div>
  );
}

