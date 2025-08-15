import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Performance optimizations for auth middleware
const ROUTE_CACHE_SIZE = 100;

// Fast token extraction with fallback
function getFastToken(request: NextRequest): string | null {
  // Try cookie first (fastest)
  const cookieToken = request.cookies.get('access_token')?.value;
  if (cookieToken && cookieToken !== 'undefined' && cookieToken !== 'null') {
    return cookieToken;
  }
  
  // Fallback to Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  return null;
}

// Check if token is expired based on token_data cookie
function isTokenExpired(request: NextRequest): boolean {
  const tokenDataCookie = request.cookies.get('token_data')?.value;
  if (!tokenDataCookie) return true;

  try {
    const tokenData = JSON.parse(tokenDataCookie);
    const now = Date.now() / 1000; // Current time in seconds
    const expiresAt = tokenData.issued_at + tokenData.expires_in;
    const bufferTime = 5 * 60; // 5 minutes buffer

    return (expiresAt - bufferTime) <= now;
  } catch (error) {
    return true; // If we can't parse, consider expired
  }
}

// Use Sets for O(1) lookup performance instead of arrays
const protectedRoutes = new Set([
  '/',
  '/dashboard',
  '/sales',
  '/purchases',
  '/inventory',
  '/projects',
  '/hrm',
  '/finance',
  '/crm',
  '/ai',
  '/reports',
  '/inbox',
  '/documents',
  '/personal',
  '/users',
  '/settings',
  '/profile',
  '/calendar',
  '/form-elements',
  '/basic-tables',
  '/line-chart',
  '/bar-chart',
  '/alerts',
  '/avatars',
  '/badge',
  '/buttons',
  '/images',
  '/videos',
  '/modals',
  '/blank',
  '/subscriptions',
  '/test-api',
  '/config-example',
]);

const publicRoutes = new Set([
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/error-404',
]);

// Cache for route matching to avoid repeated string operations
const routeCache = new Map<string, { isProtected: boolean; isPublic: boolean }>();

// LRU cache implementation for route matching
function addToCache(key: string, value: { isProtected: boolean; isPublic: boolean }) {
  if (routeCache.size >= ROUTE_CACHE_SIZE) {
    const firstKey = routeCache.keys().next().value;
    if (firstKey) {
      routeCache.delete(firstKey);
    }
  }
  routeCache.set(key, value);
}

function getRouteType(pathname: string): { isProtected: boolean; isPublic: boolean } {
  // Check cache first
  if (routeCache.has(pathname)) {
    return routeCache.get(pathname)!;
  }

  // Fast exact match first
  const isProtected = protectedRoutes.has(pathname);
  const isPublic = publicRoutes.has(pathname);

  if (isProtected || isPublic) {
    const result = { isProtected, isPublic };
    routeCache.set(pathname, result);
    return result;
  }

  // Check for sub-routes only if exact match fails
  let isProtectedSubRoute = false;
  let isPublicSubRoute = false;

  for (const route of protectedRoutes) {
    if (pathname.startsWith(route + '/')) {
      isProtectedSubRoute = true;
      break;
    }
  }

  if (!isProtectedSubRoute) {
    for (const route of publicRoutes) {
      if (pathname.startsWith(route + '/')) {
        isPublicSubRoute = true;
        break;
      }
    }
  }

  const result = { 
    isProtected: isProtectedSubRoute, 
    isPublic: isPublicSubRoute 
  };
  
  // Cache the result
  routeCache.set(pathname, result);
  return result;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets and API routes for better performance
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  const { isProtected, isPublic } = getRouteType(pathname);

  // Early return if neither protected nor public
  if (!isProtected && !isPublic) {
    return NextResponse.next();
  }

  // Fast token check - check cookie first as it's faster
  const token = getFastToken(request);

  if (isProtected) {
    // Check if token exists and is not expired
    if (!token || isTokenExpired(request)) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      
      // Clear expired token cookies
      const response = NextResponse.redirect(signInUrl);
      response.cookies.delete('access_token');
      response.cookies.delete('token_data');
      
      return response;
    }
  }

  if (isPublic && token && !isTokenExpired(request) && (pathname === '/signin' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};