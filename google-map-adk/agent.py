# ./adk_agent_samples/mcp_agent/agent.py
import os
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
from . import prompt
# Retrieve the API key from an environment variable or directly insert it.
# Using an environment variable is generally safer.
# Ensure this environment variable is set in the terminal where you run 'adk web'.
# Example: export GOOGLE_MAPS_API_KEY="YOUR_ACTUAL_KEY"
google_maps_api_key = os.environ.get("GOOGLE_MAPS_API_KEY")

if not google_maps_api_key:
    # Fallback or direct assignment for testing - NOT RECOMMENDED FOR PRODUCTION
    google_maps_api_key = "YOUR_GOOGLE_MAPS_API_KEY_HERE" # Replace if not using env var
    if google_maps_api_key == "YOUR_GOOGLE_MAPS_API_KEY_HERE":
        print("WARNING: GOOGLE_MAPS_API_KEY is not set. Please set it as an environment variable or in the script.")
        # You might want to raise an error or exit if the key is crucial and not found.

root_agent = LlmAgent(
    model='gemini-2.0-flash',
    name='google-map-adk',
    instruction=prompt.instruction,
    tools=[
        MCPToolset(
            connection_params=StdioServerParameters(
                command='npx',
                args=[
                    "-y",
                    "@modelcontextprotocol/server-google-maps",
                ],
                # Pass the API key as an environment variable to the npx process
                # This is how the MCP server for Google Maps expects the key.
                env={
                    "GOOGLE_MAPS_API_KEY": google_maps_api_key
                }
            ),
            # You can filter for specific Maps tools if needed:
            # tool_filter=['get_directions', 'find_place_by_id']
        ),
        
    ],
)



