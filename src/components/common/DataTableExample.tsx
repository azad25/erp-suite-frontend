"use client";
import React, { useState } from "react";
import DataTable, { DataTableColumn, DataTableAction } from "./DataTable";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { EyeIcon, PencilIcon, TrashBinIcon, DownloadIcon, ShootingStarIcon as StarIcon, EditIcon, BoxIcon } from "@/icons";

// Example data types
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  rating: number;
  createdAt: string;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  orderDate: string;
  items: number;
}

// Example data
const products: Product[] = [
  { id: "PROD-001", name: "Laptop Pro", category: "Electronics", price: 1299.99, stock: 45, status: "active", rating: 4.5, createdAt: "2024-01-15" },
  { id: "PROD-002", name: "Wireless Mouse", category: "Accessories", price: 29.99, stock: 120, status: "active", rating: 4.2, createdAt: "2024-01-20" },
  { id: "PROD-003", name: "Gaming Keyboard", category: "Electronics", price: 89.99, stock: 0, status: "inactive", rating: 4.8, createdAt: "2024-02-01" },
  { id: "PROD-004", name: "USB Cable", category: "Accessories", price: 9.99, stock: 200, status: "active", rating: 3.9, createdAt: "2024-02-10" },
  { id: "PROD-005", name: "Old Model Phone", category: "Electronics", price: 299.99, stock: 15, status: "discontinued", rating: 3.5, createdAt: "2023-12-01" },
];

const orders: Order[] = [
  { id: "ORD-001", customer: "John Smith", amount: 1299.99, status: "delivered", paymentMethod: "Credit Card", orderDate: "2024-02-15", items: 2 },
  { id: "ORD-002", customer: "Sarah Johnson", amount: 89.99, status: "processing", paymentMethod: "PayPal", orderDate: "2024-02-16", items: 1 },
  { id: "ORD-003", customer: "Mike Wilson", amount: 39.98, status: "shipped", paymentMethod: "Credit Card", orderDate: "2024-02-17", items: 2 },
  { id: "ORD-004", customer: "Emily Davis", amount: 299.99, status: "cancelled", paymentMethod: "Bank Transfer", orderDate: "2024-02-18", items: 1 },
  { id: "ORD-005", customer: "David Brown", amount: 129.98, status: "pending", paymentMethod: "Credit Card", orderDate: "2024-02-19", items: 3 },
];

