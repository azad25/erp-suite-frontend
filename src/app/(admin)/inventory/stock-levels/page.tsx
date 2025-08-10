"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const StockLevelsPage = () => {
  const [stockItems] = useState([
    { id: "PRD-001", name: "Laptop Pro", currentStock: 25, minStock: 10, maxStock: 100, reorderPoint: 15, status: "Good" },
    { id: "PRD-002", name: "Office Chair", currentStock: 12, minStock: 5, maxStock: 50, reorderPoint: 8, status: "Good" },
    { id: "PRD-003", name: "Software License", currentStock: 0, minStock: 5, maxStock: 25, reorderPoint: 5, status: "Out of Stock" },
    { id: "PRD-004", name: "Wireless Mouse", currentStock: 3, minStock: 10, maxStock: 100, reorderPoint: 15, status: "Low Stock" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Low Stock": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Out of Stock": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Overstock": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Stock Levels" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Stock Levels
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Generate Reorder Report</Button>
            <Button>Adjust Stock</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-green-700 dark:text-green-300">Items in Stock</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Low Stock Items</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-red-700 dark:text-red-300">Out of Stock</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$45K</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Value</div>
          </div>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Product
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Current Stock
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock Level
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Reorder Point
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
            {stockItems.map((item) => (
              <TableRow key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {item.currentStock} / {item.maxStock}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.status === 'Good' ? 'bg-green-600' :
                          item.status === 'Low Stock' ? 'bg-yellow-600' :
                          item.status === 'Out of Stock' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }}
                      ></div>
                    </div>
                    {Math.round(getStockPercentage(item.currentStock, item.maxStock))}%
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {item.reorderPoint}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Reorder</Button>
                  <Button variant="link" className="mr-4">View Details</Button>
                  <Button variant="link">Movement</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockLevelsPage;