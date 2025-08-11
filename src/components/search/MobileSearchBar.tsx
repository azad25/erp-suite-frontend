"use client";
import React, { useState, useEffect, useRef } from 'react';
import { SearchService, SearchResult, searchCategories } from '@/services/searchService';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRouter } from 'next/navigation';

interface MobileSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchService = SearchService.getInstance();
  
  const debouncedQuery = useDebouncedValue(query, 200);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      const searchResults = searchService.search(debouncedQuery, 10);
      setResults(searchResults);
      setIsLoading(false);
      setSelectedIndex(-1);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, searchService]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleResultSelect(results[0]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    onClose();
    router.push(result.url);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <span className="absolute -translate-y-1/2 left-3 top-1/2 pointer-events-none">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, features, or modules..."
              className="w-full h-12 pl-10 pr-10 text-base text-gray-800 dark:text-white bg-transparent border-0 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              autoComplete="off"
            />

            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => {
                const category = searchCategories[result.category];
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className={`w-full px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      index === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <span className="text-xl">{result.icon || category?.icon || '📄'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${category?.color || 'bg-gray-100 text-gray-800'}`}>
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden text-ellipsis line-clamp-2">
                          {result.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="mb-3">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-base font-medium">No results found</p>
              <p className="text-sm mt-1">Try searching for pages, features, or modules</p>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Popular searches</h3>
              <div className="space-y-2">
                {searchService.getPopularSearches().map((result) => {
                  const category = searchCategories[result.category];
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultSelect(result)}
                      className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{result.icon || category?.icon || '📄'}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{result.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts */}
        {results.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">esc</kbd>
                close
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchBar;