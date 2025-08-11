"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { UserIcon, CheckCircleIcon, ShootingStarIcon, PieChartIcon } from "@/icons";


const SuppliersPage = () => {
  const [suppliers] = useState([
    { id: "SUP-001", name: "Tech Solutions Ltd", contact: "John Doe", email: "john@techsolutions.com", phone: "+1234567890", rating: 4.5, status: "Active" },
    { id: "SUP-002", name: "Office Supplies Co", contact: "Jane Smith", email: "jane@officesupplies.com", phone: "+1234567891", rating: 4.2, status: "Active" },
    { id: "SUP-003", name: "Manufacturing Parts Inc", contact: "Mike Johnson", email: "mike@mfgparts.com", phone: "+1234567892", rating: 3.8, status: "Inactive" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "light";
      case "Suspended": return "error";
      default: return "light";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };



  return (
    <DashboardLayout title="Suppliers" description="Manage your supplier relationships">
      <ComponentCard
        title="Supplier Management"
        desc="View and manage all your business suppliers"
      >
        <div className="flex justify-end mb-6">
          <Button>Add Supplier</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Suppliers"
            value="48"
            icon={<UserIcon />}
            color="blue"
          />
          <StatsCard
            title="Active Suppliers"
            value="42"
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatsCard
            title="Average Rating"
            value="4.2"
            icon={<ShootingStarIcon />}
            color="yellow"
          />
          <StatsCard
            title="Performance"
            value="92%"
            icon={<PieChartIcon />}
            color="purple"
          />
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Supplier
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact Person
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact Info
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rating
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{supplier.name}</div>
                    <div className="text-xs text-gray-500">{supplier.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {supplier.contact}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div>
                    <div>{supplier.email}</div>
                    <div className="text-xs text-gray-400">{supplier.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(supplier.rating)}</div>
                    <span>{supplier.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getStatusColor(supplier.status)}>
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Edit</Button>
                  <Button variant="link">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </DashboardLayout>
  );
};

export default SuppliersPage;