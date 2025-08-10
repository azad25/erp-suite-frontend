"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { 
  FileIcon, 
  FolderIcon,
  PlusIcon as UploadIcon, 
  DownloadIcon, 
  UserIcon as SearchIcon,
  FileIcon as FilterIcon,
  GridIcon,
  ListIcon,
  PageIcon as ImageIcon,
  FileIcon as FileTextIcon,
  DocsIcon as ArchiveIcon,
  VideoIcon,
  PaperPlaneIcon as ShareIcon,
  ShootingStarIcon as StarIcon,
  PencilIcon as EditIcon,
  EyeIcon
} from "@/icons";

const PersonalDocumentsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [folders] = useState([
    {
      id: 1,
      name: "Personal Documents",
      itemCount: 15,
      lastModified: "2024-01-15",
      color: "blue"
    },
    {
      id: 2,
      name: "Tax Documents",
      itemCount: 8,
      lastModified: "2024-01-10",
      color: "green"
    },
    {
      id: 3,
      name: "Insurance",
      itemCount: 6,
      lastModified: "2024-01-08",
      color: "purple"
    },
    {
      id: 4,
      name: "Medical Records",
      itemCount: 12,
      lastModified: "2024-01-12",
      color: "red"
    }
  ]);

  const [documents] = useState([
    {
      id: 1,
      name: "Passport_Copy.pdf",
      type: "pdf",
      size: "2.4 MB",
      lastModified: "2024-01-15",
      folder: "Personal Documents",
      starred: true,
      shared: false,
      tags: ["Identity", "Travel"]
    },
    {
      id: 2,
      name: "Tax_Return_2023.pdf",
      type: "pdf",
      size: "1.8 MB",
      lastModified: "2024-01-14",
      folder: "Tax Documents",
      starred: false,
      shared: true,
      tags: ["Tax", "2023"]
    },
    {
      id: 3,
      name: "Insurance_Policy.pdf",
      type: "pdf",
      size: "3.2 MB",
      lastModified: "2024-01-13",
      folder: "Insurance",
      starred: false,
      shared: false,
      tags: ["Insurance", "Policy"]
    },
    {
      id: 4,
      name: "Medical_Report.pdf",
      type: "pdf",
      size: "1.1 MB",
      lastModified: "2024-01-12",
      folder: "Medical Records",
      starred: true,
      shared: false,
      tags: ["Medical", "Report"]
    },
    {
      id: 5,
      name: "Bank_Statement.pdf",
      type: "pdf",
      size: "856 KB",
      lastModified: "2024-01-11",
      folder: "Personal Documents",
      starred: false,
      shared: false,
      tags: ["Banking", "Statement"]
    },
    {
      id: 6,
      name: "Resume_2024.docx",
      type: "document",
      size: "245 KB",
      lastModified: "2024-01-10",
      folder: "Personal Documents",
      starred: true,
      shared: true,
      tags: ["Resume", "Career"]
    },
    {
      id: 7,
      name: "Vacation_Photos.zip",
      type: "archive",
      size: "45.2 MB",
      lastModified: "2024-01-09",
      folder: "Personal Documents",
      starred: false,
      shared: false,
      tags: ["Photos", "Vacation"]
    },
    {
      id: 8,
      name: "Investment_Portfolio.xlsx",
      type: "spreadsheet",
      size: "1.5 MB",
      lastModified: "2024-01-08",
      folder: "Personal Documents",
      starred: false,
      shared: false,
      tags: ["Investment", "Finance"]
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-green-500" />;
      case 'video':
        return <VideoIcon className="h-5 w-5 text-red-500" />;
      case 'pdf':
        return <FileTextIcon className="h-5 w-5 text-red-600" />;
      case 'document':
        return <FileTextIcon className="h-5 w-5 text-blue-500" />;
      case 'spreadsheet':
        return <FileTextIcon className="h-5 w-5 text-green-600" />;
      case 'archive':
        return <ArchiveIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileTypeBadge = (type: string) => {
    const colors = {
      image: 'bg-green-100 text-green-800',
      video: 'bg-red-100 text-red-800',
      pdf: 'bg-red-100 text-red-800',
      document: 'bg-blue-100 text-blue-800',
      spreadsheet: 'bg-green-100 text-green-800',
      archive: 'bg-purple-100 text-purple-800'
    };
    
    const colorMap = {
      image: 'success',
      video: 'error',
      pdf: 'error',
      document: 'primary',
      spreadsheet: 'success',
      archive: 'warning'
    } as const;
    
    return (
      <Badge color={colorMap[type as keyof typeof colorMap] || 'light'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.folder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const starredDocuments = documents.filter(doc => doc.starred);
  const sharedDocuments = documents.filter(doc => doc.shared);
  const totalSize = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size.split(' ')[0]);
    const unit = doc.size.split(' ')[1];
    if (unit === 'MB') return acc + size;
    if (unit === 'KB') return acc + size / 1024;
    return acc;
  }, 0);

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredDocuments.map((doc) => (
        <div key={doc.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            {getFileIcon(doc.type)}
            <div className="flex items-center gap-1">
              {doc.starred && <StarIcon className="h-4 w-4 text-yellow-500" />}
              {doc.shared && <ShareIcon className="h-4 w-4 text-blue-500" />}
            </div>
          </div>
          <h3 className="font-medium text-sm mb-2 truncate" title={doc.name}>
            {doc.name}
          </h3>
          <div className="space-y-1 text-xs text-gray-600 mb-3">
            <p>Size: {doc.size}</p>
            <p>Modified: {doc.lastModified}</p>
            <p className="truncate">Folder: {doc.folder}</p>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {getFileTypeBadge(doc.type)}
            {doc.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} size="sm" color="light">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="flex-1">
              <EyeIcon className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <DownloadIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Modified</TableCell>
            <TableCell>Folder</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{doc.name}</span>
                    {doc.starred && <StarIcon className="h-4 w-4 text-yellow-500" />}
                    {doc.shared && <ShareIcon className="h-4 w-4 text-blue-500" />}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getFileTypeBadge(doc.type)}</TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell>{doc.lastModified}</TableCell>
              <TableCell>{doc.folder}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <EyeIcon className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <DownloadIcon className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <ShareIcon className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderFolders = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <div key={folder.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <FolderIcon className="h-8 w-8 text-blue-500" />
            <div className="flex-1">
              <h3 className="font-medium">{folder.name}</h3>
              <p className="text-sm text-gray-600">
                {folder.itemCount} items
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Modified: {folder.lastModified}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Document Storage" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Storage</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Store and organize your personal documents securely
          </p>
        </div>
        <Button startIcon={<UploadIcon />}>
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{folders.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Folders</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <StarIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{starredDocuments.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Starred</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArchiveIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSize.toFixed(1)} MB</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Storage Used</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button variant="outline" startIcon={<FilterIcon />}>
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: `All Documents (${filteredDocuments.length})` },
            { key: 'folders', label: `Folders (${folders.length})` },
            { key: 'starred', label: `Starred (${starredDocuments.length})` },
            { key: 'shared', label: `Shared (${sharedDocuments.length})` }
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
        {activeTab === 'all' && (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
        {activeTab === 'folders' && renderFolders()}
        {activeTab === 'starred' && (
          viewMode === 'grid' ? 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {starredDocuments.map((doc) => (
                <div key={doc.id} className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    {getFileIcon(doc.type)}
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                  </div>
                  <h3 className="font-medium text-sm mb-2 truncate" title={doc.name}>
                    {doc.name}
                  </h3>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p>Size: {doc.size}</p>
                    <p>Modified: {doc.lastModified}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <DownloadIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div> : 
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Modified</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {starredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="bg-yellow-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{doc.name}</span>
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getFileTypeBadge(doc.type)}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.lastModified}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <DownloadIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        )}
        {activeTab === 'shared' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Modified</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedDocuments.map((doc) => (
                  <TableRow key={doc.id} className="bg-blue-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{doc.name}</span>
                          <ShareIcon className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getFileTypeBadge(doc.type)}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.lastModified}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <EyeIcon className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <EditIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDocumentsPage;