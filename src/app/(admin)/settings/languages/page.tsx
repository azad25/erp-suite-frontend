'use client';

import React, { useState } from 'react';
import Badge from '@/components/ui/badge/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileIcon,
  DocsIcon,
  GridIcon,
  DownloadIcon
} from '@/icons';
import LanguageKeyManager from '@/components/language-management/LanguageKeyManager';
import LanguageFileManager from '@/components/language-management/LanguageFileManager';
import LanguageImportExport from '@/components/language-management/LanguageImportExport';
import LanguageDemo from '@/components/language-management/LanguageDemo';
import LanguageSettings from '@/components/language-management/LanguageSettings';

export default function LanguageManagementPage() {
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Language Management</h1>
          <p className="text-muted-foreground">
            Manage translation keys, values, and language files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="light" className="flex items-center gap-1">
            <GridIcon className="h-3 w-3" />
            2 Languages
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <GridIcon className="h-4 w-4" />
            Live Demo
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <FileIcon className="h-4 w-4" />
            Translation Keys
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <DocsIcon className="h-4 w-4" />
            Language Files
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            Import/Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <LanguageSettings />
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <LanguageDemo />
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <LanguageKeyManager />
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <LanguageFileManager />
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <LanguageImportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}