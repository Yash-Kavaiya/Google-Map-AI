#!/bin/bash

# Docker entrypoint script for Google Maps AI
# This script starts both the ADK backend and serves the built frontend

set -e

echo "🚀 Starting Google Maps AI Application..."

# Check if required environment variables are set
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
    echo "⚠️  WARNING: GOOGLE_MAPS_API_KEY environment variable is not set!"
    echo "   The application may not function properly without it."
    echo "   Please set it when running the container:"
    echo "   docker run -e GOOGLE_MAPS_API_KEY=your_key_here ..."
fi

# Set default port if not specified
export PORT=${PORT:-8080}

echo "📡 Port: $PORT"
echo "🗺️  Google Maps API Key: ${GOOGLE_MAPS_API_KEY:0:10}..."

# Change to the app directory
cd /app

# Start the ADK web server in the background
echo "🔧 Starting ADK web server..."
adk web --port=$PORT --host=0.0.0.0 &
ADK_PID=$!

# Function to handle shutdown gracefully
shutdown() {
    echo "🛑 Shutting down gracefully..."
    kill $ADK_PID 2>/dev/null || true
    exit 0
}

# Trap signals for graceful shutdown
trap shutdown SIGTERM SIGINT

# Wait for ADK server to start
echo "⏳ Waiting for ADK server to start..."
sleep 5

# Check if ADK server is running
if ! ps -p $ADK_PID > /dev/null; then
    echo "❌ ADK server failed to start!"
    exit 1
fi

echo "✅ ADK server started successfully (PID: $ADK_PID)"
echo "🌐 Application available at http://localhost:$PORT"
echo "📖 API documentation at http://localhost:$PORT/docs"

# Keep the container running and wait for the ADK process
wait $ADK_PID