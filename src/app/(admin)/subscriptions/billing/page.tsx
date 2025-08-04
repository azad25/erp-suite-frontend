import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { DownloadIcon, PencilIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Billing & Invoices | Unibase ERP Dashboard",
  description: "Billing and Invoices for Unibase ERP Dashboard",
};

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  plan: string;
  period: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
  expiryDate?: string;
}

const invoices: Invoice[] = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: "$79.00",
    status: "paid",
    plan: "Professional",
    period: "Jan 2024",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-15",
    amount: "$79.00",
    status: "paid",
    plan: "Professional",
    period: "Dec 2023",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-15",
    amount: "$29.00",
    status: "paid",
    plan: "Starter",
    period: "Nov 2023",
  },
  {
    id: "INV-2023-010",
    date: "2023-10-15",
    amount: "$29.00",
    status: "paid",
    plan: "Starter",
    period: "Oct 2023",
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiryDate: "12/26",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "Mastercard",
    last4: "8888",
    expiryDate: "08/25",
    isDefault: false,
  },
  {
    id: "pm_3",
    type: "paypal",
    email: "user@example.com",
    isDefault: false,
  },
];

export default function BillingPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Billing & Invoices" />
      
      <div className="space-y-6">
        {/* Current Subscription */}
        <ComponentCard title="Current Subscription">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Professional Plan
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  $79.00 per month • Next billing: February 15, 2024
                </p>
                <div className="mt-2">
                  <Badge color="success" size="sm">
                    Active
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Change Plan
                </Button>
                <Button variant="outline" size="sm">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Payment Methods */}
        <ComponentCard title="Payment Methods">
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    {method.type === "card" ? (
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {method.brand?.substring(0, 2).toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-blue-600">PP</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {method.type === "card"
                          ? `${method.brand} ending in ${method.last4}`
                          : `PayPal ${method.email}`}
                      </span>
                      {method.isDefault && (
                        <Badge color="primary" size="sm">
                          Default
                        </Badge>
                      )}
                    </div>
                    {method.expiryDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires {method.expiryDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      Set Default
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              Add Payment Method
            </Button>
          </div>
        </ComponentCard>

        {/* Billing History */}
        <ComponentCard title="Billing History">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <table className="w-full">
                  <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Invoice
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {invoice.id}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.period}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {invoice.plan}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.amount}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            color={
                              invoice.status === "paid"
                                ? "success"
                                : invoice.status === "pending"
                                ? "warning"
                                : "error"
                            }
                            size="sm"
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Billing Address */}
        <ComponentCard title="Billing Address">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Acme Corporation
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  123 Business Street<br />
                  Suite 100<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Tax ID: 12-3456789
                </p>
              </div>
              <Button variant="outline" size="sm">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}