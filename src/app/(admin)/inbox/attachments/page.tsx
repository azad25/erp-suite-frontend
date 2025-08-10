"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import Badge from "@/components/ui/badge/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileIcon, 
  DownloadIcon, 
  UserIcon as SearchIcon,
  FileIcon as FilterIcon,
  GridIcon,
  ListIcon,
  PageIcon as ImageIcon,
  FileIcon as FileTextIcon,
  DocsIcon as ArchiveIcon,
  VideoIcon
} from "@/icons";

const AttachmentsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const [attachments] = useState([
    {
      id: 1,
      name: "Invoice_2024_001.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2024-01-15",
      conversationId: "conv_001",
      conversationTitle: "Q1 Budget Discussion",
      preview: "/images/file-previews/pdf.png"
    },
    {
      id: 2,
      name: "Product_Mockup.png",
      type: "image",
      size: "1.8 MB",
      uploadedBy: "Sarah Wilson",
      uploadedAt: "2024-01-14",
      conversationId: "conv_002",
      conversationTitle: "Product Design Review",
      preview: "/images/file-previews/image.png"
    },
    {
      id: 3,
      name: "Meeting_Recording.mp4",
      type: "video",
      size: "45.2 MB",
      uploadedBy: "Mike Johnson",
      uploadedAt: "2024-01-13",
      conversationId: "conv_003",
      conversationTitle: "Weekly Team Standup",
      preview: "/images/file-previews/video.png"
    },
    {
      id: 4,
      name: "Contract_Draft.docx",
      type: "document",
      size: "156 KB",
      uploadedBy: "Emily Davis",
      uploadedAt: "2024-01-12",
      conversationId: "conv_004",
      conversationTitle: "Legal Review",
      preview: "/images/file-previews/document.png"
    },
    {
      id: 5,
      name: "Financial_Report.xlsx",
      type: "spreadsheet",
      size: "3.1 MB",
      uploadedBy: "Robert Chen",
      uploadedAt: "2024-01-11",
      conversationId: "conv_005",
      conversationTitle: "Monthly Financial Review",
      preview: "/images/file-previews/spreadsheet.png"
    },
    {
      id: 6,
      name: "Presentation.pptx",
      type: "presentation",
      size: "8.7 MB",
      uploadedBy: "Lisa Anderson",
      uploadedAt: "2024-01-10",
      conversationId: "conv_006",
      conversationTitle: "Client Presentation Prep",
      preview: "/images/file-previews/presentation.png"
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
      case 'presentation':
        return <FileTextIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileTypeBadge = (type: string) => {
    const colorMap = {
      image: 'success',
      video: 'error',
      pdf: 'error',
      document: 'primary',
      spreadsheet: 'success',
      presentation: 'warning'
    } as const;
    
    return (
      <Badge color={colorMap[type as keyof typeof colorMap] || 'light'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const filteredAttachments = attachments.filter(attachment =>
    attachment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attachment.conversationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attachment.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredAttachments.map((attachment) => (
        <Card key={attachment.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              {getFileIcon(attachment.type)}
              {getFileTypeBadge(attachment.type)}
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-sm mb-2 truncate" title={attachment.name}>
              {attachment.name}
            </h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Size: {attachment.size}</p>
              <p>By: {attachment.uploadedBy}</p>
              <p>Date: {attachment.uploadedAt}</p>
              <p className="truncate" title={attachment.conversationTitle}>
                From: {attachment.conversationTitle}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1">
                <DownloadIcon className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredAttachments.map((attachment) => (
        <Card key={attachment.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(attachment.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{attachment.name}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    From: {attachment.conversationTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{attachment.size}</span>
                <span>{attachment.uploadedBy}</span>
                <span>{attachment.uploadedAt}</span>
                {getFileTypeBadge(attachment.type)}
                <Button size="sm" variant="outline">
                  <DownloadIcon className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">File Attachments</h1>
          <p className="text-gray-600 mt-2">
            Manage and download files shared in conversations
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search files, conversations, or people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <FilterIcon className="h-4 w-4 mr-2" />
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files ({filteredAttachments.length})</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </TabsContent>

        <TabsContent value="images">
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Image files will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="text-center py-8 text-gray-500">
            <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Document files will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="text-center py-8 text-gray-500">
            <VideoIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Video files will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="archives">
          <div className="text-center py-8 text-gray-500">
            <ArchiveIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Archive files will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttachmentsPage;