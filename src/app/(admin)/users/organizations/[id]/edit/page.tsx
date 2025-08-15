"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import Button from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { organizationManagementService, type Organization } from "@/services/organizationManagement";

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  usePageTitle("Edit Organization", "Update organization details");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const id = String(params?.id ?? "");
        if (!id) {
          console.error("Invalid organization ID");
          return;
        }
        const data = await organizationManagementService.getOrganizationById(id);
        setOrg(data);
        setName(data?.name ?? "");
      } catch (error) {
        console.error("Error loading organization:", error);
        setOrg(null);
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

  if (!org) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Organization</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organization not found</p>
          </div>
          <Button onClick={() => router.push("/users/organizations")} variant="outline">
            Back to Organizations
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
                  Organization Not Found
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  The organization you're looking for doesn't exist or has been deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Organization</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update organization details</p>
        </div>
        <Button onClick={() => router.push("/users/organizations")} variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Organizations
        </Button>
      </div>

      {/* Organization Info Header */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {org.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{org.domain}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color={org.isActive ? "success" : "light"} size="sm">
                {org.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {org.userCount || 0} users
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Organization Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the organization's details
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Organization Name *</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter organization name"
                  required
                />
              </div>
              <div>
                <Label>Domain</Label>
                <Input 
                  value={org.domain} 
                  disabled
                  className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Domain cannot be changed after creation
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/users/organizations")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={saving}
            >
              {saving ? (
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
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

