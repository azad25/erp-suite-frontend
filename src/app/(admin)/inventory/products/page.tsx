"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/Card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { BoxIcon, PlusIcon, AlertIcon, CheckCircleIcon } from "@/icons";

const ProductsPage = () => {
  const [products] = useState([
    { id: "PRD-001", name: "Laptop Pro", sku: "LP-2024-001", category: "Electronics", price: "$1,299", stock: 25, status: "Active" },
    { id: "PRD-002", name: "Office Chair", sku: "OC-2024-002", category: "Furniture", price: "$299", stock: 12, status: "Active" },
    { id: "PRD-003", name: "Software License", sku: "SL-2024-003", category: "Software", price: "$99", stock: 0, status: "Out of Stock" },
    { id: "PRD-004", name: "Consulting Service", sku: "CS-2024-004", category: "Services", price: "$150/hr", stock: "∞", status: "Active" },
    { id: "PRD-005", name: "Wireless Mouse", sku: "WM-2024-005", category: "Electronics", price: "$45", stock: 8, status: "Low Stock" },
  ]);

  const categories = ["Electronics", "Furniture", "Software", "Services"];

  return (
    <DashboardLayout
      title="Product Catalog"
      description="Manage products, services, and inventory items"
      icon={<BoxIcon />}
    >
      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value="1,247"
          icon={<BoxIcon />}
          color="blue"
        />
        <StatsCard
          title="Active Products"
          value="1,198"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Low Stock"
          value="23"
          icon={<AlertIcon />}
          color="yellow"
        />
        <StatsCard
          title="Out of Stock"
          value="26"
          icon={<AlertIcon />}
          color="red"
        />
      </div>

      {/* Product List */}
      <ComponentCard 
        title="Product Management" 
        desc="Complete product catalog with inventory tracking"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Categories</option>
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Import Products</Button>
            <Button startIcon={<PlusIcon />}>Add Product</Button>
          </div>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Product Name
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SKU
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock
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
            {products.map((product) => (
              <TableRow key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{product.name}</div>
                    <div className="text-xs text-gray-500">{product.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {product.sku}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="light" color="info" size="sm">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {product.price}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    {product.stock}
                    {product.stock !== "∞" && product.stock < 10 && product.stock > 0 && (
                      <AlertIcon className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant="light" 
                    color={
                      product.status === "Active" ? "success" :
                      product.status === "Out of Stock" ? "error" :
                      product.status === "Low Stock" ? "warning" : "light"
                    }
                    size="sm"
                  >
                    {product.status}
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

export default ProductsPage;