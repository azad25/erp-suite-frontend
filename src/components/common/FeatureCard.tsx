import React from "react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: "blue" | "green" | "yellow" | "purple" | "red" | "indigo";
  stats?: string;
  className?: string;
}

const colorClasses = {
  blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30",
  green: "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30",
  yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
  purple: "bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/30",
  red: "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30",
  indigo: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:hover:bg-indigo-900/30",
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  path,
  color,
  stats,
  className = "",
}) => {
  return (
    <Link
      href={path}
      className={`block p-6 rounded-xl border-2 transition-all duration-200 ${colorClasses[color]} hover:shadow-lg hover:scale-105 ${className}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-8 h-8 text-gray-700 dark:text-gray-300">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
          {stats && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {stats}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard; 