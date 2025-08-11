import React, { memo } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple" | "red" | "indigo";
  className?: string;
}

const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  red: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  indigo: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
};

export const StatsCard: React.FC<StatsCardProps> = memo(({
  title,
  value,
  icon,
  color,
  className = "",
}) => {
  return (
    <div className={`p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <div className="w-5 h-5">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-white/90">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
});

export default StatsCard; 