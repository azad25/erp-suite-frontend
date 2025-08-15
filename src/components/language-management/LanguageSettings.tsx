'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, Language, LANGUAGE_CONFIG } from '@/context/LanguageContext';
import { CheckCircleIcon } from '@/icons';
import { cn } from '@/utils/cn';

export default function LanguageSettings() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = async (newLanguage: Language) => {
    console.log(`Switching language from ${language} to ${newLanguage}`);
    await setLanguage(newLanguage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Language Settings
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred language for the application interface
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(LANGUAGE_CONFIG).map(([langCode, config]) => (
            <button
              key={langCode}
              onClick={() => handleLanguageChange(langCode as Language)}
              className={cn(
                "flex items-center w-full p-4 text-left border rounded-lg",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                "transition-all duration-200",
                language === langCode 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              )}
            >
              <span className="text-2xl mr-4" role="img" aria-label={config.name}>
                {config.flag}
              </span>
              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">
                  {config.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                  {langCode} - {config.nativeName}
                </span>
              </div>
              {language === langCode && (
                <CheckCircleIcon className="ml-auto w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Language Change Information
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Changing the language will update all interface text immediately. 
                Your language preference is saved automatically and will persist across sessions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}