"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { organizationManagementService } from "@/services/organizationManagement";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    domain: "",
    adminEmail: "",
    adminFirstName: "",
    adminLastName: "",
    adminPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await organizationManagementService.createOrganization(form);
      if (res?.success) router.push("/users/organizations");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Create Organization</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Provision a new organization and admin</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Acme Inc" />
        </div>
        <div>
          <Label>Domain</Label>
          <Input value={form.domain} onChange={(e) => handleChange("domain", e.target.value)} placeholder="acme.com" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label>Admin First Name</Label>
            <Input value={form.adminFirstName} onChange={(e) => handleChange("adminFirstName", e.target.value)} />
          </div>
          <div>
            <Label>Admin Last Name</Label>
            <Input value={form.adminLastName} onChange={(e) => handleChange("adminLastName", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Admin Email</Label>
          <Input type="email" value={form.adminEmail} onChange={(e) => handleChange("adminEmail", e.target.value)} />
        </div>
        <div>
          <Label>Admin Password</Label>
          <Input type="password" value={form.adminPassword} onChange={(e) => handleChange("adminPassword", e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/users/organizations")}>Cancel</Button>
          <Button disabled={submitting}>{submitting ? "Creating..." : "Create Organization"}</Button>
        </div>
      </form>
    </div>
  );
}

