'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import Progress from '@/components/ui/progress/Progress';
import { 
  DownloadIcon,
  FileIcon,
  AlertIcon,
  CheckCircleIcon,
  CloseIcon,
  DocsIcon
} from '@/icons';
// Simple toast implementation
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`${variant === 'destructive' ? 'Error' : 'Success'}: ${title} - ${description}`);
    // In a real app, this would show a proper toast notification
  }
});

interface ImportResult {
  success: boolean;
  message: string;
  keysAdded: number;
  keysUpdated: number;
  errors: string[];
}

export default function LanguageImportExport() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const languages = [
    { code: 'all', name: 'All Languages' },
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'Bengali' },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          
          // Simulate progress
          for (let i = 0; i <= 100; i += 10) {
            setImportProgress(i);
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          let data;
          if (file.name.endsWith('.json')) {
            data = JSON.parse(content);
          } else if (file.name.endsWith('.csv')) {
            data = parseCSV(content);
          } else {
            throw new Error('Unsupported file format');
          }

          // Process the data
          const result = await processImportData(data);
          setImportResult(result);

          if (result.success) {
            toast({
              title: "Import Successful",
              description: `Added ${result.keysAdded} keys, updated ${result.keysUpdated} keys`,
            });
          } else {
            toast({
              title: "Import Failed",
              description: result.message,
              variant: "destructive",
            });
          }
        } catch (error) {
          setImportResult({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            keysAdded: 0,
            keysUpdated: 0,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
          });
          
          toast({
            title: "Import Failed",
            description: "Failed to process the uploaded file",
            variant: "destructive",
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read the uploaded file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseCSV = (content: string) => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data: any = {};

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 2) {
        const key = values[0];
        for (let j = 1; j < values.length && j < headers.length; j++) {
          const lang = headers[j];
          if (!data[lang]) data[lang] = {};
          setNestedValue(data[lang], key, values[j]);
        }
      }
    }

    return data;
  };

  const setNestedValue = (obj: any, path: string, value: string) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const processImportData = async (data: any): Promise<ImportResult> => {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock result
    return {
      success: true,
      message: 'Import completed successfully',
      keysAdded: 15,
      keysUpdated: 8,
      errors: [],
    };
  };

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // In a real app, this would fetch data from the API
      const exportData = await generateExportData(selectedLanguage, format);
      
      // Create and download file
      const blob = new Blob([exportData.content], { type: exportData.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Downloaded ${exportData.filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export language files",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const generateExportData = async (language: string, format: 'json' | 'csv') => {
    // Mock data - in a real app, this would come from the API
    const mockData = {
      en: { common: { save: 'Save', cancel: 'Cancel' } },
      bn: { common: { save: 'সংরক্ষণ', cancel: 'বাতিল' } },
    };

    if (format === 'json') {
      const data = language === 'all' ? mockData : { [language]: mockData[language as keyof typeof mockData] };
      return {
        content: JSON.stringify(data, null, 2),
        mimeType: 'application/json',
        filename: `translations-${language}-${new Date().toISOString().split('T')[0]}.json`,
      };
    } else {
      // CSV format
      let csv = 'Key,English,Bengali\n';
      const flattenObject = (obj: any, prefix = '') => {
        for (const key in obj) {
          const newKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === 'object') {
            flattenObject(obj[key], newKey);
          } else {
            const enValue = getNestedValue(mockData.en, newKey) || '';
            const bnValue = getNestedValue(mockData.bn, newKey) || '';
            csv += `"${newKey}","${enValue}","${bnValue}"\n`;
          }
        }
      };
      
      flattenObject(mockData.en);
      
      return {
        content: csv,
        mimeType: 'text/csv',
        filename: `translations-${language}-${new Date().toISOString().split('T')[0]}.csv`,
      };
    }
  };

  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DownloadIcon className="h-5 w-5" />
            Import Translations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload translation files to update or add new keys
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">JSON Format</h3>
                  <p className="text-sm text-muted-foreground">
                    Nested JSON structure
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Upload JSON File
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <DocsIcon className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">CSV Format</h3>
                  <p className="text-sm text-muted-foreground">
                    Key, English, Bengali columns
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Upload CSV File
              </Button>
            </Card>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-sm">Processing file...</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          {importResult && (
            <div className={`p-4 rounded-lg border ${
              importResult.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {importResult.success ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertIcon className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {importResult.success ? 'Import Successful' : 'Import Failed'}
                </span>
              </div>
              <p className="text-sm mb-2">{importResult.message}</p>
              {importResult.success && (
                <div className="flex gap-4 text-sm">
                  <span>Keys Added: <Badge variant="light">{importResult.keysAdded}</Badge></span>
                  <span>Keys Updated: <Badge variant="light">{importResult.keysUpdated}</Badge></span>
                </div>
              )}
              {importResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-600 mb-1">Errors:</p>
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DownloadIcon className="h-5 w-5" />
            Export Translations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Download translation files in various formats
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleExport('json')}
              disabled={isExporting}
            >
              <FileIcon className="h-8 w-8 text-blue-500" />
              <div className="text-center">
                <div className="font-semibold">Export as JSON</div>
                <div className="text-sm text-muted-foreground">
                  Nested structure format
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <DocsIcon className="h-8 w-8 text-green-500" />
              <div className="text-center">
                <div className="font-semibold">Export as CSV</div>
                <div className="text-sm text-muted-foreground">
                  Spreadsheet compatible
                </div>
              </div>
            </Button>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-sm">Generating export file...</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Format Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            Format Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">JSON Format</h3>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "signIn": "Sign In"
  }
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">CSV Format</h3>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`Key,English,Bengali
common.save,Save,সংরক্ষণ
common.cancel,Cancel,বাতিল
auth.signIn,Sign In,সাইন ইন`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}