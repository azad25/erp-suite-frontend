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
  blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  green: "bg-green-50 border-green-200 hover:bg-green-100",
  yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  purple: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  red: "bg-red-50 border-red-200 hover:bg-red-100",
  indigo: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
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