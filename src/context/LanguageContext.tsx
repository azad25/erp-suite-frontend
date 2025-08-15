"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Language types
export type Language = 'en' | 'bn';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  messages: Record<string, any>;
  isRTL: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language configurations
const LANGUAGE_CONFIG = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isRTL: false,
    locale: 'en-US'
  },
  bn: {
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    isRTL: false,
    locale: 'bn-BD'
  }
};

// Storage key
const LANGUAGE_STORAGE_KEY = 'erp-language';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load messages for the current language
  const loadMessages = async (lang: Language) => {
    try {
      console.log(`Loading messages for language: ${lang}`);
      const messagesModule = await import(`../locales/${lang}.json`);
      console.log(`Loaded messages for ${lang}:`, messagesModule.default);
      setMessages(messagesModule.default);
    } catch (error) {
      console.error(`Failed to load messages for language: ${lang}`, error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        try {
          const fallbackModule = await import('../locales/en.json');
          setMessages(fallbackModule.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback English messages:', fallbackError);
          setMessages({});
        }
      }
    }
  };

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const initializeLanguage = async () => {
      let initialLanguage: Language = 'en';

      // Try to get from localStorage first
      if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
        if (storedLanguage && ['en', 'bn'].includes(storedLanguage)) {
          initialLanguage = storedLanguage;
        } else {
          // Check browser language preference
          const browserLanguage = navigator.language.toLowerCase();
          if (browserLanguage.startsWith('bn')) {
            initialLanguage = 'bn';
          }
        }
      }

      setLanguageState(initialLanguage);
      await loadMessages(initialLanguage);
      setIsLoading(false);
    };

    initializeLanguage();
  }, []);

  // Update language and persist to localStorage
  const setLanguage = async (lang: Language) => {
    setIsLoading(true);
    setLanguageState(lang);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
    
    await loadMessages(lang);
    setIsLoading(false);

    // Update document direction and language
    if (typeof document !== 'undefined') {
      document.documentElement.lang = LANGUAGE_CONFIG[lang].locale;
      document.documentElement.dir = LANGUAGE_CONFIG[lang].isRTL ? 'rtl' : 'ltr';
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    messages,
    isRTL: LANGUAGE_CONFIG[language].isRTL,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export language configurations for use in components
export { LANGUAGE_CONFIG };