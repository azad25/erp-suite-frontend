'use client';

import React, { useState, useMemo } from 'react';
import Input from '@/components/ui/input/Input';
import Badge from '@/components/ui/badge/Badge';
import { Card, CardContent } from '@/components/ui/card';

interface LanguageSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  categories: string[];
  totalResults: number;
}

interface SearchFilters {
  category: string;
  status: 'all' | 'translated' | 'untranslated' | 'modified';
  language: 'all' | 'en' | 'bn';
}

export default function LanguageSearch({ onSearch, categories, totalResults }: LanguageSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    status: 'all',
    language: 'all'
  });

  const handleSearch = (newQuery: string, newFilters?: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setQuery(newQuery);
    setFilters(updatedFilters);
    onSearch(newQuery, updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters: SearchFilters = {
      category: 'all',
      status: 'all',
      language: 'all'
    };
    setQuery('');
    setFilters(resetFilters);
    onSearch('', resetFilters);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.language !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search translation keys, English or Bengali text..."
            className="pl-10 pr-4"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
            <select
              value={filters.category}
              onChange={(e) => handleSearch(query, { category: e.target.value })}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
            >
              <option value="all">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <select
              value={filters.status}
              onChange={(e) => handleSearch(query, { status: e.target.value as SearchFilters['status'] })}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
            >
              <option value="all">All</option>
              <option value="translated">Fully Translated</option>
              <option value="untranslated">Missing Translations</option>
              <option value="modified">Recently Modified</option>
            </select>
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</label>
            <select
              value={filters.language}
              onChange={(e) => handleSearch(query, { language: e.target.value as SearchFilters['language'] })}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
            >
              <option value="all">All</option>
              <option value="en">English Only</option>
              <option value="bn">Bengali Only</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(activeFiltersCount > 0 || query) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>{totalResults} results found</span>
            {activeFiltersCount > 0 && (
              <Badge variant="light" size="sm">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </Badge>
            )}
          </div>
          
          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2">
            {filters.category !== 'all' && (
              <Badge variant="light" color="primary" size="sm">
                {filters.category}
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="light" color="warning" size="sm">
                {filters.status}
              </Badge>
            )}
            {filters.language !== 'all' && (
              <Badge variant="light" color="info" size="sm">
                {filters.language.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}