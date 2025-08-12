"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import Image from "next/image";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";

// Types
export interface DataTableColumn<T = any> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

export interface DataTableAction<T = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "primary" | "outline" | "link" | "ghost";
  size?: "sm" | "md";
  color?: "default" | "success" | "error" | "warning" | "info";
  disabled?: (item: T) => boolean;
  hidden?: (item: T) => boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
  className?: string;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  bulkActions?: DataTableAction<T[]>[];
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export default function DataTable<T = any>({
  data,
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  pagination,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "No data available",
  title,
  description,
  showHeader = true,
  className = "",
  onRowClick,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  bulkActions = [],
  sortable = false,
  onSort,
  sortColumn,
  sortDirection = 'asc'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedItems, setLocalSelectedItems] = useState<T[]>(selectedItems);
  
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!debouncedSearch || searchKeys.length === 0) return data;
    
    return data.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(debouncedSearch.toLowerCase());
      });
    });
  }, [data, debouncedSearch, searchKeys]);

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? [...filteredData] : [];
    setLocalSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    const newSelection = checked 
      ? [...localSelectedItems, item]
      : localSelectedItems.filter(selected => selected !== item);
    setLocalSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSort = (columnKey: string) => {
    if (!sortable || !onSort) return;
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  // Loading state
  if (loading) {
    return (
      <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
        <div className="p-5 lg:p-6">
          <div className="animate-pulse space-y-4">
            {showHeader && (
              <>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </>
            )}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 ${className}`}>
        <div className="p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-red-800 dark:text-red-200">
                Error Loading Data
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
              {onRetry && (
                <button 
                  onClick={onRetry}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {searchable && (
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectable && localSelectedItems.length > 0 && bulkActions.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {localSelectedItems.length} item(s) selected
            </span>
            {bulkActions.map((action) => (
              <Button
                key={action.key}
                size={action.size || "sm"}
                variant={action.variant || "outline"}
                onClick={() => action.onClick(localSelectedItems)}
                disabled={action.disabled?.(localSelectedItems)}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-200 dark:border-gray-800">
              {selectable && (
                <th className="px-5 py-4 text-left lg:px-6">
                  <input
                    type="checkbox"
                    checked={localSelectedItems.length === filteredData.length && filteredData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6 ${
                    column.width ? column.width : ''
                  } ${sortable && column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {sortable && column.sortable && sortColumn === column.key && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                        />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider lg:px-6">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="px-5 py-4 lg:px-6">
                      <input
                        type="checkbox"
                        checked={localSelectedItems.includes(item)}
                        onChange={(e) => handleSelectItem(item, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 lg:px-6">
                      {column.render ? column.render(item, index) : String(item[column.key as keyof T] || '')}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        {actions.map((action) => {
                          if (action.hidden?.(item)) return null;
                          return (
                            <Button
                              key={action.key}
                              size={action.size || "sm"}
                              variant={action.variant || "ghost"}
                              onClick={(e) => {
                                e?.stopPropagation();
                                action.onClick(item);
                              }}
                              disabled={action.disabled?.(item)}
                              startIcon={action.icon}
                              className="w-8 h-8 p-0"
                            >
                              {!action.icon && action.label}
                            </Button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-5 py-8 text-center text-gray-500 dark:text-gray-400 lg:px-6"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} items
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
