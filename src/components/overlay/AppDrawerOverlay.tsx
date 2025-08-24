"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";
import {
    GridIcon,
    CalenderIcon,
    UserIcon,
    PencilIcon,
    DocsIcon,
    UserCircleIcon,
    DollarLineIcon,
    PieChartIcon,
    BoxIcon,
    ListIcon,
    TimeIcon,
    TaskIcon,
    FileIcon,
    CopyIcon,
    GroupIcon,
    LockIcon,
    ArrowRightIcon,
    EnvelopeIcon,
    CreditCardIcon,
    ReceiptIcon,
    TruckIcon,
    MessageIcon,
    UpdateIcon,
    FileTextIcon,
} from "@/icons";

interface AppItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    color: string;
}

const appItems: AppItem[] = [
    {
        name: "Dashboard",
        icon: <GridIcon className="w-8 h-8" />,
        path: "/dashboard",
        color: "bg-orange-500",
    },
    {
        name: "Calendar",
        icon: <CalenderIcon className="w-8 h-8" />,
        path: "/calendar",
        color: "bg-purple-500",
    },
    {
        name: "Appointments",
        icon: <TimeIcon className="w-8 h-8" />,
        path: "/calendar",
        color: "bg-teal-500",
    },
    {
        name: "To-do",
        icon: <TaskIcon className="w-8 h-8" />,
        path: "/personal/todos",
        color: "bg-blue-500",
    },
    {
        name: "Knowledge",
        icon: <DocsIcon className="w-8 h-8" />,
        path: "/documents",
        color: "bg-green-600",
    },
    {
        name: "Contacts",
        icon: <UserCircleIcon className="w-8 h-8" />,
        path: "/crm/customers",
        color: "bg-teal-600",
    },
    {
        name: "CRM",
        icon: <UserIcon className="w-8 h-8" />,
        path: "/crm",
        color: "bg-emerald-500",
    },
    {
        name: "Sales",
        icon: <DollarLineIcon className="w-8 h-8" />,
        path: "/sales",
        color: "bg-orange-600",
    },
    {
        name: "Dashboards",
        icon: <PieChartIcon className="w-8 h-8" />,
        path: "/dashboard",
        color: "bg-pink-500",
    },
    {
        name: "Subscriptions",
        icon: <CreditCardIcon className="w-8 h-8" />,
        path: "/subscriptions/plans",
        color: "bg-blue-600",
    },
    {
        name: "Rental",
        icon: <TruckIcon className="w-8 h-8" />,
        path: "/inventory",
        color: "bg-purple-600",
    },
    {
        name: "Point of Sale",
        icon: <ReceiptIcon className="w-8 h-8" />,
        path: "/sales/invoices",
        color: "bg-indigo-500",
    },
    {
        name: "Kitchen Display",
        icon: <BoxIcon className="w-8 h-8" />,
        path: "/inventory/products",
        color: "bg-red-500",
    },
    {
        name: "Accounting",
        icon: <FileTextIcon className="w-8 h-8" />,
        path: "/finance",
        color: "bg-yellow-500",
    },
    {
        name: "Documents",
        icon: <FileIcon className="w-8 h-8" />,
        path: "/documents",
        color: "bg-blue-500",
    },
    {
        name: "Project",
        icon: <ListIcon className="w-8 h-8" />,
        path: "/projects",
        color: "bg-green-500",
    },
    {
        name: "Timesheets",
        icon: <TimeIcon className="w-8 h-8" />,
        path: "/projects/time-tracking",
        color: "bg-indigo-600",
    },
    {
        name: "Field Service",
        icon: <ArrowRightIcon className="w-8 h-8" />,
        path: "/projects/tasks",
        color: "bg-red-600",
    },
    {
        name: "Planning",
        icon: <CalenderIcon className="w-8 h-8" />,
        path: "/projects",
        color: "bg-orange-500",
    },
    {
        name: "Helpdesk",
        icon: <MessageIcon className="w-8 h-8" />,
        path: "/inbox",
        color: "bg-teal-500",
    },
    {
        name: "Website",
        icon: <GridIcon className="w-8 h-8" />,
        path: "/dashboard",
        color: "bg-cyan-500",
    },
    {
        name: "Email Marketing",
        icon: <EnvelopeIcon className="w-8 h-8" />,
        path: "/crm/communication",
        color: "bg-blue-500",
    },
    {
        name: "Events",
        icon: <CalenderIcon className="w-8 h-8" />,
        path: "/calendar",
        color: "bg-orange-600",
    },
    {
        name: "Purchase",
        icon: <BoxIcon className="w-8 h-8" />,
        path: "/purchases",
        color: "bg-purple-500",
    },
    {
        name: "Inventory",
        icon: <BoxIcon className="w-8 h-8" />,
        path: "/inventory",
        color: "bg-red-500",
    },
    {
        name: "Manufacturing",
        icon: <UpdateIcon className="w-8 h-8" />,
        path: "/inventory/products",
        color: "bg-teal-600",
    },
    {
        name: "Shop Floor",
        icon: <GridIcon className="w-8 h-8" />,
        path: "/inventory/warehouses",
        color: "bg-blue-600",
    },
    {
        name: "Barcode",
        icon: <CopyIcon className="w-8 h-8" />,
        path: "/inventory/products",
        color: "bg-gray-600",
    },
    {
        name: "Sign",
        icon: <PencilIcon className="w-8 h-8" />,
        path: "/documents",
        color: "bg-cyan-600",
    },
    {
        name: "Employees",
        icon: <GroupIcon className="w-8 h-8" />,
        path: "/hrm/employees",
        color: "bg-pink-600",
    },
    {
        name: "Recruitment",
        icon: <UserIcon className="w-8 h-8" />,
        path: "/hrm/recruitment",
        color: "bg-green-600",
    },
    {
        name: "Time Off",
        icon: <TimeIcon className="w-8 h-8" />,
        path: "/hrm/attendance",
        color: "bg-yellow-600",
    },
    {
        name: "Expenses",
        icon: <DollarLineIcon className="w-8 h-8" />,
        path: "/finance/transactions",
        color: "bg-blue-500",
    },
    {
        name: "Apps",
        icon: <GridIcon className="w-8 h-8" />,
        path: "/app-drawer",
        color: "bg-indigo-500",
    },
    {
        name: "Settings",
        icon: <LockIcon className="w-8 h-8" />,
        path: "/settings",
        color: "bg-orange-500",
    },
];

