'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SendIcon, MapIcon, ConnectedIcon, DisconnectedIcon } from '../ui/icons';
import { VoiceControls } from '../voice/VoiceControls';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading?: boolean;
  agentName?: string;
  isConnected?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isLoading = false,
  agentName = 'ADK Agent',
  isConnected = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-speak assistant responses when voice is enabled and not muted
  useEffect(() => {
    if (messages.length > 0 && isVoiceEnabled && !isMuted) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Use the global function to speak the response
        setTimeout(() => {
          if ((window as any).speakAssistantResponse) {
            (window as any).speakAssistantResponse(lastMessage.content);
          }
        }, 500);
      }
    }
  }, [messages, isVoiceEnabled, isMuted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await onSendMessage(message);
  };

  const handleVoiceInput = (text: string) => {
    setInputValue(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQueries = [
    "Show me restaurants near Times Square",
    "Find directions to Central Park",
    "What's the traffic like to LAX airport?",
    "Search for gas stations nearby"
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg gmaps-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MapIcon />
            </div>
            <div>
              <div className="font-semibold text-lg">{agentName}</div>
              <div className="text-sm text-blue-100">Google Maps Assistant</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Voice Controls */}
            <VoiceControls
              onVoiceInput={handleVoiceInput}
              onVoiceToggle={setIsVoiceEnabled}
              isVoiceEnabled={isVoiceEnabled}
              isMuted={isMuted}
              onMuteToggle={setIsMuted}
            />
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <MapIcon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Google Maps Assistant
            </h3>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              I can help you find places, get directions, check traffic, and explore the world around you. 
              Use voice input or type your questions below.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(query)}
                  className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-blue-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <MapIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{query}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-900 border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3 max-w-[75%] shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about places, directions, or anything maps-related..."
              disabled={isLoading || !isConnected}
              className="rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-3 text-sm shadow-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !isConnected}
            variant="primary"
            icon={<SendIcon />}
            className="rounded-full px-6 py-3 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Send
          </Button>
        </form>
        
        {!isConnected && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-600 font-medium">
                Disconnected from server. Please check your connection.
              </span>
            </div>
          </div>
        )}

        {/* Voice Status Indicators */}
        {(isVoiceEnabled || !isMuted) && (
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            {isVoiceEnabled && (
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Voice Output Enabled
              </div>
            )}
            {!isMuted && (
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Audio Unmuted
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
