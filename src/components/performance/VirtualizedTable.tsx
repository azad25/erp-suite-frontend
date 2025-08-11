"use client";

import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Array<{
    key: string;
    header: string;
    render: (item: T, index: number) => React.ReactNode;
    width?: string;
    sortable?: boolean;
  }>;
  rowHeight?: number;
  containerHeight?: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  keyExtractor?: (item: T, index: number) => string | number;
}

const VirtualizedTable = <T,>({
  data,
  columns,
  rowHeight = 60,
  containerHeight = 400,
  className = '',
  onRowClick,
  keyExtractor = (_, index) => index,
}: VirtualizedTableProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const visibleCount = Math.ceil(containerHeight / rowHeight);
    const end = Math.min(start + visibleCount + 2, data.length); // +2 for buffer
    
    return { start: Math.max(0, start - 1), end }; // -1 for buffer
  }, [scrollTop, rowHeight, containerHeight, data.length]);

  // Sort data if needed
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return sortedData.slice(visibleRange.start, visibleRange.end);
  }, [sortedData, visibleRange]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Handle sort
  const handleSort = useCallback((columnKey: string) => {
    setSortConfig(current => {
      if (current?.key === columnKey) {
        return {
          key: columnKey,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);

  // Handle row click
  const handleRowClick = useCallback((item: T, originalIndex: number) => {
    onRowClick?.(item, originalIndex);
  }, [onRowClick]);

  const totalHeight = sortedData.length * rowHeight;
  const offsetY = visibleRange.start * rowHeight;

  return (
    <div className={`relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                column.width || 'flex-1'
              } ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
              onClick={column.sortable ? () => handleSort(column.key) : undefined}
            >
              <div className="flex items-center space-x-1">
                <span>{column.header}</span>
                {column.sortable && sortConfig?.key === column.key && (
                  <span className="text-gray-400">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Virtual spacer */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item, index) => {
              const originalIndex = visibleRange.start + index;
              const key = keyExtractor(item, originalIndex);
              
              return (
                <div
                  key={key}
                  className={`flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  style={{ height: rowHeight }}
                  onClick={() => handleRowClick(item, originalIndex)}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-900 dark:text-white flex items-center ${
                        column.width || 'flex-1'
                      }`}
                    >
                      {column.render(item, originalIndex)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading state for empty data */}
      {data.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}
    </div>
  );
};

export default memo(VirtualizedTable) as typeof VirtualizedTable;