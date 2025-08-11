'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SessionConfig {
  appName: string;
  userId: string;
  sessionId: string;
}

interface SessionManagerProps {
  onSessionChange: (session: SessionConfig) => void;
  currentSession?: SessionConfig;
  isConnected: boolean;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  onSessionChange,
  currentSession,
  isConnected,
}) => {
  const [appName, setAppName] = useState(currentSession?.appName || 'google-map-adk');
  const [userId, setUserId] = useState(currentSession?.userId || 'user');
  const [sessionId, setSessionId] = useState(currentSession?.sessionId || 's_123');

  const handleCreateSession = () => {
    const newSession: SessionConfig = {
      appName: appName.trim(),
      userId: userId.trim(),
      sessionId: sessionId.trim(),
    };
    onSessionChange(newSession);
  };

  const generateRandomSession = () => {
    const randomUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
    const randomSessionId = `session_${Math.random().toString(36).substr(2, 9)}`;
    
    setUserId(randomUserId);
    setSessionId(randomSessionId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Session Configuration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Input
            label="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="gmap-buddy"
          />
          <p className="text-xs text-gray-500 mt-1">
            The name of your agent folder
          </p>
        </div>

        <div>
          <Input
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="user"
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique identifier for the user
          </p>
        </div>

        <div>
          <Input
            label="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="s_123"
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique identifier for this conversation session
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCreateSession}
            variant="primary"
            className="flex-1"
          >
            Update Session
          </Button>
          <Button
            onClick={generateRandomSession}
            variant="outline"
          >
            Generate Random
          </Button>
        </div>

        {currentSession && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Current Session:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>App:</strong> {currentSession.appName}</p>
              <p><strong>User:</strong> {currentSession.userId}</p>
              <p><strong>Session:</strong> {currentSession.sessionId}</p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Server Status:</p>
          <p className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? '✓ Connected to ADK Server' : '✗ ADK Server Disconnected'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
