"use client";

import { useNavigationLoading } from '@/hooks/useNavigationLoading';

export default function NavigationLoadingProvider() {
  useNavigationLoading();
  return null;
}