"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppDrawerIcon, ChevronLeftIcon } from "@/icons";

interface BreadcrumbItem {
  name: string;
  path: string;
}

const routeMap: Record<string, BreadcrumbItem> = {
  "/dashboard": { name: "Dashboard", path: "/dashboard" },
  "/sales": { name: "Sales", path: "/sales" },
  "/purchases": { name: "Purchases", path: "/purchases" },
  "/inventory": { name: "Inventory", path: "/inventory" },
  "/projects": { name: "Projects", path: "/projects" },
  "/hrm": { name: "HR Management", path: "/hrm" },
  "/finance": { name: "Finance", path: "/finance" },
  "/crm": { name: "CRM", path: "/crm" },
  "/ai": { name: "AI Copilot", path: "/ai" },
  "/reports": { name: "Reports", path: "/reports" },
  "/inbox": { name: "Inbox", path: "/inbox" },
  "/documents": { name: "Documents", path: "/documents" },
  "/personal": { name: "Personal Use", path: "/personal" },
  "/users": { name: "User Management", path: "/users" },
  "/settings": { name: "Settings", path: "/settings" },
  "/subscriptions": { name: "Subscriptions", path: "/subscriptions" },
  "/calendar": { name: "Calendar", path: "/calendar" },
};

export default function AppDrawerBreadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumb on app drawer page itself
  if (pathname === "/app-drawer") {
    return null;
  }

  // Find the main route
  const mainRoute = Object.keys(routeMap).find(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  if (!mainRoute) {
    return null;
  }

  const currentApp = routeMap[mainRoute];

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <Link
        href="/app-drawer"
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <AppDrawerIcon className="w-4 h-4" />
        <span>App Drawer</span>
      </Link>
      
      <ChevronLeftIcon className="w-4 h-4 text-gray-400 rotate-180" />
      
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {currentApp.name}
      </span>
      
      {pathname !== mainRoute && (
        <>
          <ChevronLeftIcon className="w-4 h-4 text-gray-400 rotate-180" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {pathname.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </>
      )}
    </div>
  );
}