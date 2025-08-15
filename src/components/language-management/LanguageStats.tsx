'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge/Badge';
import Progress from '@/components/ui/progress/Progress';
import { 
  FileIcon,
  CheckCircleIcon,
  AlertIcon,
  GridIcon
} from '@/icons';

interface LanguageStatsProps {
  totalKeys: number;
  translatedKeys: number;
  languages: Array<{
    code: string;
    name: string;
    completionPercentage: number;
    isActive: boolean;
  }>;
}

export default function LanguageStats({ totalKeys, translatedKeys, languages }: LanguageStatsProps) {
  const overallCompletion = totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;
  const activeLanguages = languages.filter(lang => lang.isActive).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Keys */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Keys</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalKeys}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translated Keys */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Translated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{translatedKeys}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Completion */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overallCompletion}%</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <AlertIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <Progress 
            value={overallCompletion} 
            variant={overallCompletion === 100 ? 'success' : overallCompletion >= 80 ? 'warning' : 'error'}
            size="sm"
          />
        </CardContent>
      </Card>

      {/* Active Languages */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Languages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeLanguages}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <GridIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Progress Details */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Language Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={lang.isActive ? "solid" : "light"} color={lang.isActive ? "success" : "light"}>
                    {lang.code.toUpperCase()}
                  </Badge>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{lang.name}</span>
                </div>
                <div className="flex items-center gap-3 min-w-[200px]">
                  <Progress 
                    value={lang.completionPercentage} 
                    variant={lang.completionPercentage === 100 ? 'success' : lang.completionPercentage >= 80 ? 'warning' : 'error'}
                    size="sm"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[40px] text-right">
                    {lang.completionPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}