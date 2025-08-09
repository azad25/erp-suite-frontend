"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditUserForm from "@/components/user-management/EditUserForm";
import { userManagementService } from "@/services/userManagement";
import type { User } from "@/types/user";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleUpdate = async (data: any) => {
    if (!user) return;
    const payload = {
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      isActive: data.is_active,
      isVerified: data.is_verified,
      roleIds: data.role ? [data.role] : undefined,
    };
    const result = await userManagementService.updateUser(user.id, payload);
    if (result.success) {
      router.push("/users");
    } else {
      console.error(result.errors);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;
  if (!user) return <div className="text-gray-600 dark:text-gray-400">User not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit User</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update user details</p>
      </div>
      <EditUserForm isOpen={true} onClose={() => router.push("/users")} user={user} onSubmit={handleUpdate} />
    </div>
  );
}

