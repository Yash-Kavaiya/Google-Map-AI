# Google ADK UI

A modern Next.js interface for communicating with Google Agent Development Kit (ADK) servers.

## Features

- **Real-time Chat Interface**: Communicate with your ADK agents through a clean, modern UI
- **Session Management**: Configure and manage ADK sessions with custom app names, user IDs, and session IDs
- **Live Server Status**: Real-time connection monitoring to your ADK server
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript Support**: Fully typed for better development experience

## Prerequisites

- Node.js 18+ and npm/yarn
- Google ADK server running locally (typically on port 8000)
- A configured ADK agent

## Quick Start

### 1. Install Dependencies

```bash
cd adk-ui
npm install
```

### 2. Start Your ADK Server

First, ensure your ADK server is running. In your agent directory:

```bash
# For Python agents
adk api_server

# For Java agents  
mvn compile exec:java -Dexec.args="--adk.agents.source-dir=src/main/java/agents --server.port=8080"
```

### 3. Start the UI

```bash
npm run dev
```

Visit http://localhost:3000 to access the interface.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_ADK_URL=http://localhost:8000
```

### Session Configuration

The UI allows you to configure:

- **App Name**: The name of your agent folder (e.g., "my_sample_agent")
- **User ID**: Unique identifier for the user (e.g., "u_123")  
- **Session ID**: Unique identifier for the conversation session (e.g., "s_123")

## API Endpoints

The UI communicates with these ADK server endpoints:

- `POST /run` - Send queries and receive responses
- `POST /run_sse` - Streaming responses (Server-Sent Events)
- `GET /health` - Server health check

## Project Structure

```
adk-ui/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main page component
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── session/          # Session management components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and services
│   ├── adk-service.ts    # ADK API service
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
│   └── adk.ts           # ADK-related types
└── public/              # Static assets
```

## Usage

### Basic Chat

1. Ensure your ADK server is running and shows "Connected" status
2. Configure your session parameters (or use defaults)
3. Type a message and press Send
4. View the agent's response in the chat interface

### Session Management

- **Update Session**: Modify app name, user ID, or session ID
- **Generate Random**: Create random user and session IDs for testing
- **Connection Status**: Monitor real-time server connectivity

## Troubleshooting

### Common Issues

**"ADK Server Disconnected"**
- Ensure your ADK server is running on the correct port
- Check that the server URL in configuration matches your setup
- Verify no firewall is blocking the connection

**"No response received from agent"**
- Check ADK server logs for errors
- Verify your agent configuration is correct
- Ensure the app name matches your agent folder name

**Build/Runtime Errors**
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18 or higher
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Server Requirements

Your ADK server should support these endpoints:

```bash
# Health check
curl http://localhost:8000/health

# Send query
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "my_sample_agent",
    "userId": "u_123", 
    "sessionId": "s_123",
    "newMessage": {
      "role": "user",
      "parts": [{"text": "Hello"}]
    }
  }'
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and side effects

## License

This project is open source and available under the MIT License.

## Related Links

- [Google ADK Documentation](https://google.github.io/adk-docs/)
- [ADK Testing Guide](https://google.github.io/adk-docs/get-started/testing/#local-testing)
- [Next.js Documentation](https://nextjs.org/docs)
