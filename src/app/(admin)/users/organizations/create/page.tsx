"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import Button from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import { usePageTitle } from "@/hooks/usePageTitle";
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

  usePageTitle("Create Organization", "Provision a new organization and admin");

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Create Organization</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Provision a new organization and admin</p>
        </div>
        <Button onClick={() => router.push("/users/organizations")} variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Organizations
        </Button>
      </div>

      {/* Organization Creation Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Organization Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to create a new organization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Organization Details
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Organization Name *</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => handleChange("name", e.target.value)} 
                  placeholder="Acme Inc" 
                  required
                />
              </div>
              <div>
                <Label>Domain *</Label>
                <Input 
                  value={form.domain} 
                  onChange={(e) => handleChange("domain", e.target.value)} 
                  placeholder="acme.com" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Admin User Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Administrator Account
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Admin First Name *</Label>
                <Input 
                  value={form.adminFirstName} 
                  onChange={(e) => handleChange("adminFirstName", e.target.value)} 
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label>Admin Last Name *</Label>
                <Input 
                  value={form.adminLastName} 
                  onChange={(e) => handleChange("adminLastName", e.target.value)} 
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Admin Email *</Label>
                <Input 
                  type="email" 
                  value={form.adminEmail} 
                  onChange={(e) => handleChange("adminEmail", e.target.value)} 
                  placeholder="admin@acme.com"
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Admin Password *</Label>
                <Input 
                  type="password" 
                  value={form.adminPassword} 
                  onChange={(e) => handleChange("adminPassword", e.target.value)} 
                  placeholder="Enter secure password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/users/organizations")}
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
                "Create Organization"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

