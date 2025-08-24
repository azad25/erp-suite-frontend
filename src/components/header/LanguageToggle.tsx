"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language, LANGUAGE_CONFIG } from '@/context/LanguageContext';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@/icons';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, isChangingLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (newLanguage: Language) => {
    if (newLanguage === language || isChangingLanguage) return;
    console.log(`Switching language from ${language} to ${newLanguage}`);
    await setLanguage(newLanguage);
    setIsOpen(false);
  };

  const currentLanguageConfig = LANGUAGE_CONFIG[language];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg",
          "hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
          "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
          isOpen && "bg-gray-100 dark:bg-gray-800"
        )}
        aria-label={`Change Language - Current: ${currentLanguageConfig.name}`}
        title={`Change Language - Current: ${currentLanguageConfig.name}`}
      >
        <div className="flex items-center space-x-1">
          <span className="text-lg" role="img" aria-label={currentLanguageConfig.name}>
            {currentLanguageConfig.flag}
          </span>
          <span className="text-xs font-medium uppercase text-gray-600 dark:text-gray-400">
            {language}
          </span>
          <ChevronDownIcon className="w-3 h-3" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg",
          "z-50 py-1 animate-in fade-in-0 zoom-in-95",
          isChangingLanguage && "opacity-60 pointer-events-none"
        )}>
          {Object.entries(LANGUAGE_CONFIG).map(([langCode, config]) => (
            <button
              key={langCode}
              onClick={() => handleLanguageChange(langCode as Language)}
              disabled={isChangingLanguage}
              className={cn(
                "flex items-center w-full px-4 py-2 text-left",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-colors duration-200",
                "disabled:cursor-not-allowed",
                language === langCode && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              )}
            >
              <span className="text-lg mr-3" role="img" aria-label={config.name}>
                {config.flag}
              </span>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {config.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {langCode}
                </span>
              </div>
              {language === langCode && !isChangingLanguage && (
                <svg className="ml-auto w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isChangingLanguage && language === langCode && (
                <div className="ml-auto w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;