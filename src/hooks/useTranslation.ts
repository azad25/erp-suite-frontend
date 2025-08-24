"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useMemo } from 'react';

export const useTranslation = () => {
  const { language, messages, setLanguage, isRTL, isChangingLanguage } = useLanguage();

  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      const keys = key.split('.');
      let value = messages;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.log(`Translation key not found: ${key}, using fallback: ${fallback || key}`);
          return fallback || key;
        }
      }
      
      return typeof value === 'string' ? value : fallback || key;
    };
  }, [messages]);

  const formatMessage = (key: string, values?: Record<string, string | number>) => {
    let message = t(key);
    
    if (values) {
      Object.entries(values).forEach(([placeholder, value]) => {
        message = message.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
      });
    }
    
    return message;
  };

  return {
    t,
    formatMessage,
    language,
    setLanguage,
    isRTL,
    messages,
    isChangingLanguage,
  };
};