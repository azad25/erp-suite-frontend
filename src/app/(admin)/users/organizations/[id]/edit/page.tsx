"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { organizationManagementService, type Organization } from "@/services/organizationManagement";

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const id = String(params?.id ?? "");
        if (!id) return;
        const data = await organizationManagementService.getOrganizationById(id);
        setOrg(data);
        setName(data?.name ?? "");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setSaving(true);
    try {
      const res = await organizationManagementService.updateOrganization(org.id, { name });
      if (res?.success) router.push("/users/organizations");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!org) return <div>Organization not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Organization</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update organization details</p>
      </div>
      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/users/organizations")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </div>
  );
}

