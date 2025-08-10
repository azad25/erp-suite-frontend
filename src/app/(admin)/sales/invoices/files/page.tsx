"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface InvoiceFile {
  id: string;
  invoiceNumber: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  createdDate: string;
  downloadCount: number;
  status: string;
  customerName: string;
}

const InvoiceFilesPage = () => {
  const [files] = useState<InvoiceFile[]>([
    { id: "1", invoiceNumber: "INV-001", fileName: "INV-001_TechCorp.pdf", fileType: "PDF", fileSize: "245 KB", createdDate: "2024-02-26", downloadCount: 3, status: "Generated", customerName: "Tech Corp" },
    { id: "2", invoiceNumber: "INV-002", fileName: "INV-002_DesignStudio.pdf", fileType: "PDF", fileSize: "198 KB", createdDate: "2024-02-25", downloadCount: 1, status: "Generated", customerName: "Design Studio" },
    { id: "3", invoiceNumber: "INV-003", fileName: "INV-003_MarketingInc.pdf", fileType: "PDF", fileSize: "312 KB", createdDate: "2024-02-24", downloadCount: 0, status: "Generating", customerName: "Marketing Inc" },
    { id: "4", invoiceNumber: "INV-004", fileName: "INV-004_StartupInc.pdf", fileType: "PDF", fileSize: "267 KB", createdDate: "2024-02-23", downloadCount: 5, status: "Generated", customerName: "Startup Inc" },
  ]);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Generating": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Failed": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === files.length ? [] : files.map(f => f.id));
  };

  const handleDownload = (file: InvoiceFile) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = `/api/invoices/files/${file.id}/download`;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownload = () => {
    if (selectedFiles.length === 0) return;
    
    // Create a zip file with selected invoices
    const selectedFileNames = files
      .filter(f => selectedFiles.includes(f.id))
      .map(f => f.fileName)
      .join(', ');
    
    alert(`Downloading ${selectedFiles.length} files: ${selectedFileNames}`);
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      console.log('Deleting file:', fileId);
      // In real app, make API call to delete file
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) {
      console.log('Deleting files:', selectedFiles);
      // In real app, make API call to delete files
      setSelectedFiles([]);
    }
  };

  const handleRegenerateFile = (file: InvoiceFile) => {
    console.log('Regenerating file:', file.fileName);
    // In real app, make API call to regenerate PDF
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Invoice Files" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Generated Invoice Files
          </h3>
          <div className="flex gap-2">
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                Grid
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <>
                <Button variant="outline" onClick={handleBulkDownload}>
                  Download Selected ({selectedFiles.length})
                </Button>
                <Button variant="outline" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </>
            )}
            <Button>Generate New PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{files.length}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Files</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{files.filter(f => f.status === 'Generated').length}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Generated</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{files.filter(f => f.status === 'Generating').length}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Processing</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{files.reduce((sum, f) => sum + f.downloadCount, 0)}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Downloads</div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search files..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Status</option>
            <option>Generated</option>
            <option>Generating</option>
            <option>Failed</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Types</option>
            <option>PDF</option>
            <option>Excel</option>
            <option>Word</option>
          </select>
        </div>

        {viewMode === 'list' ? (
          <Table className="border border-gray-200 dark:border-gray-700">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700">
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === files.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  File Name
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Size
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Downloads
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id} className="border-b border-gray-200 dark:border-gray-700">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <span className="mr-2">📄</span>
                      {file.fileName}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {file.invoiceNumber}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {file.customerName}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {file.fileSize}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {file.createdDate}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {file.downloadCount}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                        disabled={file.status !== 'Generated'}
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleRegenerateFile(file)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Regenerate
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-brand-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                    {file.status}
                  </span>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📄</div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.fileName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {file.fileSize}
                  </p>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Invoice:</span>
                    <span>{file.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="truncate ml-2">{file.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{file.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span>{file.downloadCount}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex-1 px-2 py-1 text-xs bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50"
                    disabled={file.status !== 'Generated'}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleRegenerateFile(file)}
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceFilesPage;