import React, { memo } from "react";

interface DashboardLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  icon,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Consistent Header */}
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl">
            <div className="w-8 h-8 text-white">
              {icon}
            </div>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
};

export default memo(DashboardLayout); 