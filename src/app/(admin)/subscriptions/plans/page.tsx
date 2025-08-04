import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { CheckCircleIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Subscription Plans | Unibase ERP Dashboard",
  description: "Subscription Plans for Unibase ERP Dashboard",
};

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  isPopular: boolean;
  isCurrentPlan: boolean;
}

const plans: Plan[] = [
  {
    id: 1,
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "Perfect for small businesses getting started",
    isPopular: false,
    isCurrentPlan: true,
    features: [
      { name: "Up to 5 users", included: true },
      { name: "Basic reporting", included: true },
      { name: "Email support", included: true },
      { name: "API access", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    id: 2,
    name: "Professional",
    price: "$79",
    period: "per month",
    description: "Ideal for growing teams and businesses",
    isPopular: true,
    isCurrentPlan: false,
    features: [
      { name: "Up to 25 users", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Priority support", included: true },
      { name: "API access", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "For large organizations with complex needs",
    isPopular: false,
    isCurrentPlan: false,
    features: [
      { name: "Unlimited users", included: true },
      { name: "Enterprise reporting", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Full API access", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: true },
    ],
  },
];

export default function SubscriptionPlans() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Subscription Plans" />
      
      <div className="space-y-6">
        <ComponentCard title="Choose Your Plan">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  plan.isPopular
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge color="primary" size="sm">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {plan.isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge color="success" size="sm">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {" "}{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          feature.included
                            ? "bg-green-100 text-green-600 dark:bg-green-500/20"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                        }`}
                      >
                        {feature.included ? (
                          <CheckCircleIcon className="h-3 w-3" />
                        ) : (
                          <span className="text-xs">×</span>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button
                    variant={plan.isCurrentPlan ? "outline" : plan.isPopular ? "primary" : "outline"}
                    size="md"
                    className="w-full"
                    disabled={plan.isCurrentPlan}
                  >
                    {plan.isCurrentPlan ? "Current Plan" : "Upgrade to " + plan.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        <ComponentCard title="Plan Comparison">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <table className="w-full">
                  <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Features
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        Starter
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        Professional
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Users
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Up to 5
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Up to 25
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Unlimited
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Storage
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        10 GB
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        100 GB
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        1 TB
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        API Calls/month
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        1,000
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        10,000
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Unlimited
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Support
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Priority
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        24/7 Phone
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}