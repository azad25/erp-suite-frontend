'use client';

import React from 'react';
import Button from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge/Badge';
import { 
  PlusIcon,
  DownloadIcon,
  FileIcon,
  CheckCircleIcon,
  AlertIcon
} from '@/icons';

interface LanguageQuickActionsProps {
  onAddKey: () => void;
  onImportKeys: () => void;
  onExportAll: () => void;
  onValidateTranslations: () => void;
  stats: {
    totalKeys: number;
    translatedKeys: number;
    missingTranslations: number;
    recentlyModified: number;
  };
}

export default function LanguageQuickActions({ 
  onAddKey, 
  onImportKeys, 
  onExportAll, 
  onValidateTranslations,
  stats 
}: LanguageQuickActionsProps) {
  const completionPercentage = stats.totalKeys > 0 
    ? Math.round((stats.translatedKeys / stats.totalKeys) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalKeys}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Total Keys</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completionPercentage}%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Complete</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.missingTranslations}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Missing</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.recentlyModified}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Modified</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={onAddKey}
            className="flex items-center justify-center gap-2 h-12"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Key
          </Button>
          
          <Button 
            onClick={onImportKeys}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12"
          >
            <FileIcon className="h-4 w-4" />
            Import Keys
          </Button>
          
          <Button 
            onClick={onExportAll}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12"
          >
            <DownloadIcon className="h-4 w-4" />
            Export All
          </Button>
          
          <Button 
            onClick={onValidateTranslations}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Validate
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Badge variant="light" color="success" size="sm">
            {stats.translatedKeys} Translated
          </Badge>
          {stats.missingTranslations > 0 && (
            <Badge variant="light" color="warning" size="sm">
              {stats.missingTranslations} Missing
            </Badge>
          )}
          {stats.recentlyModified > 0 && (
            <Badge variant="light" color="info" size="sm">
              {stats.recentlyModified} Recent Changes
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}