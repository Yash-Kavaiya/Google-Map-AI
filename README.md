# GMap-Buddy 🗺️

An AI-powered Google Maps assistant that helps you plan amazing road trips and explore the world with intelligent route planning, location discovery, and personalized travel recommendations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![Google ADK](https://img.shields.io/badge/Google%20ADK-Agents-4285F4)](https://github.com/google/agent-development-kit)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Yash-Kavaiya/GMap-Buddy/issues)

## 🌟 Overview

GMap-Buddy is an intelligent road trip planning assistant powered by Google's Agent Development Kit (ADK) and the Model Context Protocol (MCP). It combines the power of AI with Google Maps services to create personalized travel experiences, complete with route optimization, weather forecasts, accommodation suggestions, and local recommendations.

![GMap-Buddy UI](Images/UI.png)
*Modern and intuitive chat interface for seamless trip planning*

## ✨ Features

### 🤖 AI-Powered Trip Planning
- **Intelligent Route Optimization** - AI analyzes your preferences to create the perfect itinerary
- **Conversational Interface** - Natural language interaction for easy trip planning
- **Personalized Recommendations** - Tailored suggestions based on your interests and budget
- **Multi-Day Trip Support** - Break down long journeys with strategic stopping points

### 🗺️ Advanced Mapping Capabilities
- **Real-time Directions** - Get up-to-date routing with traffic considerations
- **Location Discovery** - Find attractions, restaurants, and points of interest
- **Place Details & Reviews** - Comprehensive information about destinations
- **Custom Waypoints** - Add multiple stops to your journey

### 🌤️ Smart Travel Assistance
- **Weather Forecasts** - Get weather information for your entire route
- **Clothing Recommendations** - AI suggests appropriate attire for each destination
- **Pet-Friendly Options** - Special accommodations for travelers with pets
- **Budget-Conscious Planning** - Options for every budget level

### 🏗️ Technical Features
- **Google ADK Integration** - Built on Google's Agent Development Kit
- **Model Context Protocol (MCP)** - Seamless tool integration and extensibility
- **Next.js Frontend** - Modern, responsive web interface
- **FastAPI Backend** - High-performance Python API
- **Docker Support** - Containerized deployment ready
- **Cloud Run Compatible** - Easy deployment to Google Cloud

![MCP Map Tools](Images/mcp_map_tools.png)
*Model Context Protocol (MCP) integration showing available map tools and capabilities*

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** - For the backend API and AI agent
- **Node.js 18+** - For the Next.js frontend
- **Google Maps API Key** - [Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key)
- **Docker** (optional) - For containerized deployment
- **Google Cloud CLI** (optional) - For Cloud Run deployment

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/Yash-Kavaiya/GMap-Buddy.git
cd GMap-Buddy
```

2. **Set up environment variables:**
```bash
# Create and configure your environment
export GOOGLE_MAPS_API_KEY="your_api_key_here"
```

3. **Choose your deployment method:**

#### Option A: Docker (Recommended)
```bash
# Build and run with Docker
docker build -t gmap-buddy .
docker run -d \
  -p 8080:8080 \
  -e GOOGLE_MAPS_API_KEY="your_api_key_here" \
  --name gmap-buddy-container \
  gmap-buddy
```

#### Option B: Local Development
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install and build frontend
cd adk-ui
npm install
npm run build
cd ..

# Start the application
python -m gmap_buddy.main
```

Your GMap-Buddy will be available at `http://localhost:8080`


## 📖 Usage

### Chat Interface

GMap-Buddy provides a conversational interface where you can naturally describe your travel needs:

```
👋 Hi! I'm your road trip planning assistant. Where would you like to start your journey?

User: I want to plan a 3-day road trip from San Francisco to Los Angeles via Big Sur

🗺️ Great choice! That's one of the most scenic routes on the West Coast. Let me help you plan this amazing trip...
```

### Conversation Flow

The AI assistant follows a structured approach:

1. **Starting Point** - Where your journey begins
2. **Destination** - Where you're heading (with scenic route options)
3. **Duration** - How many days you have available
4. **Preferences** - Travel style, budget, interests, pets, dietary needs
5. **Custom Itinerary** - Personalized recommendations with weather and packing advice


## 🛠️ Configuration

### Environment Variables

```bash
# Required
GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional
PORT=8080                    # Server port (default: 8080)
GOOGLE_ADK_MODEL=gemini-2.0-flash  # AI model to use
```

### Google Maps API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain/IP for security

![Technical Architecture](Images/Tech-Diagram.png)
*Technical architecture showing the integration between Google ADK, MCP tools, and Maps APIs*

## 📁 Project Structure

![Data Pipeline](Images/DataPipelineDiagram.png)
*Data flow diagram showing how user inputs are processed through the AI agent and MCP tools*

```
GMap-Buddy/
├── 📁 gmap-buddy/           # Python backend
│   ├── agent.py            # Google ADK AI agent configuration
│   ├── main.py             # FastAPI web server
│   ├── prompt.py           # AI prompts and conversation flow
│   └── __init__.py
├── 📁 adk-ui/              # Next.js frontend
│   ├── app/                # Next.js 14 app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   ├── globals.css     # Global styles
│   │   └── api/            # API routes
│   │       └── adk/        # ADK integration endpoints
│   ├── components/         # React components
│   │   ├── chat/           # Chat interface components
│   │   ├── session/        # Session management
│   │   ├── sidebar/        # Navigation sidebar
│   │   ├── ui/             # UI components (buttons, inputs, etc.)
│   │   └── voice/          # Voice controls
│   ├── lib/                # Utility libraries
│   │   ├── adk-service.ts  # ADK service integration
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript definitions
├── 📁 Images/              # Documentation images
│   ├── UI.png             # User interface screenshot
│   ├── Tech-Diagram.png   # Technical architecture
│   ├── DataPipelineDiagram.png  # Data flow diagram
│   ├── SequenceDiagram.png     # Sequence diagram
│   └── mcp_map_tools.png       # MCP tools overview
├── 📄 Dockerfile          # Container configuration
├── 📄 requirements.txt    # Python dependencies
├── 📄 README.md          # This file
└── 📄 .gitignore         # Git ignore rules
```

![Sequence Diagram](Images/SequenceDiagram.png)
*Sequence diagram illustrating the interaction flow between user, frontend, backend, and Google Maps APIs*

## 🧪 Development & Testing

### Local Development

```bash
# Backend development
cd gmap-buddy
python -m pip install -r ../requirements.txt
python main.py

# Frontend development (separate terminal)
cd adk-ui
npm install
npm run dev
```

### Building the Frontend

```bash
cd adk-ui
npm run build    # Creates optimized production build
npm run start    # Serves the production build
```

### Testing API Endpoints

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test chat functionality
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to plan a weekend trip from New York to Boston"
  }'
