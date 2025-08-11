"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SitePreloader } from './SitePreloader';

export const SitePreloaderWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SitePreloader 
      isAuthenticated={isAuthenticated} 
      showProgress={true} 
    />
  );
};