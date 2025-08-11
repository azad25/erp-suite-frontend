"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => React.ReactNode;
    width?: string;
  }>;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}

export function VirtualizedTable<T extends Record<string, any>>({
  data,
  columns,
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  className = ""
}: VirtualizedTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      data.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, data.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return data.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [data, visibleRange]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = data.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div className={`border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {columns.map((column, index) => (
            <div
              key={String(column.key)}
              className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                column.width || 'flex-1'
              }`}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Virtualized Table Body */}
      <div
        className="relative overflow-auto bg-white dark:bg-gray-900"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
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
              const actualIndex = visibleRange.startIndex + index;
              return (
                <VirtualizedRow
                  key={actualIndex}
                  item={item}
                  columns={columns}
                  height={itemHeight}
                  isEven={actualIndex % 2 === 0}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface VirtualizedRowProps<T> {
  item: T;
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => React.ReactNode;
    width?: string;
  }>;
  height: number;
  isEven: boolean;
}

function VirtualizedRow<T extends Record<string, any>>({
  item,
  columns,
  height,
  isEven
}: VirtualizedRowProps<T>) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '50px',
    triggerOnce: false
  });

  return (
    <div
      ref={ref}
      className={`flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'
      }`}
      style={{ height }}
    >
      {inView ? (
        columns.map((column) => (
          <div
            key={String(column.key)}
            className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 flex items-center ${
              column.width || 'flex-1'
            }`}
          >
            {column.render
              ? column.render(item[column.key], item)
              : String(item[column.key] || '')}
          </div>
        ))
      ) : (
        <div className="flex-1 px-4 py-3 text-sm text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
}