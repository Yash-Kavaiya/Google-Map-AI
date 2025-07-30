"""
Simple weather agent for testing Google ADK UI
This agent provides weather information and demonstrates basic ADK functionality.
"""

from google.adk.agents import Agent
from google.adk.tools import Tool
from google.genai.types import Content, Part
import json

# Simple weather tool
def get_weather(city: str) -> str:
    """Get weather information for a city."""
    # Mock weather data for demonstration
    weather_data = {
        "new york": "Sunny, 72°F (22°C)",
        "london": "Cloudy, 60°F (15°C)", 
        "tokyo": "Rainy, 68°F (20°C)",
        "paris": "Partly cloudy, 65°F (18°C)",
        "sydney": "Sunny, 75°F (24°C)"
    }
    
    city_lower = city.lower()
    if city_lower in weather_data:
        return f"The weather in {city} is: {weather_data[city_lower]}"
    else:
        return f"Weather data not available for {city}. Try cities like New York, London, Tokyo, Paris, or Sydney."

# Create the weather tool
weather_tool = Tool(
    name="get_weather",
    description="Get current weather information for a specified city",
    func=get_weather,
)

# Create the agent
weather_agent = Agent(
    name="weather_assistant",
    description="A helpful weather assistant that provides current weather information for cities around the world.",
    instruction="""You are a friendly weather assistant. When users ask about weather, use the get_weather tool to get current conditions. 
    Be conversational and helpful. If users ask about other topics, politely redirect them to weather-related questions or provide general assistance.""",
    tools=[weather_tool],
)
