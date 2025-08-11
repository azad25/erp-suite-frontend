import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Optimized className utility with memoization
const cache = new Map<string, string>();

export function cn(...inputs: ClassValue[]): string {
  const key = JSON.stringify(inputs);
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = twMerge(clsx(inputs));
  
  // Limit cache size to prevent memory leaks
  if (cache.size > 1000) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) {
      cache.delete(firstKey);
    }
  }
  
  cache.set(key, result);
  return result;
}
