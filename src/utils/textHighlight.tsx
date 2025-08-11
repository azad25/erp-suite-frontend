import React from 'react';

/**
 * Highlights matching text in a string by wrapping matches in bold tags
 * @param text - The text to highlight
 * @param query - The search query to highlight
 * @returns JSX element with highlighted text
 */
export const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) {
    return text;
  }

  const queryWords = query.toLowerCase().trim().split(' ').filter(word => word.length > 0);
  let highlightedText = text;
  
  // Create a regex pattern that matches any of the query words (case insensitive)
  const pattern = queryWords.map(word => 
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
  ).join('|');
  
  if (!pattern) {
    return text;
  }

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = highlightedText.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = queryWords.some(word => 
          part.toLowerCase() === word.toLowerCase()
        );
        
        return isMatch ? (
          <span key={index} className="font-bold text-gray-900 dark:text-white">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
};

/**
 * Alternative highlighting function that uses background highlighting
 * @param text - The text to highlight
 * @param query - The search query to highlight
 * @returns JSX element with highlighted text
 */
export const highlightTextWithBackground = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) {
    return text;
  }

  const queryWords = query.toLowerCase().trim().split(' ').filter(word => word.length > 0);
  let highlightedText = text;
  
  const pattern = queryWords.map(word => 
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ).join('|');
  
  if (!pattern) {
    return text;
  }

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = highlightedText.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = queryWords.some(word => 
          part.toLowerCase() === word.toLowerCase()
        );
        
        return isMatch ? (
          <span 
            key={index} 
            className="font-bold bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-white px-0.5 rounded"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
};