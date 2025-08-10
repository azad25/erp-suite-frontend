"use client";

import React from "react";
import Link from "next/link";
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
  HorizontaLDots,
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
    icon: <GridIcon className="w-5 h-5" />,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: <DollarLineIcon className="w-5 h-5" />,
    children: [
      { title: "Leads", href: "/sales/leads", icon: <UserIcon className="w-4 h-4" /> },
      { title: "Opportunities", href: "/sales/opportunities", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Quotations", href: "/sales/quotations", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Invoices", href: "/sales/invoices", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Payments", href: "/sales/payments", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/sales/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Purchases",
    href: "/purchases",
    icon: <BoxIcon className="w-5 h-5" />,
    children: [
      { title: "Suppliers", href: "/purchases/suppliers", icon: <UserIcon className="w-4 h-4" /> },
      { title: "Purchase Orders", href: "/purchases/orders", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Bills", href: "/purchases/bills", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/purchases/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <BoxIcon className="w-5 h-5" />,
    children: [
      { title: "Products", href: "/inventory/products", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Warehouses", href: "/inventory/warehouses", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Stock Levels", href: "/inventory/stock-levels", icon: <PieChartIcon className="w-4 h-4" /> },
      { title: "Movements", href: "/inventory/movements", icon: <ListIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/inventory/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Projects",
    href: "/projects",
    icon: <ListIcon className="w-5 h-5" />,
    children: [
      { title: "Tasks", href: "/projects/tasks", icon: <ListIcon className="w-4 h-4" /> },
      { title: "Time Tracking", href: "/projects/time-tracking", icon: <TimeIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/projects/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "HR Management",
    href: "/hrm",
    icon: <UserIcon className="w-5 h-5" />,
    children: [
      { title: "Employees", href: "/hrm/employees", icon: <UserIcon className="w-4 h-4" /> },
      { title: "Attendance", href: "/hrm/attendance", icon: <ListIcon className="w-4 h-4" /> },
      { title: "Payroll", href: "/hrm/payroll", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Recruitment", href: "/hrm/recruitment", icon: <UserIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/hrm/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Finance",
    href: "/finance",
    icon: <DollarLineIcon className="w-5 h-5" />,
    children: [
      { title: "Accounts", href: "/finance/accounts", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Transactions", href: "/finance/transactions", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Budgeting", href: "/finance/budgeting", icon: <ListIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/finance/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "CRM",
    href: "/crm",
    icon: <UserCircleIcon className="w-5 h-5" />,
    children: [
      { title: "Leads", href: "/crm/leads", icon: <UserIcon className="w-4 h-4" /> },
      { title: "Customers", href: "/crm/customers", icon: <UserIcon className="w-4 h-4" /> },
      { title: "Opportunities", href: "/crm/opportunities", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "Communication", href: "/crm/communication", icon: <ChatIcon className="w-4 h-4" /> },
      { title: "Feedback & Surveys", href: "/crm/feedback", icon: <PieChartIcon className="w-4 h-4" /> },
      { title: "Reports", href: "/crm/reports", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "AI Copilot",
    href: "/ai",
    icon: <PieChartIcon className="w-5 h-5" />,
    children: [
      { title: "Chat Assistant", href: "/ai/chat", icon: <ChatIcon className="w-4 h-4" /> },
      { title: "Insights", href: "/ai/insights", icon: <PieChartIcon className="w-4 h-4" /> },
      { title: "Alerts", href: "/ai/alerts", icon: <BellIcon className="w-4 h-4" /> },
      { title: "Automation", href: "/ai/automation", icon: <ListIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <PieChartIcon className="w-5 h-5" />,
    children: [
      { title: "Standard", href: "/reports/standard", icon: <PieChartIcon className="w-4 h-4" /> },
      { title: "Custom", href: "/reports/custom", icon: <PieChartIcon className="w-4 h-4" /> },
      { title: "Scheduled", href: "/reports/scheduled", icon: <PieChartIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: <MailIcon className="w-5 h-5" />,
    children: [
      { title: "Conversations", href: "/inbox/conversations", icon: <ChatIcon className="w-4 h-4" /> },
      { title: "Attachments", href: "/inbox/attachments", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Discussions", href: "/inbox/discussions", icon: <ListIcon className="w-4 h-4" /> },
      { title: "Filters & Labels", href: "/inbox/filters", icon: <ListIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "Documents",
    href: "/documents",
    icon: <BoxIcon className="w-5 h-5" />,
  },
  {
    title: "Personal Use",
    href: "/personal",
    icon: <UserIcon className="w-5 h-5" />,
    children: [
      { title: "Personal Finance", href: "/personal/finance", icon: <DollarLineIcon className="w-4 h-4" /> },
      { title: "To-do & Reminders", href: "/personal/todos", icon: <ListIcon className="w-4 h-4" /> },
      { title: "Document Storage", href: "/personal/documents", icon: <BoxIcon className="w-4 h-4" /> },
    ],
  },
  {
    title: "User Management",
    href: "/users",
    icon: <UserIcon className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <BoxIcon className="w-5 h-5" />,
    children: [
      { title: "System Settings", href: "/settings/system", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Integrations", href: "/settings/integrations", icon: <BoxIcon className="w-4 h-4" /> },
      { title: "Data Import/Export", href: "/settings/data", icon: <BoxIcon className="w-4 h-4" /> },
    ],
  },
];

export default function AppSidebar() {
  const { isExpanded, isHovered, isMobileOpen, setIsHovered, toggleMobileSidebar, openSubmenu, toggleSubmenu } = useSidebar();
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
        <Link
          href={item.href}
          className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isItemActive
              ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
              : "text-gray-700 dark:text-gray-300"
          } ${level > 0 ? "ml-6" : ""} ${showLabels ? "" : "justify-center"}`}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleSubmenu(item.href);
            }
          }}
        >
          <div className="flex-shrink-0 min-w-[20px] flex items-center justify-center">{item.icon}</div>
          {showLabels && <span className="flex-1">{item.title}</span>}
          {hasChildren && showLabels && (
            <div
              className={`w-4 h-4 transition-transform ${
                isMenuOpen ? "rotate-90" : ""
              }`}
            >
              <ChevronUpIcon className="w-4 h-4" />
            </div>
          )}
        </Link>

        {hasChildren && isMenuOpen && (
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
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-200 ease-in-out lg:static lg:inset-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-[290px] ${isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            {(isMobileOpen || isExpanded || isHovered) && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">Unibase ERP</span>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-visible` }>
            {sidebarItems.map((item) => renderSidebarItem(item))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              {(isMobileOpen || isExpanded || isHovered) && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@unibase.com</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <BellIcon className="w-4 h-4" />
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
