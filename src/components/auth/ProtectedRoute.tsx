"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode, memo } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Use Next.js router for navigation
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Show minimal loading state - avoid heavy animations
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect immediately
  if (!user) {
    return null; // Don't render anything, just redirect
  }

  return <>{children}</>;
}

// Memoize to prevent unnecessary re-renders
export default memo(ProtectedRoute);