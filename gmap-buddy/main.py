# FastAPI wrapper for Google ADK agent
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import uvicorn
from .agent import root_agent

app = FastAPI(
    title="GMap-Buddy API",
    description="AI-powered Google Maps assistant",
    version="1.0.0"
)

# Health check endpoint for Cloud Run
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gmap-buddy"}

# Agent endpoint
@app.post("/api/chat")
async def chat_with_agent(message: dict):
    try:
        user_message = message.get("message", "")
        if not user_message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Process message with ADK agent
        response = root_agent.process(user_message)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files (Next.js build output)
app.mount("/", StaticFiles(directory="adk-ui", html=True), name="static")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(
        "gmap_buddy.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
