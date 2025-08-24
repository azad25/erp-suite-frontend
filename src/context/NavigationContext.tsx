"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

interface NavigationContextType {
  isFromAppDrawer: boolean;
  setFromAppDrawer: (value: boolean) => void;
  isAppDrawerOverlayOpen: boolean;
  setAppDrawerOverlayOpen: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isFromAppDrawer, setIsFromAppDrawer] = useState(false);
  const [isAppDrawerOverlayOpen, setIsAppDrawerOverlayOpen] = useState(false);
  const pathname = usePathname();
  const { isExpanded, toggleSidebar } = useSidebar();

  const setFromAppDrawer = (value: boolean) => {
    setIsFromAppDrawer(value);
    if (value && isExpanded) {
      // Collapse sidebar when navigating from app drawer
      toggleSidebar();
    }
  };

  // Ensure sidebar is collapsed on app drawer page and when navigating from app drawer
  useEffect(() => {
    if (pathname === '/app-drawer') {
      setIsFromAppDrawer(false);
      // Always ensure sidebar is collapsed on app drawer page
      if (isExpanded) {
        toggleSidebar();
      }
    } else if (isFromAppDrawer && isExpanded) {
      // Collapse sidebar when navigating from app drawer to any other page
      toggleSidebar();
    }
  }, [pathname, isExpanded, toggleSidebar, isFromAppDrawer]);

  // Close overlay when navigating to different pages
  useEffect(() => {
    if (pathname !== '/app-drawer') {
      setIsAppDrawerOverlayOpen(false);
    }
  }, [pathname]);

  return (
    <NavigationContext.Provider
      value={{
        isFromAppDrawer,
        setFromAppDrawer,
        isAppDrawerOverlayOpen,
        setAppDrawerOverlayOpen: setIsAppDrawerOverlayOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}