"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigation } from "@/context/NavigationContext";
import { useFrequentlyVisited } from "@/hooks/useFrequentlyVisited";
import {
    BarChartIcon,
    CalenderUIIcon,
    ClockUIIcon,
    TodoUIIcon,
    GlobeUIIcon,
    ContactsUIIcon,
    CrmUIIcon,
    SalesUIIcon,
    BookUIIcon,
    InventoryUIIcon,
    TasksUIIcon,
    HrmUIIcon,
    FinanceUIIcon,
    AccountingUIIcon,
    DocumentUIIcon,
    CopilotUIIcon,
    ReportUIIcon,
    InboxUIIcon,
    CustomerUIIcon,
    OrgUIIcon,
    DocUIIcon,
    SettingsUIIcon,
} from "@/icons";

interface AppItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    color?: string;
}

const appItems: AppItem[] = [
    {
        name: "Dashboard",
        icon: <BarChartIcon />,
        path: "/dashboard",
        color: "bg-orange-500",
    },
    {
        name: "Calendar",
        icon: <CalenderUIIcon />,
        path: "/calendar",
        color: "bg-purple-500",
    },
    {
        name: "Appointments",
        icon: <ClockUIIcon />,
        path: "/calendar",
        color: "bg-teal-500",
    },
    {
        name: "To-do",
        icon: <TodoUIIcon />,
        path: "/personal/todos",
        color: "bg-blue-500",
    },
    {
        name: "Knowledge",
        icon: <GlobeUIIcon />,
        path: "/documents",
        color: "bg-green-600",
    },
    {
        name: "Contacts",
        icon: <ContactsUIIcon />,
        path: "/crm/customers",
        color: "bg-teal-600",
    },
    {
        name: "CRM",
        icon: <CrmUIIcon />,
        path: "/crm",
        color: "bg-emerald-500",
    },
    {
        name: "Sales",
        icon: <SalesUIIcon />,
        path: "/sales",
        color: "bg-orange-600",
    },
    {
        name: "Purchases",
        icon: <BookUIIcon />,
        path: "/dashboard",
        color: "bg-pink-500",
    },
    {
        name: "Inventory",
        icon: <InventoryUIIcon />,
        path: "/inventory",
        color: "bg-blue-600",
    },
    {
        name: "Projects",
        icon: <TasksUIIcon />,
        path: "/projects",
        color: "bg-purple-600",
    },
    {
        name: "HRM",
        icon: <HrmUIIcon />,
        path: "/hrm",
        color: "bg-indigo-500",
    },
    {
        name: "Finance",
        icon: <FinanceUIIcon />,
        path: "/finance",
        color: "bg-red-500",
    },
    {
        name: "Accounts",
        icon: <AccountingUIIcon />,
        path: "/accounts",
        color: "bg-yellow-500",
    },
    {
        name: "Documents",
        icon: <DocumentUIIcon />,
        path: "/documents",
        color: "bg-blue-500",
    },
    {
        name: "AI Copilot",
        icon: <CopilotUIIcon />,
        path: "/ai",
        color: "bg-green-500",
    },
    {
        name: "Reports",
        icon: <ReportUIIcon />,
        path: "/reports",
        color: "bg-indigo-600",
    },
    {
        name: "Inbox",
        icon: <InboxUIIcon />,
        path: "/inbox",
        color: "bg-red-600",
    },
    {
        name: "Customers",
        icon: <CustomerUIIcon />,
        path: "/crm/customers",
        color: "bg-orange-500",
    },
    {
        name: "Organizations",
        icon: <OrgUIIcon />,
        path: "/users/organizations",
        color: "bg-teal-500",
    },
    {
        name: "Subscriptions",
        icon: <DocUIIcon />,
        path: "subscriptions/usage",
        color: "bg-cyan-500",
    },
    {
        name: "Settings",
        icon: <SettingsUIIcon />,
        path: "/settings/system",
        color: "bg-blue-500",
    },
];

export default function AppDrawer() {
    const router = useRouter();
    const { setFromAppDrawer } = useNavigation();
    const [isNavigating, setIsNavigating] = useState(false);
    const { frequentlyVisited, trackAppUsage } = useFrequentlyVisited(appItems);

    usePageTitle("App Drawer", "Choose an application to get started");

    const handleAppClick = (path: string, e: React.MouseEvent) => {
        e.preventDefault();
        trackAppUsage(path);
        setIsNavigating(true);
        setFromAppDrawer(true);
        router.push(path);
        setTimeout(() => setIsNavigating(false), 300);
    };

    // Debugging: Log frequentlyVisited to check its state
    // useEffect(() => {
    //     console.log("AppDrawer frequentlyVisited:", frequentlyVisited);
    // }, [frequentlyVisited]);

    return (
        <>
            <div className="h-screen flex flex-col overflow-hidden">
                {/* Header Section - Fixed height */}
                <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-2">
                    <div className="text-center">
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome to Unibase ERP
                        </h1>
                        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
                            Choose an application to get started with your business operations
                        </p>
                    </div>

                    {/* Frequently Visited Section */}
                    {frequentlyVisited.length > 0 && (
                        <div className="mt-3">
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">
                                Frequently Visited
                            </h2>
                            <div className="flex justify-center gap-3 flex-wrap">
                                {frequentlyVisited.map((app, index) => (
                                    <button
                                        key={`frequent-${index}`}
                                        onClick={(e) => handleAppClick(app.path, e)}
                                        className="group flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 p-2 min-w-16 relative"
                                    >
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">★</span>
                                        </div>
                                        <div className="flex-shrink-0 mb-1">{app.icon}</div>
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                                            {app.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* App Grid - Takes remaining space */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-2 min-h-0">
                    <div className="w-full max-w-4xl">
                        <div className="grid grid-cols-6 gap-0">
                            {appItems.map((app, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => handleAppClick(app.path, e)}
                                    className="group flex flex-col items-center justify-center rounded-md hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-all duration-200 border-gray-300 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-600 border aspect-square p-1 m-2"
                                    style={{
                                        animationDelay: `${index * 10}ms`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <div className="flex-shrink-0">{app.icon}</div>
                                    <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight px-1 mt-0.5">
                                        {app.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {isNavigating && (
                <div className="fixed top-0 left-0 right-0 z-[60]">
                    <div className="h-1 bg-gray-200 dark:bg-gray-700">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
                    </div>
                </div>
            )}
        </>
    );
}