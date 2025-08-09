"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { userManagementService } from "@/services/userManagement";

export default function CreateRolePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await userManagementService.createRole({ name: form.name, description: form.description });
      if (res.success) router.push("/users/roles");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Create Role</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define a new role</p>
      </div>
      <form onSubmit={submit} className="max-w-xl space-y-4">
        <div>
          <Label>Role Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/users/roles")}>Cancel</Button>
          <Button disabled={submitting}>{submitting ? "Creating..." : "Create Role"}</Button>
        </div>
      </form>
    </div>
  );
}