export default function DataTableExample() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Product table columns
  const productColumns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Product Name",
      searchable: true,
      sortable: true,
      render: (product) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90">{product.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{product.id}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      searchable: true,
      sortable: true,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (product) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          ${product.price.toFixed(2)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      sortable: true,
      render: (product) => (
        <span className={product.stock === 0 ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-white/90"}>
          {product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => {
        const statusColors = {
          active: "success" as const,
          inactive: "warning" as const,
          discontinued: "error" as const,
        };
        return (
          <Badge color={statusColors[product.status]}>
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-800 dark:text-white/90">{product.rating}</span>
        </div>
      ),
    },
  ];

  // Product table actions
  const productActions: DataTableAction<Product>[] = [
    {
      key: "view",
      label: "View",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: (product) => console.log("View product:", product),
      variant: "ghost",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      onClick: (product) => console.log("Edit product:", product),
      variant: "ghost",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <TrashBinIcon className="w-4 h-4" />,
      onClick: (product) => {
        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
          console.log("Delete product:", product);
        }
      },
      variant: "ghost",
      color: "error",
    },
  ];

  // Bulk actions for products
  const productBulkActions: DataTableAction<Product[]>[] = [
    {
      key: "export",
      label: "Export Selected",
      icon: <DownloadIcon className="w-4 h-4" />,
      onClick: (products) => console.log("Export products:", products),
      variant: "outline",
    },
    {
      key: "archive",
      label: "Archive Selected",
      icon: <BoxIcon className="w-4 h-4" />,
      onClick: (products) => console.log("Archive products:", products),
      variant: "outline",
    },
  ];

  // Order table columns
  const orderColumns: DataTableColumn<Order>[] = [
    {
      key: "id",
      header: "Order ID",
      searchable: true,
      render: (order) => (
        <span className="font-medium text-gray-800 dark:text-white/90">{order.id}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      searchable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (order) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          ${order.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => {
        const statusColors = {
          pending: "warning" as const,
          processing: "info" as const,
          shipped: "primary" as const,
          delivered: "success" as const,
          cancelled: "error" as const,
        };
        return (
          <Badge color={statusColors[order.status]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
    },
    {
      key: "orderDate",
      header: "Order Date",
      sortable: true,
    },
    {
      key: "items",
      header: "Items",
      render: (order) => (
        <span className="text-gray-800 dark:text-white/90">{order.items}</span>
      ),
    },
  ];

  // Handle sorting
  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortColumn(key);
    setSortDirection(direction);
    console.log("Sort by:", key, direction);
  };

  // Handle row click
  const handleProductRowClick = (product: Product) => {
    console.log("Product clicked:", product);
  };

  return (
    <div className="space-y-8">
      {/* Basic DataTable Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Basic DataTable with Search and Actions
        </h2>
        <DataTable
          data={products}
          columns={productColumns}
          actions={productActions}
          searchable={true}
          searchPlaceholder="Search products..."
          searchKeys={["name", "category", "id"]}
          title="Product Inventory"
          description="Manage your product catalog and inventory"
          showHeader={true}
          emptyMessage="No products found"
          onRowClick={handleProductRowClick}
        />
      </div>

      {/* Selectable DataTable with Bulk Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Selectable DataTable with Bulk Actions
        </h2>
        <DataTable
          data={products}
          columns={productColumns}
          actions={productActions}
          searchable={true}
          searchPlaceholder="Search products..."
          searchKeys={["name", "category"]}
          selectable={true}
          selectedItems={selectedProducts}
          onSelectionChange={setSelectedProducts}
          bulkActions={productBulkActions}
          title="Product Management"
          description="Select products to perform bulk operations"
          showHeader={true}
          emptyMessage="No products found"
        />
      </div>

      {/* Sortable DataTable */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Sortable DataTable
        </h2>
        <DataTable
          data={orders}
          columns={orderColumns}
          searchable={true}
          searchPlaceholder="Search orders..."
          searchKeys={["id", "customer"]}
          sortable={true}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          title="Order Management"
          description="View and manage customer orders"
          showHeader={true}
          emptyMessage="No orders found"
        />
      </div>

      {/* DataTable with Pagination */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          DataTable with Pagination
        </h2>
        <DataTable
          data={products.slice(0, 3)} // Show only first 3 items
          columns={productColumns}
          actions={productActions}
          searchable={true}
          searchPlaceholder="Search products..."
          searchKeys={["name", "category"]}
          pagination={{
            currentPage: currentPage,
            totalPages: 3,
            totalItems: products.length,
            itemsPerPage: 3,
            onPageChange: setCurrentPage,
          }}
          title="Paginated Products"
          description="Products with pagination example"
          showHeader={true}
          emptyMessage="No products found"
        />
      </div>

      {/* DataTable without Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          DataTable without Header
        </h2>
        <DataTable
          data={products.slice(0, 2)}
          columns={productColumns}
          actions={productActions}
          searchable={false}
          showHeader={false}
          emptyMessage="No products found"
        />
      </div>

      {/* Loading State Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Loading State Example
        </h2>
        <DataTable
          data={[]}
          columns={productColumns}
          loading={true}
          title="Loading Products"
          description="Products are being loaded..."
          showHeader={true}
        />
      </div>

      {/* Error State Example */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Error State Example
        </h2>
        <DataTable
          data={[]}
          columns={productColumns}
          error="Failed to load products. Please check your connection and try again."
          onRetry={() => console.log("Retrying...")}
          title="Error Loading Products"
          description="There was an error loading the products"
          showHeader={true}
        />
      </div>
    </div>
  );
}
