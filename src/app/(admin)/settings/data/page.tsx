"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { 
  PlusIcon as UploadIcon, 
  DownloadIcon, 
  FileIcon,
  CheckCircleIcon as CheckIcon,
  CloseIcon as XIcon,
  TimeIcon as ClockIcon,
  DocsIcon as DatabaseIcon,
  ArrowUpIcon as RefreshIcon,
  AlertIcon as AlertTriangleIcon,
  TimeIcon as HistoryIcon,
  BoxIcon as SettingsIcon
} from "@/icons";

const DataPage = () => {
  const [activeTab, setActiveTab] = useState('imports');
  
  const [importJobs] = useState([
    {
      id: 1,
      name: "Customer Data Import",
      type: "CSV",
      status: "completed",
      progress: 100,
      recordsProcessed: 1250,
      recordsTotal: 1250,
      startedAt: "2024-01-15 10:30:00",
      completedAt: "2024-01-15 10:45:00",
      errors: 0
    },
    {
      id: 2,
      name: "Product Inventory Import",
      type: "Excel",
      status: "running",
      progress: 65,
      recordsProcessed: 650,
      recordsTotal: 1000,
      startedAt: "2024-01-15 11:00:00",
      completedAt: null,
      errors: 2
    },
    {
      id: 3,
      name: "Financial Transactions",
      type: "JSON",
      status: "failed",
      progress: 25,
      recordsProcessed: 125,
      recordsTotal: 500,
      startedAt: "2024-01-15 09:15:00",
      completedAt: null,
      errors: 15
    }
  ]);

  const [exportJobs] = useState([
    {
      id: 1,
      name: "Q4 Sales Report",
      type: "PDF",
      status: "completed",
      size: "2.4 MB",
      createdAt: "2024-01-15 14:30:00",
      downloadUrl: "/exports/q4-sales-report.pdf"
    },
    {
      id: 2,
      name: "Customer Database Export",
      type: "CSV",
      status: "completed",
      size: "15.7 MB",
      createdAt: "2024-01-15 13:45:00",
      downloadUrl: "/exports/customer-database.csv"
    },
    {
      id: 3,
      name: "Inventory Snapshot",
      type: "Excel",
      status: "processing",
      size: "Calculating...",
      createdAt: "2024-01-15 15:00:00",
      downloadUrl: null
    }
  ]);

  const [templates] = useState([
    {
      id: 1,
      name: "Customer Import Template",
      description: "Template for importing customer data with required fields",
      type: "CSV",
      fields: ["Name", "Email", "Phone", "Company", "Address"],
      downloadUrl: "/templates/customer-import.csv"
    },
    {
      id: 2,
      name: "Product Import Template",
      description: "Template for importing product inventory data",
      type: "Excel",
      fields: ["SKU", "Name", "Category", "Price", "Stock", "Description"],
      downloadUrl: "/templates/product-import.xlsx"
    },
    {
      id: 3,
      name: "Transaction Import Template",
      description: "Template for importing financial transaction data",
      type: "CSV",
      fields: ["Date", "Amount", "Type", "Account", "Description", "Reference"],
      downloadUrl: "/templates/transaction-import.csv"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case 'running':
      case 'processing':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      completed: 'success',
      running: 'primary',
      processing: 'primary',
      failed: 'error'
    } as const;
    
    return (
      <Badge color={colorMap[status as keyof typeof colorMap] || 'light'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  const renderImportJobs = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Import Jobs</h2>
          <Button startIcon={<UploadIcon />}>Start New Import</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Job Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Records</TableCell>
            <TableCell>Errors</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {importJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  <div>
                    <div className="font-medium">{job.name}</div>
                    <div className="text-sm text-gray-500">Started {formatDateTime(job.startedAt)}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell><Badge>{job.type}</Badge></TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell>
                {job.status === 'running' ? (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                ) : (
                  <span>{job.progress}%</span>
                )}
              </TableCell>
              <TableCell>
                {job.recordsProcessed.toLocaleString()} / {job.recordsTotal.toLocaleString()}
              </TableCell>
              <TableCell>
                <span className={job.errors > 0 ? 'text-red-600' : 'text-gray-600'}>
                  {job.errors}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {job.status === 'running' && (
                    <Button size="sm" variant="outline">
                      <XIcon className="h-3 w-3" />
                    </Button>
                  )}
                  {job.errors > 0 && (
                    <Button size="sm" variant="outline">
                      <AlertTriangleIcon className="h-3 w-3" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <HistoryIcon className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderExportJobs = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Export Jobs</h2>
          <Button startIcon={<DownloadIcon />}>Create Export</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Export Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exportJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  <span className="font-medium">{job.name}</span>
                </div>
              </TableCell>
              <TableCell><Badge>{job.type}</Badge></TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell>{job.size}</TableCell>
              <TableCell>{formatDateTime(job.createdAt)}</TableCell>
              <TableCell>
                {job.downloadUrl && (
                  <Button size="sm" startIcon={<DownloadIcon />}>
                    Download
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Import Templates</h2>
        <Button variant="outline" startIcon={<FileIcon />}>
          Create Template
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700 mb-1">Type</p>
                <Badge>{template.type}</Badge>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Fields ({template.fields.length})</p>
                <div className="flex flex-wrap gap-1">
                  {template.fields.slice(0, 3).map((field, index) => (
                    <Badge key={index} size="sm" color="light">
                      {field}
                    </Badge>
                  ))}
                  {template.fields.length > 3 && (
                    <Badge size="sm" color="light">
                      +{template.fields.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" startIcon={<DownloadIcon />} className="w-full">
                Download Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Data Import/Export" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Import/Export</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage data imports, exports, and bulk operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" startIcon={<SettingsIcon />}>
            Settings
          </Button>
          <Button startIcon={<UploadIcon />}>
            New Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UploadIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{importJobs.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Import Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DownloadIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{exportJobs.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Export Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DatabaseIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {importJobs.reduce((acc, job) => acc + job.recordsProcessed, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Records Processed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Templates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'imports', label: 'Import Jobs' },
            { key: 'exports', label: 'Export Jobs' },
            { key: 'templates', label: 'Templates' },
            { key: 'history', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'imports' && renderImportJobs()}
        {activeTab === 'exports' && renderExportJobs()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'history' && (
          <div className="text-center py-12">
            <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Import/Export History</h3>
            <p className="text-gray-600">
              View detailed history of all import and export operations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPage;