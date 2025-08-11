'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  PlusIcon, 
  ExportIcon, 
  CopyIcon, 
  EmailIcon, 
  DownloadIcon,
  MessageIcon,
  ConnectedIcon,
  DisconnectedIcon,
  MapIcon
} from '../ui/icons';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onExportConversation: (id: string, format: string) => void;
  onCopyConversation: (id: string) => void;
  onEmailConversation: (id: string) => void;
  isConnected: boolean;
  agentName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onExportConversation,
  onCopyConversation,
  onEmailConversation,
  isConnected,
  agentName,
}) => {
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const exportFormats = [
    { key: 'txt', label: 'Text (.txt)', icon: '📄' },
    { key: 'json', label: 'JSON (.json)', icon: '🔧' },
    { key: 'md', label: 'Markdown (.md)', icon: '📝' },
    { key: 'pdf', label: 'PDF (.pdf)', icon: '📋' },
    { key: 'csv', label: 'CSV (.csv)', icon: '📊' },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <MapIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">{agentName}</h2>
              <div className={`flex items-center gap-1 text-xs ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
                <span>{isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Conversation Button */}
        <Button
          onClick={onNewConversation}
          variant="primary"
          icon={<PlusIcon />}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-lg shadow-md"
        >
          New Conversation
        </Button>
      </div>

      {/* Agent Info */}
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Active Agent:</span>
          <div className="text-blue-600 font-semibold mt-1">{agentName}</div>
          <div className="text-xs text-gray-500 mt-1">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageIcon />
            <p className="mt-2 text-sm">No conversations yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a new conversation to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`relative group rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  currentConversationId === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTime(conversation.timestamp)}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {conversation.messageCount} messages
                      </span>
                    </div>
                  </div>
                </div>

                {/* Export Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<ExportIcon />}
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExportMenu(showExportMenu === conversation.id ? null : conversation.id);
                      }}
                    >
                      <span className="sr-only">Export</span>
                    </Button>
                    
                    {showExportMenu === conversation.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                          Export Options
                        </div>
                        
                        {exportFormats.map((format) => (
                          <button
                            key={format.key}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onExportConversation(conversation.id, format.key);
                              setShowExportMenu(null);
                            }}
                          >
                            <span>{format.icon}</span>
                            {format.label}
                          </button>
                        ))}
                        
                        <div className="border-t border-gray-100 my-1" />
                        
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyConversation(conversation.id);
                            setShowExportMenu(null);
                          }}
                        >
                          <CopyIcon />
                          Copy to Clipboard
                        </button>
                        
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEmailConversation(conversation.id);
                            setShowExportMenu(null);
                          }}
                        >
                          <EmailIcon />
                          Share via Email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-medium">Google Maps AI</div>
          <div>Powered by ADK</div>
        </div>
      </div>
    </div>
  );
};
