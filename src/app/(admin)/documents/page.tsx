"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface Document {
  id: string;
  title: string;
  type: string;
  owner: string;
  lastModified: string;
  size: string;
  shared: boolean;
  status: string;
  tags: string[];
}

const DocumentsPage = () => {
  const router = useRouter();
  const [documents] = useState<Document[]>([
    { id: "DOC-001", title: "Company Policy Manual", type: "Document", owner: "HR Team", lastModified: "2024-02-26", size: "2.4 MB", shared: true, status: "Published", tags: ["HR", "Policy"] },
    { id: "DOC-002", title: "Q1 Sales Presentation", type: "Presentation", owner: "Sales Team", lastModified: "2024-02-25", size: "5.1 MB", shared: false, status: "Draft", tags: ["Sales", "Q1"] },
    { id: "DOC-003", title: "Project Requirements", type: "Document", owner: "John Smith", lastModified: "2024-02-24", size: "1.8 MB", shared: true, status: "Review", tags: ["Project", "Requirements"] },
    { id: "DOC-004", title: "Budget Analysis Spreadsheet", type: "Spreadsheet", owner: "Finance Team", lastModified: "2024-02-23", size: "892 KB", shared: true, status: "Published", tags: ["Finance", "Budget"] },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Review": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Archived": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Document": return "📄";
      case "Presentation": return "📊";
      case "Spreadsheet": return "📈";
      case "Form": return "📝";
      default: return "📄";
    }
  };

  const handleCreateDocument = (type: string) => {
    router.push(`/documents/create?type=${type}`);
  };

  const handleSelectDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDocs(selectedDocs.length === documents.length ? [] : documents.map(d => d.id));
  };

  const handleBulkAction = (action: string) => {
    if (selectedDocs.length === 0) return;
    console.log(`${action} documents:`, selectedDocs);
    setSelectedDocs([]);
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Documents" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Document Management
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Button>
                Create New
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden group-hover:block">
                <div className="py-1">
                  <button
                    onClick={() => handleCreateDocument('document')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📄 Document
                  </button>
                  <button
                    onClick={() => handleCreateDocument('presentation')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📊 Presentation
                  </button>
                  <button
                    onClick={() => handleCreateDocument('spreadsheet')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📈 Spreadsheet
                  </button>
                  <button
                    onClick={() => handleCreateDocument('form')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📝 Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Documents</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'Published').length}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Published</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'Draft').length}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Drafts</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{documents.filter(d => d.shared).length}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Shared</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search documents..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Types</option>
              <option>Document</option>
              <option>Presentation</option>
              <option>Spreadsheet</option>
              <option>Form</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Review</option>
              <option>Archived</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedDocs.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('share')}>
                  Share ({selectedDocs.length})
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                  Archive
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                  Delete
                </Button>
              </div>
            )}
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
          </div>
        </div>

        {viewMode === 'list' ? (
          <Table className="border border-gray-200 dark:border-gray-700">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700">
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedDocs.length === documents.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Owner
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Modified
                </TableCell>
                <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Size
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
              {documents.map((doc) => (
                <TableRow key={doc.id} className="border-b border-gray-200 dark:border-gray-700">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => handleSelectDoc(doc.id)}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <span className="mr-2">{getTypeIcon(doc.type)}</span>
                      <div>
                        <div>{doc.title}</div>
                        <div className="flex gap-1 mt-1">
                          {doc.tags.map(tag => (
                            <span key={tag} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {doc.owner}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {doc.lastModified}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {doc.size}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      {doc.shared && <span className="text-xs text-blue-600">🔗 Shared</span>}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button variant="link" onClick={() => router.push(`/documents/${doc.id}`)}>Open</Button>
                      <Button variant="link" onClick={() => router.push(`/documents/${doc.id}/edit`)}>Edit</Button>
                      <Button variant="link">Share</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedDocs.includes(doc.id) ? 'ring-2 ring-brand-500' : ''
                }`}
                onClick={() => router.push(`/documents/${doc.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectDoc(doc.id);
                    }}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getTypeIcon(doc.type)}</div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.type}
                  </p>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Owner:</span>
                    <span className="truncate ml-2">{doc.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modified:</span>
                    <span>{doc.lastModified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{doc.size}</span>
                  </div>
                  {doc.shared && (
                    <div className="flex justify-center">
                      <span className="text-blue-600">🔗 Shared</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.map(tag => (
                    <span key={tag} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/documents/${doc.id}`);
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-brand-500 text-white rounded hover:bg-brand-600"
                  >
                    Open
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/documents/${doc.id}/edit`);
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Share document:', doc.id);
                    }}
                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Share
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

export default DocumentsPage;