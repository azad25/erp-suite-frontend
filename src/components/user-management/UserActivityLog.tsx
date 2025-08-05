"use client";
import React, { useState } from "react";
import Badge from "../ui/badge/Badge";

interface ActivityLog {
  id: string;
  action: string;
  resource: string;
  description: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  status: "success" | "failed" | "warning";
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    action: "login",
    resource: "authentication",
    description: "User logged in successfully",
    timestamp: "2024-01-15T10:30:00Z",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "2",
    action: "update_profile",
    resource: "user",
    description: "Updated personal information",
    timestamp: "2024-01-15T09:15:00Z",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "3",
    action: "failed_login",
    resource: "authentication",
    description: "Failed login attempt - invalid password",
    timestamp: "2024-01-14T18:45:00Z",
    ip_address: "192.168.1.105",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "failed"
  },
  {
    id: "4",
    action: "password_change",
    resource: "security",
    description: "Password changed successfully",
    timestamp: "2024-01-14T16:20:00Z",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success"
  },
  {
    id: "5",
    action: "permission_denied",
    resource: "user_management",
    description: "Attempted to access restricted resource",
    timestamp: "2024-01-14T14:10:00Z",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "warning"
  }
];

interface UserActivityLogProps {
  userId?: string;
  limit?: number;
}

export default function UserActivityLog({ userId, limit = 10 }: UserActivityLogProps) {
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs.slice(0, limit));
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusBadge = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge color="success" size="sm">Success</Badge>;
      case 'failed':
        return <Badge color="error" size="sm">Failed</Badge>;
      case 'warning':
        return <Badge color="warning" size="sm">Warning</Badge>;
      default:
        return <Badge color="light" size="sm">Unknown</Badge>;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'failed_login':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'update_profile':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'password_change':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
          Activity Log
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Recent user activities and system interactions
        </p>
      </div>

      <div className="border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="p-5 lg:p-6">
          <div className="space-y-4">
            {activityLogs.map((log) => {
              const { date, time } = formatTimestamp(log.timestamp);
              
              return (
                <div 
                  key={log.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setSelectedLog(log)}
                >
                  {getActionIcon(log.action)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {log.description}
                      </p>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{date} at {time}</span>
                      <span>•</span>
                      <span>{log.ip_address}</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">
                        {log.resource}
                      </span>
                    </div>
                  </div>

                  <button className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {activityLogs.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No activity logs found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-2xl dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Activity Details
              </h4>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Action</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {selectedLog.description}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                {getStatusBadge(selectedLog.status)}
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {formatTimestamp(selectedLog.timestamp).date} at {formatTimestamp(selectedLog.timestamp).time}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IP Address</p>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {selectedLog.ip_address}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User Agent</p>
                <p className="text-sm text-gray-800 dark:text-white/90 break-all">
                  {selectedLog.user_agent}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resource</p>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {selectedLog.resource}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}