"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { userManagementService } from "@/services/userManagement";

export default function RoleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [role, setRole] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const roles = await userManagementService.getRoles();
        const r = roles.find((x: any) => x.id === String(params?.id ?? ""));
        setRole(r || null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (!role) return <div>Role not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">{role.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
        </div>
        <div className="flex gap-2">
          <Badge color={role.isSystem ? "warning" : "info"} size="sm">{role.isSystem ? "System" : "Custom"}</Badge>
          <Badge color={role.isActive ? "success" : "light"} size="sm">{role.isActive ? "Active" : "Inactive"}</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Permissions</h2>
        {role.permissions && role.permissions.length > 0 ? (
          <div className="space-y-2">
            {role.permissions.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.resource} - {p.action}</p>
                </div>
                <Badge color="light" size="sm">{p.scope}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No permissions assigned</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.push("/users/roles")}>Back</Button>
      </div>
    </div>
  );
}

