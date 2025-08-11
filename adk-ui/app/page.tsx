'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { Sidebar } from '../components/sidebar/Sidebar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
  messageCount: number;
}

interface SessionConfig {
  appName: string;
  userId: string;
  sessionId: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionConfig>({
    appName: 'google-map-adk',
    userId: 'user',
    sessionId: 's_123',
  });
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);

  // Check ADK server connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Use our proxy health check endpoint
        const response = await fetch('/api/adk/health');
        const data = await response.json();
        setIsConnected(data.status === 'connected');
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  };

  const saveCurrentConversation = useCallback(() => {
    if (messages.length > 0 && currentConversation) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation 
            ? {
                ...conv,
                messages,
                lastMessage: messages[messages.length - 1]?.content || '',
                timestamp: new Date(),
                messageCount: messages.length
              }
            : conv
        )
      );
    }
  }, [messages, currentConversation]);

  const startNewConversation = () => {
    saveCurrentConversation();
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messages: [],
      messageCount: 0
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation.id);
    setMessages([]);
  };

  const loadConversation = (conversationId: string) => {
    saveCurrentConversation();
    
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversationId);
      setMessages(conversation.messages);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (currentConversation === conversationId) {
      setCurrentConversation(null);
      setMessages([]);
    }
  };

  const exportConversation = (format: string) => {
    const conversation = conversations.find(conv => conv.id === currentConversation);
    if (!conversation) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `conversation_${timestamp}`;

    let content = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = conversation.messages
          .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join('\n\n');
        mimeType = 'text/plain';
        break;
      
      case 'json':
        content = JSON.stringify(conversation, null, 2);
        mimeType = 'application/json';
        break;
      
      case 'md':
        content = `# ${conversation.title}\n\n` +
          conversation.messages
            .map(msg => `## ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}\n\n${msg.content}\n`)
            .join('\n');
        mimeType = 'text/markdown';
        break;
      
      case 'csv':
        content = 'Role,Content,Timestamp\n' +
          conversation.messages
            .map(msg => `"${msg.role}","${msg.content.replace(/"/g, '""')}","${msg.timestamp.toISOString()}"`)
            .join('\n');
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!isConnected) {
      alert('Not connected to the ADK server. Please check your connection.');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Update conversation title if this is the first message
    if (newMessages.length === 1 && currentConversation) {
      const title = generateConversationTitle(messageText);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation 
            ? { ...conv, title }
            : conv
        )
      );
    }

    try {
      // Prepare ADK request
      const adkRequest = {
        appName: currentSession.appName,
        userId: currentSession.userId,
        sessionId: currentSession.sessionId,
        newMessage: {
          role: 'user' as const,
          parts: [{ text: messageText }],
        },
      };

      // Send to ADK server via our proxy
      const response = await fetch('/api/adk/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adkRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const events = await response.json();
      
      // Handle error response from our proxy
      if (events.error) {
        throw new Error(events.error);
      }
      
      // Find the final response from ADK events
      let finalResponseText = 'No response received from agent.';
      
      if (Array.isArray(events)) {
        // Look for the last event with text content from the model
        const textEvents = events.filter((event: any) => 
          event.content && 
          event.content.parts && 
          event.content.parts.length > 0 &&
          event.content.parts.some((part: any) => part.text) &&
          event.content.role === 'model'
        );
        
        if (textEvents.length > 0) {
          const lastEvent = textEvents[textEvents.length - 1];
          const textPart = lastEvent.content.parts.find((part: any) => part.text);
          if (textPart) {
            finalResponseText = textPart.text;
          }
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: finalResponseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: Failed to communicate with ADK server. Please ensure the server is running on http://localhost:8000`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize first conversation if none exist
  useEffect(() => {
    if (conversations.length === 0) {
      startNewConversation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversation || undefined}
        onNewConversation={startNewConversation}
        onSelectConversation={loadConversation}
        onExportConversation={(id, format) => exportConversation(format)}
        onCopyConversation={(id) => {}}
        onEmailConversation={(id) => {}}
        isConnected={isConnected}
        agentName="Google Maps AI"  // Updated agent name
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Chat Area */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto h-full">
            <div className="h-[calc(115vh-140px)]">
              <ChatInterface
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
                agentName="Google Maps AI"
                isConnected={isConnected}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
