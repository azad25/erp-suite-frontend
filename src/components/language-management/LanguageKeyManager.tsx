'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import { Textarea } from '@/components/ui/textarea';
import Badge from '@/components/ui/badge/Badge';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/common/DataTable';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
// Simple toast implementation
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`${variant === 'destructive' ? 'Error' : 'Success'}: ${title} - ${description}`);
    // In a real app, this would show a proper toast notification
  }
});

interface TranslationKey {
  id: string;
  key: string;
  category: string;
  en: string;
  bn: string;
  isNew?: boolean;
  isModified?: boolean;
  lastModified?: string;
}

interface EditableCell {
  id: string;
  field: 'en' | 'bn';
}

export default function LanguageKeyManager() {
  const { toast } = useToast();
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([]);
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState({
    key: '',
    en: '',
    bn: '',
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingKey, setEditingKey] = useState<TranslationKey | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load language files and flatten them
  useEffect(() => {
    loadLanguageData();
  }, []);

  const loadLanguageData = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const enData = await import('@/locales/en.json');
      const bnData = await import('@/locales/bn.json');
      
      const keys = flattenObject(enData.default);
      const translationData: TranslationKey[] = Object.keys(keys).map((key, index) => ({
        id: `key-${index}`,
        key,
        category: key.split('.')[0],
        en: keys[key] || '',
        bn: getNestedValue(bnData.default, key) || '',
        lastModified: new Date().toISOString(),
      }));

      setTranslationKeys(translationData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load language data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const flattenObject = (obj: any, prefix = ''): { [key: string]: string } => {
    const flattened: { [key: string]: string } = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(translationKeys.map(k => k.category)));
    return cats.sort();
  }, [translationKeys]);

  const filteredKeys = useMemo(() => {
    if (selectedCategory === 'all') return translationKeys;
    return translationKeys.filter(key => key.category === selectedCategory);
  }, [translationKeys, selectedCategory]);

  // Pagination logic
  const totalItems = filteredKeys.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedKeys = filteredKeys.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Handle inline editing
  const handleCellClick = (id: string, field: 'en' | 'bn', currentValue: string) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const handleCellSave = async () => {
    if (!editingCell) return;

    try {
      setTranslationKeys(prev => 
        prev.map(key => 
          key.id === editingCell.id 
            ? { 
                ...key, 
                [editingCell.field]: editValue,
                isModified: true,
                lastModified: new Date().toISOString()
              }
            : key
        )
      );

      // In a real app, this would save to the backend
      await saveToFiles();
      
      toast({
        title: "Success",
        description: "Translation updated successfully",
      });
      
      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update translation",
        variant: "destructive",
      });
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleAddKey = async () => {
    if (!newKey.key || !newKey.en) {
      toast({
        title: "Error",
        description: "Key and English translation are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const translationKey: TranslationKey = {
        id: `key-${Date.now()}`,
        key: newKey.key,
        category: newKey.key.split('.')[0],
        en: newKey.en,
        bn: newKey.bn,
        isNew: true,
        lastModified: new Date().toISOString(),
      };

      setTranslationKeys(prev => [...prev, translationKey]);
      await saveToFiles();
      
      toast({
        title: "Success",
        description: "Translation key added successfully",
      });
      
      closeAddModal();
      setNewKey({ key: '', en: '', bn: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add translation key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (item: TranslationKey) => {
    if (!confirm('Are you sure you want to delete this translation key?')) return;

    try {
      setTranslationKeys(prev => prev.filter(k => k.id !== item.id));
      await saveToFiles();
      
      toast({
        title: "Success",
        description: "Translation key deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete translation key",
        variant: "destructive",
      });
    }
  };

  const saveToFiles = async () => {
    // In a real implementation, this would make API calls to save the files
    console.log('Saving translation files...');
  };

  // DataTable columns configuration
  const columns: DataTableColumn<TranslationKey>[] = [
    {
      key: 'key',
      header: 'Translation Key',
      width: 'w-1/4',
      render: (item) => (
        <div className="space-y-1">
          <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
            {item.key}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="light" size="sm">
              {item.category}
            </Badge>
            {item.isNew && <Badge variant="light" color="success" size="sm">New</Badge>}
            {item.isModified && <Badge variant="light" color="warning" size="sm">Modified</Badge>}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'en',
      header: 'English',
      width: 'w-1/3',
      render: (item) => (
        <div 
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded min-h-[2.5rem] flex items-center"
          onClick={() => handleCellClick(item.id, 'en', item.en)}
        >
          {editingCell?.id === item.id && editingCell?.field === 'en' ? (
            <div className="w-full space-y-2">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full text-sm"
                rows={2}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleCellSave();
                  } else if (e.key === 'Escape') {
                    handleCellCancel();
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleCellSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCellCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-900 dark:text-gray-100 truncate w-full" title={item.en}>
              {item.en || <span className="text-gray-400 italic">Click to add translation</span>}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'bn',
      header: 'Bengali',
      width: 'w-1/3',
      render: (item) => (
        <div 
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded min-h-[2.5rem] flex items-center"
          onClick={() => handleCellClick(item.id, 'bn', item.bn)}
        >
          {editingCell?.id === item.id && editingCell?.field === 'bn' ? (
            <div className="w-full space-y-2">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full text-sm"
                rows={2}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleCellSave();
                  } else if (e.key === 'Escape') {
                    handleCellCancel();
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleCellSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCellCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-900 dark:text-gray-100 truncate w-full" title={item.bn}>
              {item.bn || <span className="text-gray-400 italic">Click to add translation</span>}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'lastModified',
      header: 'Last Modified',
      width: 'w-32',
      render: (item) => (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(item.lastModified || '').toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
  ];

  // Handle bulk operations
  const handleBulkDelete = async (items: TranslationKey[]) => {
    if (!confirm(`Are you sure you want to delete ${items.length} translation keys?`)) return;

    try {
      const idsToDelete = items.map(item => item.id);
      setTranslationKeys(prev => prev.filter(k => !idsToDelete.includes(k.id)));
      await saveToFiles();
      
      toast({
        title: "Success",
        description: `${items.length} translation keys deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete translation keys",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = (items: TranslationKey[]) => {
    const exportData = items.reduce((acc, item) => {
      acc[item.key] = {
        en: item.en,
        bn: item.bn,
        category: item.category,
        lastModified: item.lastModified
      };
      return acc;
    }, {} as any);

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-keys-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Exported ${items.length} translation keys`,
    });
  };

  // DataTable actions
  const actions: DataTableAction<TranslationKey>[] = [
    {
      key: 'edit',
      label: 'Quick Edit',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: (item) => {
        setEditingKey(item);
        openEditModal();
      },
      variant: 'ghost',
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      onClick: (item) => {
        const duplicatedKey = {
          ...item,
          id: `key-${Date.now()}`,
          key: `${item.key}_copy`,
          isNew: true,
          lastModified: new Date().toISOString(),
        };
        setTranslationKeys(prev => [...prev, duplicatedKey]);
        toast({
          title: "Success",
          description: "Translation key duplicated successfully",
        });
      },
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
      onClick: handleDeleteKey,
      variant: 'ghost',
      color: 'error',
    },
  ];

  // Bulk actions for selected items
  const bulkActions: DataTableAction<TranslationKey[]>[] = [
    {
      key: 'export',
      label: 'Export Selected',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: handleBulkExport,
      variant: 'outline',
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: handleBulkDelete,
      variant: 'outline',
      color: 'error',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Translation Keys Management
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click on any translation cell to edit inline. Use Ctrl+Enter to save, Escape to cancel.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Button onClick={openAddModal}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Key
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* DataTable */}
      <DataTable
        data={paginatedKeys}
        columns={columns}
        actions={actions}
        bulkActions={bulkActions}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search keys, English or Bengali text..."
        searchKeys={['key', 'en', 'bn']}
        emptyMessage="No translation keys found"
        sortable={true}
        selectable={true}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: handlePageChange,
        }}
      />

      {/* Add Key Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} className="max-w-2xl p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Translation Key</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a new translation key with values for both languages
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Translation Key</label>
              <Input
                value={newKey.key}
                onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                placeholder="e.g., common.newButton"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use dot notation for nested keys (e.g., category.subcategory.key)
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">English Translation</label>
              <Textarea
                value={newKey.en}
                onChange={(e) => setNewKey(prev => ({ ...prev, en: e.target.value }))}
                placeholder="Enter English translation"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Bengali Translation</label>
              <Textarea
                value={newKey.bn}
                onChange={(e) => setNewKey(prev => ({ ...prev, bn: e.target.value }))}
                placeholder="Enter Bengali translation"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={closeAddModal}>
              Cancel
            </Button>
            <Button onClick={handleAddKey}>
              Add Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Key Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="max-w-2xl p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Translation Key</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update the translations for this key
            </p>
          </div>
          
          {editingKey && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Translation Key</label>
                <Input
                  value={editingKey.key}
                  disabled
                  className="font-mono bg-gray-50 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Key cannot be changed after creation
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">English Translation</label>
                <Textarea
                  value={editingKey.en}
                  onChange={(e) => setEditingKey(prev => prev ? { ...prev, en: e.target.value } : null)}
                  placeholder="Enter English translation"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Bengali Translation</label>
                <Textarea
                  value={editingKey.bn}
                  onChange={(e) => setEditingKey(prev => prev ? { ...prev, bn: e.target.value } : null)}
                  placeholder="Enter Bengali translation"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Category: {editingKey.category}</span>
                <span>•</span>
                <span>Last modified: {new Date(editingKey.lastModified || '').toLocaleDateString()}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (!editingKey) return;
              
              try {
                setTranslationKeys(prev => 
                  prev.map(key => 
                    key.id === editingKey.id 
                      ? { 
                          ...editingKey,
                          isModified: true,
                          lastModified: new Date().toISOString()
                        }
                      : key
                  )
                );

                await saveToFiles();
                
                toast({
                  title: "Success",
                  description: "Translation key updated successfully",
                });
                
                closeEditModal();
                setEditingKey(null);
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to update translation key",
                  variant: "destructive",
                });
              }
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}