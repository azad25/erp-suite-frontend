'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Badge from '@/components/ui/badge/Badge';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/common/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// Simple toast implementation
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`${variant === 'destructive' ? 'Error' : 'Success'}: ${title} - ${description}`);
    // In a real app, this would show a proper toast notification
  }
});

interface LanguageFile {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  keyCount: number;
  translatedCount: number;
  lastModified: string;
  size: string;
  isActive: boolean;
}

interface EditableLanguageField {
  id: string;
  field: 'name' | 'nativeName';
}

export default function LanguageFileManager() {
  const { toast } = useToast();
  const [languageFiles, setLanguageFiles] = useState<LanguageFile[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<EditableLanguageField | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newLanguage, setNewLanguage] = useState({
    code: '',
    name: '',
    nativeName: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguageFiles();
  }, []);

  const loadLanguageFiles = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const mockFiles: LanguageFile[] = [
        {
          id: 'lang-1',
          code: 'en',
          name: 'English',
          nativeName: 'English',
          keyCount: 156,
          translatedCount: 156,
          lastModified: '2024-01-15T10:30:00Z',
          size: '12.5 KB',
          isActive: true,
        },
        {
          id: 'lang-2',
          code: 'bn',
          name: 'Bengali',
          nativeName: 'বাংলা',
          keyCount: 156,
          translatedCount: 142,
          lastModified: '2024-01-14T15:45:00Z',
          size: '15.2 KB',
          isActive: true,
        },
      ];
      
      setLanguageFiles(mockFiles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load language files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle inline editing
  const handleFieldClick = (id: string, field: 'name' | 'nativeName', currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue);
  };

  const handleFieldSave = async () => {
    if (!editingField) return;

    try {
      setLanguageFiles(prev => 
        prev.map(lang => 
          lang.id === editingField.id 
            ? { 
                ...lang, 
                [editingField.field]: editValue,
                lastModified: new Date().toISOString()
              }
            : lang
        )
      );
      
      toast({
        title: "Success",
        description: "Language updated successfully",
      });
      
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language",
        variant: "destructive",
      });
    }
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.code || !newLanguage.name || !newLanguage.nativeName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const newFile: LanguageFile = {
        id: `lang-${Date.now()}`,
        ...newLanguage,
        keyCount: 0,
        translatedCount: 0,
        lastModified: new Date().toISOString(),
        size: '0 KB',
        isActive: true,
      };

      setLanguageFiles(prev => [...prev, newFile]);
      
      toast({
        title: "Success",
        description: "Language file created successfully",
      });
      
      setIsAddDialogOpen(false);
      setNewLanguage({ code: '', name: '', nativeName: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create language file",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLanguage = async (item: LanguageFile) => {
    if (item.code === 'en') {
      toast({
        title: "Error",
        description: "Cannot delete the default English language",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this language file? This action cannot be undone.')) return;

    try {
      setLanguageFiles(prev => prev.filter(lang => lang.id !== item.id));
      
      toast({
        title: "Success",
        description: "Language file deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete language file",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (item: LanguageFile) => {
    try {
      setLanguageFiles(prev => 
        prev.map(lang => 
          lang.id === item.id 
            ? { ...lang, isActive: !lang.isActive, lastModified: new Date().toISOString() }
            : lang
        )
      );
      
      toast({
        title: "Success",
        description: "Language status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language status",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = (item: LanguageFile) => {
    // In a real app, this would download the actual file
    toast({
      title: "Download Started",
      description: `Downloading ${item.code}.json file`,
    });
  };

  const getCompletionPercentage = (translated: number, total: number) => {
    return total > 0 ? Math.round((translated / total) * 100) : 0;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'success';
    if (percentage >= 80) return 'warning';
    return 'error';
  };

  // DataTable columns configuration
  const columns: DataTableColumn<LanguageFile>[] = [
    {
      key: 'language',
      header: 'Language',
      width: 'w-1/4',
      render: (item) => (
        <div className="space-y-2">
          <div 
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
            onClick={() => handleFieldClick(item.id, 'name', item.name)}
          >
            {editingField?.id === item.id && editingField?.field === 'name' ? (
              <div className="space-y-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFieldSave();
                    } else if (e.key === 'Escape') {
                      handleFieldCancel();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleFieldSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={handleFieldCancel}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
            )}
          </div>
          
          <div 
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
            onClick={() => handleFieldClick(item.id, 'nativeName', item.nativeName)}
          >
            {editingField?.id === item.id && editingField?.field === 'nativeName' ? (
              <div className="space-y-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFieldSave();
                    } else if (e.key === 'Escape') {
                      handleFieldCancel();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleFieldSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={handleFieldCancel}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">{item.nativeName}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      width: 'w-20',
      render: (item) => (
        <Badge variant="light" className="font-mono">
          {item.code}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-24',
      render: (item) => (
        <Badge variant={item.isActive ? "solid" : "light"} color={item.isActive ? "success" : "light"}>
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: 'progress',
      header: 'Translation Progress',
      width: 'w-1/3',
      render: (item) => {
        const completionPercentage = getCompletionPercentage(item.translatedCount, item.keyCount);
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    completionPercentage === 100 ? 'bg-green-500' :
                    completionPercentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${
                completionPercentage === 100 ? 'text-green-600' :
                completionPercentage >= 80 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {completionPercentage}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {item.translatedCount} / {item.keyCount} keys
            </div>
          </div>
        );
      },
    },
    {
      key: 'size',
      header: 'File Size',
      width: 'w-20',
      render: (item) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">{item.size}</div>
      ),
    },
    {
      key: 'lastModified',
      header: 'Last Modified',
      width: 'w-32',
      render: (item) => (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div>{new Date(item.lastModified).toLocaleDateString()}</div>
          <div>{new Date(item.lastModified).toLocaleTimeString()}</div>
        </div>
      ),
      sortable: true,
    },
  ];

  // DataTable actions
  const actions: DataTableAction<LanguageFile>[] = [
    {
      key: 'download',
      label: 'Download',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: handleDownloadFile,
      variant: 'ghost',
    },
    {
      key: 'toggle',
      label: 'Toggle Status',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: handleToggleActive,
      variant: 'ghost',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: handleDeleteLanguage,
      variant: 'ghost',
      color: 'error',
      disabled: (item) => item.code === 'en',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Language Files Management
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click on language names to edit inline. Manage language files and their properties.
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Language
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* DataTable */}
      <DataTable
        data={languageFiles}
        columns={columns}
        actions={actions}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search languages..."
        searchKeys={['name', 'nativeName', 'code']}
        emptyMessage="No language files found"
        sortable={true}
      />

      {/* Add Language Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription>
              Create a new language file for translations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Language Code</label>
              <Input
                value={newLanguage.code}
                onChange={(e) => setNewLanguage(prev => ({ ...prev, code: e.target.value.toLowerCase() }))}
                placeholder="e.g., fr, es, de"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use ISO 639-1 language codes (2 letters)
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Language Name (English)</label>
              <Input
                value={newLanguage.name}
                onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., French, Spanish, German"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Native Name</label>
              <Input
                value={newLanguage.nativeName}
                onChange={(e) => setNewLanguage(prev => ({ ...prev, nativeName: e.target.value }))}
                placeholder="e.g., Français, Español, Deutsch"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLanguage}>
              Create Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}