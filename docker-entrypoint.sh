#!/bin/bash
set -e

# Default port for Cloud Run
PORT=${PORT:-8080}

echo "Starting GMap-Buddy application on port $PORT..."

# Check if required environment variables are set
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
    echo "WARNING: GOOGLE_MAPS_API_KEY is not set"
fi

# Start the Next.js frontend in the background
echo "Starting Next.js frontend..."
cd /app/adk-ui
npm start &
FRONTEND_PID=$!

# Wait for frontend to be ready
sleep 5

# Start the Python ADK agent
echo "Starting Python ADK agent..."
cd /app
python -m gmap_buddy.agent &
BACKEND_PID=$!

# Function to handle shutdown
shutdown() {
    echo "Shutting down..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    wait
    exit 0
}

# Set up signal handlers
trap shutdown SIGTERM SIGINT

# Wait for either process to exit
wait -n
shutdown