interface AppDrawerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AppDrawerOverlay({ isOpen, onClose }: AppDrawerOverlayProps) {
    const router = useRouter();
    const { setFromAppDrawer } = useNavigation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            // Prevent body scroll when overlay is open
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable body scroll when overlay is closed
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleAppClick = (path: string, e: React.MouseEvent) => {
        e.preventDefault();
        
        // Show progress bar briefly for visual feedback
        setIsNavigating(true);
        
        // Set navigation state to collapse sidebar on destination page
        setFromAppDrawer(true);
        
        // Close overlay and navigate immediately
        onClose();
        router.push(path);
        
        // Reset navigation state after a short delay
        setTimeout(() => setIsNavigating(false), 300);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] transition-all duration-300 ease-out ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Content */}
            <div className={`relative h-full overflow-y-auto transition-transform duration-300 ease-out ${
                isAnimating ? 'translate-y-0' : 'translate-y-4'
            }`}>
                <div className="min-h-full bg-white dark:bg-gray-900">
                    {/* Close Button */}
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                            aria-label="Close App Drawer"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-600 dark:text-gray-400"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Header Section */}
                    <div className="mb-8 pt-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Welcome to Your ERP Suite
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Choose an application to get started with your business operations
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* App Grid - 6x6 layout */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="grid grid-cols-6 gap-4 md:gap-6">
                            {appItems.map((app, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => handleAppClick(app.path, e)}
                                    className="group flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 animate-fade-in"
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <div
                                        className={`${app.color} p-3 sm:p-4 rounded-2xl mb-3 text-white group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                                    >
                                        <div className="w-6 h-6 sm:w-8 sm:h-8">
                                            {app.icon}
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                                        {app.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pb-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click on any application to access its features and functionality
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {isNavigating && (
                <div className="absolute top-0 left-0 right-0 z-10">
                    <div className="h-1 bg-gray-200 dark:bg-gray-700">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress-bar"></div>
                    </div>
                </div>
            )}
        </div>
    );
}