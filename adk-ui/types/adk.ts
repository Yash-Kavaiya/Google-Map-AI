// Types for Google ADK Server Communication
export interface AdkMessage {
  role: 'user' | 'assistant' | 'system';
  parts: AdkPart[];
}

export interface AdkPart {
  text: string;
}

export interface AdkRequest {
  appName: string;
  userId: string;
  sessionId: string;
  newMessage: AdkMessage;
  streaming?: boolean;
}

export interface AdkResponse {
  id: string;
  type: 'agent_response' | 'tool_call' | 'final_response';
  content?: AdkMessage;
  timestamp: string;
  is_final_response?: boolean;
}

export interface AdkSession {
  id: string;
  appName: string;
  userId: string;
  createdAt: string;
  lastUpdated: string;
}

export interface AgentConfig {
  name: string;
  description: string;
  endpoint: string;
  model?: string;
  tools?: string[];
}
