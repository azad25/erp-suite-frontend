import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { UserIcon, DollarLineIcon, PieChartIcon, BoxIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cards | Unibase ERP Dashboard",
  description: "Card components for Unibase ERP Dashboard",
};

export default function CardsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cards" />
      <div className="space-y-5 sm:space-y-6">
        
        {/* Basic Card */}
        <ComponentCard title="Basic Card">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400">
                This is a basic card with simple content. Cards are flexible containers for displaying content.
              </p>
            </CardContent>
          </Card>
        </ComponentCard>

        {/* Card with Header */}
        <ComponentCard title="Card with Header">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                This card includes a header with a title. Perfect for organizing content with clear sections.
              </p>
            </CardContent>
          </Card>
        </ComponentCard>

        {/* Stats Cards */}
        <ComponentCard title="Stats Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <DollarLineIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$45,678</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <PieChartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <BoxIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">567</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ComponentCard>

        {/* Interactive Card */}
        <ComponentCard title="Interactive Card">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Status</CardTitle>
              <Badge color="success" size="sm">Active</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track your project progress and manage tasks efficiently.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Edit Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </ComponentCard>

        {/* Card Grid Layout */}
        <ComponentCard title="Card Grid Layout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Description of the first feature with detailed information.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Description of the second feature with detailed information.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Description of the third feature with detailed information.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </ComponentCard>

      </div>
    </div>
  );
}