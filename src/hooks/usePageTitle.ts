"use client";

import { useEffect } from 'react';

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set the document title
      document.title = title.includes('Unibase ERP') ? title : `${title} | Unibase ERP`;
      
      // Update meta description if provided
      if (description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}