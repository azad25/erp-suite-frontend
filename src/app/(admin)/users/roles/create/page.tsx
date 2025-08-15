"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import Button from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { userManagementService } from "@/services/userManagement";

export default function CreateRolePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Create Role", "Define a new role with specific permissions");

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Create Role</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define a new role with specific permissions</p>
        </div>
        <Button onClick={() => router.push("/users/roles")} variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Roles
        </Button>
      </div>

      {/* Role Creation Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Role Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to create a new role
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Role Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Role Name *</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="Enter role name (e.g., Manager, Editor)"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/users/roles")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