```

### Docker Development

```bash
# Build development image
docker build -t gmap-buddy:dev .

# Run with volume mounting for development
docker run -d \
  -p 8080:8080 \
  -e GOOGLE_MAPS_API_KEY="your_api_key" \
  -v $(pwd):/app \
  gmap-buddy:dev
```

## 🔧 Architecture & Technology Stack

### Core Technologies

- **🤖 Google ADK (Agent Development Kit)** - AI agent framework
- **🗺️ Model Context Protocol (MCP)** - Tool integration protocol
- **⚡ FastAPI** - High-performance Python web framework
- **⚛️ Next.js 14** - React framework with App Router
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **� Docker** - Containerization platform
- **☁️ Google Cloud Run** - Serverless container platform

### Key Components

1. **AI Agent (`agent.py`)**
   - Powered by Gemini 2.0 Flash model
   - Integrates MCP tools for Maps functionality
   - Handles conversational flow and context management

2. **FastAPI Backend (`main.py`)**
   - RESTful API endpoints
   - Health checks for deployment
   - Static file serving for frontend

3. **Next.js Frontend (`adk-ui/`)**
   - Modern React application
   - Real-time chat interface
   - Responsive design with Tailwind CSS

4. **MCP Integration**
   - Google Maps server via npm package
   - Seamless tool calling from AI agent
   - Extensible architecture for additional tools

### Data Flow

```
User Input → Next.js UI → FastAPI → Google ADK Agent → MCP Tools → Google Maps API → Response
```

## 🤝 Contributing

We welcome contributions to make GMap-Buddy even better! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports** - Found an issue? Let us know!
- 💡 **Feature Requests** - Have ideas for new features?
- 📖 **Documentation** - Help improve our docs
- 🔧 **Code Contributions** - Submit pull requests
- 🧪 **Testing** - Help us test on different platforms

### Development Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation
4. **Test your changes**
   ```bash
   # Test backend
   python -m gmap_buddy.main
   
   # Test frontend
   cd adk-ui && npm run build
   ```
5. **Submit a pull request**

### Code Style

- **Python**: Follow PEP 8 guidelines
- **TypeScript/React**: Use ESLint and Prettier
- **Commit Messages**: Use conventional commits format

### Getting Help

- 📫 **Issues**: [GitHub Issues](https://github.com/Yash-Kavaiya/GMap-Buddy/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Yash-Kavaiya/GMap-Buddy/discussions)

### Performance Tips

- **API Optimization**: The MCP integration handles caching automatically
- **Rate Limiting**: Google Maps APIs have rate limits - the agent respects these
- **Memory Usage**: The Docker container is optimized for memory efficiency
- **Scaling**: Use Cloud Run for automatic scaling based on traffic

## �️ Roadmap

### 🎯 Short Term (Q1 2025)
- [ ] **Enhanced Voice Controls** - Voice input for hands-free planning
- [ ] **Offline Mode** - Basic functionality without internet
- [ ] **Multi-language Support** - Spanish, French, German support
- [ ] **Mobile App** - React Native mobile application

### 🚀 Medium Term (Q2-Q3 2025)
- [ ] **Real-time Traffic Integration** - Live traffic-aware routing
- [ ] **Weather API Integration** - More detailed weather forecasting
- [ ] **Social Features** - Share itineraries with friends
- [ ] **AI Photo Analysis** - Upload photos to get location recommendations

### 🌟 Long Term (Q4 2025+)
- [ ] **Custom Map Styling** - Personalized map themes
- [ ] **AR Integration** - Augmented reality navigation features
- [ ] **Booking Integration** - Direct hotel/restaurant reservations
- [ ] **Group Trip Planning** - Collaborative trip planning
- [ ] **IoT Integration** - Smart car and device connectivity

### 🛠️ Technical Improvements
- [ ] **Performance Optimization** - Faster response times
- [ ] **Kubernetes Support** - Advanced container orchestration
- [ ] **GraphQL API** - More flexible API queries
- [ ] **WebSocket Support** - Real-time updates
- [ ] **Analytics Dashboard** - Usage insights and metrics

## �📞 Contact & Support

### 👨‍💻 Author
**Yash Kavaiya**
- 🐙 **GitHub**: [@Yash-Kavaiya](https://github.com/Yash-Kavaiya)
- 🔗 **LinkedIn**: [Yash Kavaiya](https://linkedin.com/in/yash-kavaiya)
- 📧 **Email**: yash.kavaiya@example.com

### 🆘 Get Help
- 📋 **Issues**: [Report bugs or request features](https://github.com/Yash-Kavaiya/GMap-Buddy/issues)
- 💬 **Discussions**: [Community discussions](https://github.com/Yash-Kavaiya/GMap-Buddy/discussions)
- 📖 **Documentation**: [Wiki & Guides](https://github.com/Yash-Kavaiya/GMap-Buddy/wiki)

### 🌐 Project Links
- 🏠 **Homepage**: [GMap-Buddy](https://github.com/Yash-Kavaiya/GMap-Buddy)
- 📦 **Releases**: [Latest releases](https://github.com/Yash-Kavaiya/GMap-Buddy/releases)
- 🎯 **Project Board**: [Development progress](https://github.com/Yash-Kavaiya/GMap-Buddy/projects)

---

<div align="center">

### ⭐ **Star this repository if you find it helpful!** ⭐

**Made with ❤️ by [Yash Kavaiya](https://github.com/Yash-Kavaiya)**

*Ready to plan your next adventure? Let GMap-Buddy be your AI travel companion! 🚗✨*

</div>