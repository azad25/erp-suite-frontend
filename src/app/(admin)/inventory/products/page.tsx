"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/common/DashboardLayout";
import ComponentCard from "@/components/common/ComponentCard";
import StatsCard from "@/components/common/StatsCard";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/common/DataTable";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { BoxIcon, PlusIcon, AlertIcon, CheckCircleIcon, EyeIcon, PencilIcon, TrashBinIcon } from "@/icons";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number | string;
  status: "Active" | "Inactive" | "Out of Stock" | "Low Stock";
}

const ProductsPage = () => {
  const [products] = useState<Product[]>([
    { id: "PRD-001", name: "Laptop Pro", sku: "LP-2024-001", category: "Electronics", price: "$1,299", stock: 25, status: "Active" },
    { id: "PRD-002", name: "Office Chair", sku: "OC-2024-002", category: "Furniture", price: "$299", stock: 12, status: "Active" },
    { id: "PRD-003", name: "Software License", sku: "SL-2024-003", category: "Software", price: "$99", stock: 0, status: "Out of Stock" },
    { id: "PRD-004", name: "Consulting Service", sku: "CS-2024-004", category: "Services", price: "$150/hr", stock: "∞", status: "Active" },
    { id: "PRD-005", name: "Wireless Mouse", sku: "WM-2024-005", category: "Electronics", price: "$45", stock: 8, status: "Low Stock" },
    { id: "PRD-006", name: "Desk Lamp", sku: "DL-2024-006", category: "Furniture", price: "$89", stock: 15, status: "Active" },
    { id: "PRD-007", name: "Cloud Storage", sku: "CS-2024-007", category: "Software", price: "$19/month", stock: "∞", status: "Active" },
  ]);

  const handleViewProduct = (product: Product) => {
    console.log("View product:", product);
    // Navigate to product detail page
  };

  const handleEditProduct = (product: Product) => {
    console.log("Edit product:", product);
    // Navigate to edit product page
  };

  const handleArchiveProduct = (product: Product) => {
    console.log("Archive product:", product);
    // Archive product logic
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Product Name",
      searchable: true,
      render: (product) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{product.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{product.id}</div>
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      searchable: true,
      render: (product) => (
        <span className="text-gray-800 dark:text-white/90">{product.sku}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      searchable: true,
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{product.price}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => (
        <span className={typeof product.stock === 'number' && product.stock === 0 ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-white/90"}>
          {product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => {
        const statusColors = {
          Active: "success" as const,
          Inactive: "light" as const,
          "Out of Stock": "error" as const,
          "Low Stock": "warning" as const,
        };
        return (
          <Badge color={statusColors[product.status]}>
            {product.status}
          </Badge>
        );
      },
    },
  ];

  const actions: DataTableAction<Product>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: handleViewProduct,
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <PencilIcon className="w-4 h-4" />,
      onClick: handleEditProduct,
      variant: "ghost",
    },
    {
      key: "archive",
      label: "Archive",
      icon: <TrashBinIcon className="w-4 h-4" />,
      onClick: handleArchiveProduct,
      variant: "ghost",
      hidden: (product) => product.status === "Inactive",
    },
  ];

  return (
    <DashboardLayout
      title="Product Catalog"
      description="Manage products, services, and inventory items"
      icon={<BoxIcon />}
    >
      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        <div className="flex justify-end mb-6">
          <div className="flex gap-2">
            <Button variant="outline">Import Products</Button>
            <Button startIcon={<PlusIcon />}>Add Product</Button>
          </div>
        </div>

        <DataTable
          data={products}
          columns={columns}
          actions={actions}
          searchable={true}
          searchPlaceholder="Search products..."
          searchKeys={["name", "sku", "category"]}
          title="Product Catalog"
          description="Manage all products, services, and inventory items"
          showHeader={true}
          emptyMessage="No products found"
          sortable={true}
        />
      </ComponentCard>
    </DashboardLayout>
  );
};

export default ProductsPage;