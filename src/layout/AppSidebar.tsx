"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { useSidebar } from "@/context/SidebarContext";
import {
  GridIcon,
  UserIcon,
  DollarLineIcon,
  BoxIcon,
  ListIcon,
  PieChartIcon,
  UserCircleIcon,
  BellIcon,
  ChevronUpIcon,
  TimeIcon,
  ChatIcon,
  MailIcon,
} from "@/icons";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <GridIcon />,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: <DollarLineIcon />,
    children: [
      { title: "Leads", href: "/sales/leads", icon: <UserIcon /> },
      { title: "Opportunities", href: "/sales/opportunities", icon: <DollarLineIcon /> },
      { title: "Quotations", href: "/sales/quotations", icon: <BoxIcon /> },
      { title: "Invoices", href: "/sales/invoices", icon: <DollarLineIcon /> },
      { title: "Payments", href: "/sales/payments", icon: <DollarLineIcon /> },
      { title: "Reports", href: "/sales/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "Purchases",
    href: "/purchases",
    icon: <BoxIcon />,
    children: [
      { title: "Suppliers", href: "/purchases/suppliers", icon: <UserIcon /> },
      { title: "Purchase Orders", href: "/purchases/orders", icon: <BoxIcon /> },
      { title: "Bills", href: "/purchases/bills", icon: <DollarLineIcon /> },
      { title: "Reports", href: "/purchases/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <BoxIcon />,
    children: [
      { title: "Products", href: "/inventory/products", icon: <BoxIcon /> },
      { title: "Warehouses", href: "/inventory/warehouses", icon: <BoxIcon /> },
      { title: "Stock Levels", href: "/inventory/stock-levels", icon: <PieChartIcon /> },
      { title: "Movements", href: "/inventory/movements", icon: <ListIcon /> },
      { title: "Reports", href: "/inventory/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "Projects",
    href: "/projects",
    icon: <ListIcon />,
    children: [
      { title: "Tasks", href: "/projects/tasks", icon: <ListIcon /> },
      { title: "Time Tracking", href: "/projects/time-tracking", icon: <TimeIcon /> },
      { title: "Reports", href: "/projects/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "HR Management",
    href: "/hrm",
    icon: <UserIcon />,
    children: [
      { title: "Employees", href: "/hrm/employees", icon: <UserIcon /> },
      { title: "Attendance", href: "/hrm/attendance", icon: <ListIcon /> },
      { title: "Payroll", href: "/hrm/payroll", icon: <DollarLineIcon /> },
      { title: "Recruitment", href: "/hrm/recruitment", icon: <UserIcon /> },
      { title: "Reports", href: "/hrm/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "Finance",
    href: "/finance",
    icon: <DollarLineIcon />,
    children: [
      { title: "Accounts", href: "/finance/accounts", icon: <BoxIcon /> },
      { title: "Transactions", href: "/finance/transactions", icon: <DollarLineIcon /> },
      { title: "Budgeting", href: "/finance/budgeting", icon: <ListIcon /> },
      { title: "Reports", href: "/finance/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "CRM",
    href: "/crm",
    icon: <UserCircleIcon />,
    children: [
      { title: "Leads", href: "/crm/leads", icon: <UserIcon /> },
      { title: "Opportunities", href: "/crm/opportunities", icon: <DollarLineIcon /> },
      { title: "Customers", href: "/crm/customers", icon: <UserIcon /> },
      { title: "Communication", href: "/crm/communication", icon: <ChatIcon /> },
      { title: "Feedback & Surveys", href: "/crm/feedback", icon: <PieChartIcon /> },
      { title: "Reports", href: "/crm/reports", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "AI Copilot",
    href: "/ai",
    icon: <PieChartIcon />,
    children: [
      { title: "Chat Assistant", href: "/ai/chat", icon: <ChatIcon /> },
      { title: "Insights", href: "/ai/insights", icon: <PieChartIcon /> },
      { title: "Alerts", href: "/ai/alerts", icon: <BellIcon /> },
      { title: "Automation", href: "/ai/automation", icon: <ListIcon /> },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <PieChartIcon />,
    children: [
      { title: "Standard", href: "/reports/standard", icon: <PieChartIcon /> },
      { title: "Custom", href: "/reports/custom", icon: <PieChartIcon /> },
      { title: "Scheduled", href: "/reports/scheduled", icon: <PieChartIcon /> },
    ],
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: <MailIcon />,
    children: [
      { title: "Conversations", href: "/inbox/conversations", icon: <ChatIcon /> },
      { title: "Attachments", href: "/inbox/attachments", icon: <BoxIcon /> },
      { title: "Discussions", href: "/inbox/discussions", icon: <ListIcon /> },
      { title: "Filters & Labels", href: "/inbox/filters", icon: <ListIcon /> },
    ],
  },
  {
    title: "Documents",
    href: "/documents",
    icon: <BoxIcon />,
  },
  {
    title: "Personal Use",
    href: "/personal",
    icon: <UserIcon />,
    children: [
      { title: "Personal Finance", href: "/personal/finance", icon: <DollarLineIcon /> },
      { title: "To-do & Reminders", href: "/personal/todos", icon: <ListIcon /> },
      { title: "Document Storage", href: "/personal/documents", icon: <BoxIcon /> },
    ],
  },
  {
    title: "User Management",
    href: "/users",
    icon: <UserIcon />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <BoxIcon />,
    children: [
      { title: "System Settings", href: "/settings/system", icon: <BoxIcon /> },
      { title: "Integrations", href: "/settings/integrations", icon: <BoxIcon /> },
      { title: "Data Import/Export", href: "/settings/data", icon: <BoxIcon /> },
    ],
  },
];

export default function AppSidebar() {
  const { isExpanded, isHovered, isMobileOpen, setIsHovered, openSubmenu, toggleSubmenu } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item.href);
    const isMenuOpen = openSubmenu === item.href;
    const showLabels = isMobileOpen || isExpanded || isHovered;

    return (
      <div key={item.href}>
        <div className={`flex items-center ${showLabels ? "gap-0" : "justify-center"}`}>
          <Link
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${isItemActive
              ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
              : "text-gray-700 dark:text-gray-300"
              } ${level > 0 ? "ml-6" : ""} ${showLabels ? "flex-1" : "w-12 h-12 justify-center"
              }`}
            title={!showLabels ? item.title : undefined}
          >
            <div className={`flex-shrink-0 flex items-center justify-center ${showLabels ? "w-5 h-5" : "w-6 h-6"
              }`}>
              <div className={`${showLabels ? "w-5 h-5" : "w-6 h-6"} flex items-center justify-center`}>
                {item.icon}
              </div>
            </div>
            {showLabels && <span className="flex-1 truncate">{item.title}</span>}
          </Link>
          {hasChildren && showLabels && (
            <button
              onClick={() => toggleSubmenu(item.href)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${level > 0 ? "mr-6" : ""
                }`}
            >
              <div
                className={`w-4 h-4 transition-transform duration-200 text-gray-500 dark:text-gray-400 ${isMenuOpen ? "rotate-180" : ""
                  }`}
              >
                <ChevronUpIcon />
              </div>
            </button>
          )}
        </div>

        {hasChildren && isMenuOpen && showLabels && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-200 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 ${isExpanded || isHovered ? "w-[290px]" : "w-[290px] lg:w-[90px]"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center gap-3 py-4 border-b border-gray-200 dark:border-gray-800 ${(isMobileOpen || isExpanded || isHovered) ? "px-6" : "px-3 justify-center"}`}>
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Image
                  width={32}
                  height={32}
                  className="dark:hidden"
                  src="/images/logo/logo.svg"
                  alt="UniBase Logo"
                />
                <Image
                  width={32}
                  height={32}
                  className="hidden dark:block"
                  src="/images/logo/logo-dark.svg"
                  alt="UniBase Logo"
                />
              </div>
              {(isMobileOpen || isExpanded || isHovered) && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">UniBase</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">ERP Suite</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-visible ${(isMobileOpen || isExpanded || isHovered) ? "px-2" : "px-1"}`}>
            {sidebarItems.map((item) => renderSidebarItem(item))}
          </nav>

          {/* User section */}
          <div className={`border-t border-gray-200 dark:border-gray-800 ${(isMobileOpen || isExpanded || isHovered) ? "p-4" : "p-2"}`}>
            <div className={`flex items-center rounded-lg bg-gray-50 dark:bg-gray-800 ${(isMobileOpen || isExpanded || isHovered) ? "gap-3 p-3" : "p-2 justify-center"}`}>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 text-gray-600 dark:text-gray-400">
                  <UserIcon />
                </div>
              </div>
              {(isMobileOpen || isExpanded || isHovered) && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@unibase.com</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <div className="w-4 h-4">
                      <BellIcon />
                    </div>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile is handled by Backdrop component */}
    </>
  );
}
