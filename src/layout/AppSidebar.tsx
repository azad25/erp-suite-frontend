"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  GridIcon,
  UserIcon,
  DollarLineIcon,
  BoxIcon,
  ListIcon,
  PieChartIcon,
  UserCircleIcon,
  BellIcon,
  ChevronDownIcon,
  TimeIcon,
  ChatIcon,
  MailIcon,
  HorizontaLDots,
  CalenderIcon,
  PageIcon,
  TableIcon,
  PlugInIcon,
  BoxCubeIcon,
} from "@/icons";
import dynamic from "next/dynamic";

// Lazy-load SidebarWidget with loading state
const SidebarWidget = dynamic(() => import("./SidebarWidget"), {
  loading: () => null,
  ssr: false
});

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Move navItems outside component to prevent recreation on every render
const BASE_NAV_ITEMS: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    subItems: [
      { name: "Main Dashboard", path: "/dashboard", pro: false },
      { name: "Widgets", path: "/dashboard/widgets", pro: false },
      { name: "Quick Actions", path: "/dashboard/quick-actions", pro: false },
    ],
  },
  {
    name: "Sales",
    icon: <DollarLineIcon />,
    path: "/sales",
    subItems: [
      { name: "Sales Dashboard", path: "/sales", pro: false },
      { name: "Leads", path: "/sales/leads", pro: false },
      { name: "Opportunities", path: "/sales/opportunities", pro: false },
      { name: "Quotations", path: "/sales/quotations", pro: false },
      { name: "Invoices", path: "/sales/invoices", pro: false },
      { name: "Payments", path: "/sales/payments", pro: false },
      { name: "Reports", path: "/sales/reports", pro: false },
    ],
  },
  {
    name: "Purchases",
    icon: <BoxIcon />,
    path: "/purchases",
    subItems: [
      { name: "Purchases Dashboard", path: "/purchases", pro: false },
      { name: "Suppliers", path: "/purchases/suppliers", pro: false },
      { name: "Purchase Orders", path: "/purchases/orders", pro: false },
      { name: "Bills", path: "/purchases/bills", pro: false },
      { name: "Reports", path: "/purchases/reports", pro: false },
    ],
  },
  {
    name: "Inventory",
    icon: <BoxIcon />,
    path: "/inventory",
    subItems: [
      { name: "Inventory Dashboard", path: "/inventory", pro: false },
      { name: "Products", path: "/inventory/products", pro: false },
      { name: "Warehouses", path: "/inventory/warehouses", pro: false },
      { name: "Stock Levels", path: "/inventory/stock-levels", pro: false },
      { name: "Movements", path: "/inventory/movements", pro: false },
      { name: "Reports", path: "/inventory/reports", pro: false },
    ],
  },
  {
    name: "Projects",
    icon: <ListIcon />,
    path: "/projects",
    subItems: [
      { name: "Projects Dashboard", path: "/projects", pro: false },
      { name: "Tasks", path: "/projects/tasks", pro: false },
      { name: "Time Tracking", path: "/projects/time-tracking", pro: false },
      { name: "Reports", path: "/projects/reports", pro: false },
    ],
  },
  {
    name: "HR Management",
    icon: <UserIcon />,
    path: "/hrm",
    subItems: [
      { name: "HR Dashboard", path: "/hrm", pro: false },
      { name: "Employees", path: "/hrm/employees", pro: false },
      { name: "Attendance", path: "/hrm/attendance", pro: false },
      { name: "Payroll", path: "/hrm/payroll", pro: false },
      { name: "Recruitment", path: "/hrm/recruitment", pro: false },
      { name: "Reports", path: "/hrm/reports", pro: false },
    ],
  },
  {
    name: "Finance",
    icon: <DollarLineIcon />,
    path: "/finance",
    subItems: [
      { name: "Finance Dashboard", path: "/finance", pro: false },
      { name: "Accounts", path: "/finance/accounts", pro: false },
      { name: "Transactions", path: "/finance/transactions", pro: false },
      { name: "Budgeting", path: "/finance/budgeting", pro: false },
      { name: "Reports", path: "/finance/reports", pro: false },
    ],
  },
  {
    name: "CRM",
    icon: <UserCircleIcon />,
    path: "/crm",
    subItems: [
      { name: "CRM Dashboard", path: "/crm", pro: false },
      { name: "Leads", path: "/crm/leads", pro: false },
      { name: "Opportunities", path: "/crm/opportunities", pro: false },
      { name: "Customers", path: "/crm/customers", pro: false },
      { name: "Communication", path: "/crm/communication", pro: false },
      { name: "Feedback & Surveys", path: "/crm/feedback", pro: false },
      { name: "Reports", path: "/crm/reports", pro: false },
    ],
  },
  {
    name: "AI Copilot",
    icon: <PieChartIcon />,
    path: "/ai",
    subItems: [
      { name: "AI Dashboard", path: "/ai", pro: false },
      { name: "Chat Assistant", path: "/ai/chat", pro: false },
      { name: "Insights", path: "/ai/insights", pro: false },
      { name: "Alerts", path: "/ai/alerts", pro: false },
      { name: "Automation", path: "/ai/automation", pro: false },
    ],
  },
  {
    name: "Reports",
    icon: <PieChartIcon />,
    path: "/reports",
    subItems: [
      { name: "Reports Dashboard", path: "/reports", pro: false },
      { name: "Standard", path: "/reports/standard", pro: false },
      { name: "Custom", path: "/reports/custom", pro: false },
      { name: "Scheduled", path: "/reports/scheduled", pro: false },
    ],
  },
  {
    name: "Inbox",
    icon: <MailIcon />,
    path: "/inbox",
    subItems: [
      { name: "Inbox Dashboard", path: "/inbox", pro: false },
      { name: "Conversations", path: "/inbox/conversations", pro: false },
      { name: "Attachments", path: "/inbox/attachments", pro: false },
      { name: "Discussions", path: "/inbox/discussions", pro: false },
      { name: "Filters & Labels", path: "/inbox/filters", pro: false },
    ],
  },
  {
    name: "Documents",
    icon: <BoxIcon />,
    path: "/documents",
  },
  {
    name: "Personal Use",
    icon: <UserIcon />,
    path: "/personal",
    subItems: [
      { name: "Personal Dashboard", path: "/personal", pro: false },
      { name: "Personal Finance", path: "/personal/finance", pro: false },
      { name: "To-do & Reminders", path: "/personal/todos", pro: false },
      { name: "Document Storage", path: "/personal/documents", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "User Management",
    subItems: [
      { name: "All Users", path: "/users", pro: false },
      // Only show Organizations menu for app admins
      { name: "Organizations", path: "/users/organizations", pro: false },
      { name: "Roles & Permissions", path: "/users/roles", pro: false },
      { name: "Activity Logs", path: "/users/activity", pro: false },
    ],
  },
  {
    name: "Subscriptions",
    icon: <DollarLineIcon />,
    subItems: [
      { name: "Plans", path: "/subscriptions/plans", pro: false },
      { name: "Billing", path: "/subscriptions/billing", pro: false },
      { name: "Usage", path: "/subscriptions/usage", pro: false },
    ],
  },
  {
    name: "Settings",
    icon: <BoxIcon />,
    subItems: [
      { name: "System Settings", path: "/settings/system", pro: false },
      { name: "Language Management", path: "/settings/languages", pro: false },
      { name: "Integrations", path: "/settings/integrations", pro: false },
      { name: "Data Import/Export", path: "/settings/data", pro: false },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Charts",
    icon: <PieChartIcon />,
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

// Memoized menu item component to prevent unnecessary re-renders
const MenuItem = memo(({ 
  nav, 
  index, 
  menuType, 
  isActive, 
  isExpanded, 
  isHovered, 
  isMobileOpen, 
  openSubmenu, 
  handleSubmenuToggle,
  subMenuRefs,
  subMenuHeight
}: any) => (
  <li>
    {nav.subItems ? (
      <>
        <div className={`flex items-center ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}>
          {nav.path ? (
            <Link
              href={nav.path}
              prefetch={process.env.NODE_ENV === 'production'}
              className={`menu-item group flex-1 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          ) : (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group flex-1 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer`}
            >
              <span className={`${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </button>
          )}
          {(isExpanded || isHovered || isMobileOpen) && (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1"
            >
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 text-gray-500 dark:text-gray-400 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                }`}
              />
            </button>
          )}
        </div>
        {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
          <div
            ref={(el) => {
              if (subMenuRefs.current) {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }
            }}
            className="overflow-hidden transition-all duration-300"
            style={{
              height:
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                  : "0px",
            }}
          >
            <ul className="mt-2 space-y-1 ml-9">
              {nav.subItems.map((subItem: any) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.path}
                    prefetch={process.env.NODE_ENV === 'production'}
                    className={`menu-dropdown-item ${
                      isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                    <span className="flex items-center gap-1 ml-auto">
                      {subItem.new && (
                        <span
                          className={`ml-auto ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          new
                        </span>
                      )}
                      {subItem.pro && (
                        <span
                          className={`ml-auto ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          pro
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    ) : (
      nav.path && (
        <Link
          href={nav.path}
          prefetch={process.env.NODE_ENV === 'production'}
          className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
        >
          <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
            {nav.icon}
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="menu-item-text">{nav.name}</span>
          )}
        </Link>
      )
    )}
  </li>
));

MenuItem.displayName = 'MenuItem';

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { isAppAdmin } = useUserRole();

  // Use static navItems - no need for dynamic generation based on role for now
  const navItems = useMemo(() => BASE_NAV_ITEMS, []);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Determine which submenu (if any) should be open for current path
    let next: { type: "main" | "others"; index: number } | null = null;

    for (const menuType of ["main", "others"] as const) {
      const items = menuType === "main" ? navItems : othersItems;
      for (let index = 0; index < items.length; index++) {
        const nav = items[index];
        if (!nav.subItems) continue;
        for (const subItem of nav.subItems) {
          if (subItem.path === pathname) {
            next = { type: menuType, index };
            break;
          }
        }
        if (next) break;
      }
      if (next) break;
    }

    // Update state only if it actually changed
    setOpenSubmenu((prev) => {
      if (!next) {
        return prev === null ? prev : null;
      }
      if (prev && prev.type === next.type && prev.index === next.index) {
        return prev;
      }
      return next;
    });
  }, [pathname, navItems]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Memoized render function to prevent unnecessary re-renders
  const renderMenuItems = useCallback((
    items: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <MenuItem
          key={nav.name}
          nav={nav}
          index={index}
          menuType={menuType}
          isActive={isActive}
          isExpanded={isExpanded}
          isHovered={isHovered}
          isMobileOpen={isMobileOpen}
          openSubmenu={openSubmenu}
          handleSubmenuToggle={handleSubmenuToggle}
          subMenuRefs={subMenuRefs}
          subMenuHeight={subMenuHeight}
        />
      ))}
    </ul>
  ), [isActive, isExpanded, isHovered, isMobileOpen, openSubmenu, handleSubmenuToggle, subMenuHeight]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className={`py-4 flex justify-center`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default memo(AppSidebar);
