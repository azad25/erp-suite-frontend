/**
 * Authentication Performance Optimizations
 * Reduces login/logout time by optimizing token management, caching, and API calls
 */

import { apiClient } from './api';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/user';

// Token cache for immediate access
let tokenCache: string | null = null;
let userCache: User | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Pre-warm authentication state
export function preWarmAuthState(): void {
    if (typeof window === 'undefined') return;

    try {
        // Load from localStorage immediately
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');

        if (token && token !== 'null' && token !== 'undefined') {
            tokenCache = token;
            cacheTimestamp = Date.now();

            // Set cookie immediately for middleware
            document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }

        if (userStr && userStr !== 'null' && userStr !== 'undefined') {
            try {
                userCache = JSON.parse(userStr);
            } catch {
                localStorage.removeItem('user');
            }
        }
    } catch (error) {
        // Silent error handling
        clearAuthCache();
    }
}

// Fast authentication check using cache
export function isFastAuthenticated(): boolean {
    if (tokenCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return true;
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        return !!(token && token !== 'null' && token !== 'undefined');
    }

    return false;
}

// Get cached user immediately
export function getCachedUser(): User | null {
    if (userCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return userCache;
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'null' && userStr !== 'undefined') {
            try {
                const user = JSON.parse(userStr);
                userCache = user;
                cacheTimestamp = Date.now();
                return user;
            } catch {
                localStorage.removeItem('user');
            }
        }
    }

    return null;
}

// Optimized login with immediate token setting
export async function optimizedLogin(credentials: LoginRequest): Promise<{
    success: boolean;
    data?: AuthResponse;
    message?: string;
    errors?: Record<string, string[]>;
}> {
    try {
        const response = await apiClient.login(credentials);

        if (response.success && response.data) {
            // Cache immediately for fast access
            tokenCache = response.data.access_token;
            userCache = response.data.user;
            cacheTimestamp = Date.now();

            // Set cookie with multiple strategies for immediate availability
            const token = response.data.access_token;
            const cookieValue = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
            document.cookie = cookieValue;

            // Verify cookie was set
            if (!document.cookie.includes('access_token=')) {
                document.cookie = `access_token=${token}; path=/; max-age=86400`;
            }

            return response;
        }

        return response;
    } catch (error) {
        return {
            success: false,
            message: 'Login failed. Please try again.',
        };
    }
}

// Optimized logout with immediate cleanup
export async function optimizedLogout(): Promise<void> {
    // Clear cache immediately
    clearAuthCache();

    // Clear localStorage immediately
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Clear cookies with multiple strategies
        const cookieClears = [
            'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax',
            'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost',
            'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.localhost',
        ];

        cookieClears.forEach(clear => {
            document.cookie = clear;
        });
    }

    // API call in background (don't wait for it)
    apiClient.logout().catch(() => {
        // Silent error handling
    });
}

// Clear authentication cache
export function clearAuthCache(): void {
    tokenCache = null;
    userCache = null;
    cacheTimestamp = 0;
}

// Batch token validation (reduces API calls)
let validationPromise: Promise<boolean> | null = null;
let lastValidation: number = 0;
const VALIDATION_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export async function batchValidateToken(): Promise<boolean> {
    const now = Date.now();

    // Return cached validation if recent
    if (now - lastValidation < VALIDATION_CACHE_DURATION && validationPromise) {
        return validationPromise;
    }

    // Don't validate if no token
    if (!isFastAuthenticated()) {
        return false;
    }

    // Create new validation promise
    validationPromise = (async () => {
        try {
            const response = await apiClient.makeRequest('/api/v1/auth/validate', {
                method: 'GET',
            });

            lastValidation = now;
            return response.success;
        } catch {
            clearAuthCache();
            return false;
        }
    })();

    return validationPromise;
}

// Initialize auth optimizations
export function initAuthOptimizations(): void {
    if (typeof window !== 'undefined') {
        // Pre-warm on page load
        preWarmAuthState();

        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'access_token' || e.key === 'user') {
                if (e.newValue) {
                    preWarmAuthState();
                } else {
                    clearAuthCache();
                }
            }
        });

        // Periodic cache refresh for long sessions
        setInterval(() => {
            if (Date.now() - cacheTimestamp > CACHE_DURATION) {
                preWarmAuthState();
            }
        }, CACHE_DURATION);
    }
}