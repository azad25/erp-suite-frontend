"use client";
import React from 'react';
import SearchBar from '@/components/search/SearchBar';
import { SearchResult } from '@/services/searchService';

const TestSearchPage: React.FC = () => {
  const handleResultSelect = (result: SearchResult) => {
    console.log('Selected result:', result);
    // This will be handled by the SearchBar component's default navigation
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Search Functionality Test
        </h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Desktop Search Bar
          </h2>
          <div className="max-w-md">
            <SearchBar 
              placeholder="Test search functionality..."
              onResultSelect={handleResultSelect}
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">
            How to test:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Type "dashboard" to see dashboard-related pages</li>
            <li>• Type "users" to see user management pages</li>
            <li>• Type "crm" to see CRM-related pages</li>
            <li>• Type "sales" to see sales-related pages</li>
            <li>• Use arrow keys to navigate suggestions</li>
            <li>• Press Enter or click to navigate to a page</li>
            <li>• Press Cmd/Ctrl + K to focus the search bar</li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-4">
            Search Features:
          </h3>
          <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
            <li>• ✅ Typeahead suggestions with fuzzy matching</li>
            <li>• ✅ Categorized results with icons</li>
            <li>• ✅ Keyboard navigation (↑↓ arrows, Enter, Escape)</li>
            <li>• ✅ Click to navigate functionality</li>
            <li>• ✅ Mobile-responsive with modal overlay</li>
            <li>• ✅ Dark mode support</li>
            <li>• ✅ Debounced search for performance</li>
            <li>• ✅ Popular searches when empty</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestSearchPage;