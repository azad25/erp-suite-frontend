"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import Badge from "@/components/ui/badge/Badge";
import AvatarText from "@/components/ui/avatar/AvatarText";
import {
  ChatIcon as MessageSquareIcon, 
  ArrowRightIcon as ReplyIcon, 
  PlusIcon as PinIcon,
  UserIcon as SearchIcon,
  FileIcon as FilterIcon,
  PlusIcon,
  GroupIcon as UsersIcon,
  TimeIcon as ClockIcon,
  ArrowUpIcon as TrendingUpIcon
} from "@/icons";

const DiscussionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [discussions] = useState([
    {
      id: 1,
      title: "Q1 Budget Planning Discussion",
      description: "Let's discuss the budget allocation for Q1 2024",
      author: {
        name: "John Doe",
        avatar: "/images/avatars/john.jpg",
        initials: "JD"
      },
      participants: [
        { name: "Sarah Wilson", initials: "SW" },
        { name: "Mike Johnson", initials: "MJ" },
        { name: "Emily Davis", initials: "ED" }
      ],
      replies: 12,
      lastActivity: "2 hours ago",
      isPinned: true,
      tags: ["Budget", "Planning", "Q1"],
      status: "active"
    },
    {
      id: 2,
      title: "New Product Launch Strategy",
      description: "Brainstorming ideas for our upcoming product launch",
      author: {
        name: "Sarah Wilson",
        avatar: "/images/avatars/sarah.jpg",
        initials: "SW"
      },
      participants: [
        { name: "John Doe", initials: "JD" },
        { name: "Lisa Anderson", initials: "LA" },
        { name: "Robert Chen", initials: "RC" }
      ],
      replies: 8,
      lastActivity: "4 hours ago",
      isPinned: false,
      tags: ["Product", "Launch", "Marketing"],
      status: "active"
    },
    {
      id: 3,
      title: "Remote Work Policy Updates",
      description: "Discussing changes to our remote work guidelines",
      author: {
        name: "Mike Johnson",
        avatar: "/images/avatars/mike.jpg",
        initials: "MJ"
      },
      participants: [
        { name: "Emily Davis", initials: "ED" },
        { name: "Robert Chen", initials: "RC" }
      ],
      replies: 15,
      lastActivity: "1 day ago",
      isPinned: false,
      tags: ["HR", "Policy", "Remote"],
      status: "active"
    },
    {
      id: 4,
      title: "Client Feedback Analysis",
      description: "Analyzing recent client feedback and improvement suggestions",
      author: {
        name: "Emily Davis",
        avatar: "/images/avatars/emily.jpg",
        initials: "ED"
      },
      participants: [
        { name: "Lisa Anderson", initials: "LA" },
        { name: "John Doe", initials: "JD" }
      ],
      replies: 6,
      lastActivity: "2 days ago",
      isPinned: false,
      tags: ["Feedback", "Analysis", "Client"],
      status: "resolved"
    },
    {
      id: 5,
      title: "Security Protocol Review",
      description: "Annual review of our security protocols and procedures",
      author: {
        name: "Robert Chen",
        avatar: "/images/avatars/robert.jpg",
        initials: "RC"
      },
      participants: [
        { name: "Mike Johnson", initials: "MJ" },
        { name: "Sarah Wilson", initials: "SW" }
      ],
      replies: 9,
      lastActivity: "3 days ago",
      isPinned: true,
      tags: ["Security", "Review", "Protocol"],
      status: "active"
    }
  ]);

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    const colorMap = {
      active: 'success',
      resolved: 'primary',
      archived: 'light'
    } as const;
    
    return (
      <Badge color={colorMap[status as keyof typeof colorMap] || 'light'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderParticipants = (participants: Array<{name: string, initials: string}>) => {
    const displayCount = 3;
    const visibleParticipants = participants.slice(0, displayCount);
    const remainingCount = participants.length - displayCount;

    return (
      <div className="flex items-center -space-x-2">
        {visibleParticipants.map((participant, index) => (
          <AvatarText key={index} name={participant.name} className="h-6 w-6 border-2 border-white text-xs" />
        ))}
        {remainingCount > 0 && (
          <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
            <span className="text-xs text-gray-600">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Threaded Discussions</h1>
          <p className="text-gray-600 mt-2">
            Organize conversations by topics and collaborate with your team
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Start Discussion
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search discussions..."
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquareIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {discussions.length}
                </p>
                <p className="text-sm text-blue-600">Total Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {discussions.filter(d => d.status === 'active').length}
                </p>
                <p className="text-sm text-green-600">Active Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {discussions.reduce((acc, d) => acc + d.participants.length, 0)}
                </p>
                <p className="text-sm text-purple-600">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AvatarText name={discussion.author.name} className="h-10 w-10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{discussion.title}</CardTitle>
                      {discussion.isPinned && (
                        <PinIcon className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {discussion.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="light" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(discussion.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ReplyIcon className="h-4 w-4" />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{discussion.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Participants:</span>
                    {renderParticipants(discussion.participants)}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Join Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start a new discussion to get the conversation going'}
          </p>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscussionsPage;