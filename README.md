# Google Maps AI - Sync your journey to your beat, powered by Gemini 2.0 Flash AI 🗺️

A comprehensive Google Maps integration tool that enhances your mapping experience with advanced features and seamless functionality.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/downloads/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Yash-Kavaiya/GMap-Buddy/issues)

## 🌟 Overview

Google Maps AI is a powerful tool designed to simplify and enhance Google Maps integration in your applications. Whether you're building location-based services, route optimization systems, or geographic data visualization tools, GMap-Buddy provides the essential features you need.

## ✨ Features

- **Easy Google Maps API Integration** - Simplified wrapper for Google Maps services
- **Location Search & Geocoding** - Convert addresses to coordinates and vice versa
- **Route Planning** - Calculate optimal routes between multiple points
- **Distance & Duration Calculations** - Get accurate travel time and distance estimates
- **Place Details & Information** - Retrieve comprehensive information about places
- **Map Visualization** - Create interactive maps with custom markers and overlays
- **Batch Processing** - Handle multiple location queries efficiently
- **Error Handling** - Robust error management for API failures

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Google Maps API Key ([Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key))
- pip package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yash-Kavaiya/GMap-Buddy.git
cd GMap-Buddy
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up your environment variables:
```bash
cp .env.example .env
# Edit .env and add your Google Maps API key
# Edit .env and add your Google Maps API key
```

## 📖 Usage

### Basic Example

```python
from gmap_buddy import Google Maps AI

# Initialize with your API key
gmaps = Google Maps AI(api_key="YOUR_API_KEY")

# Search for a location
location = gmaps.search_place("Eiffel Tower, Paris")
print(f"Coordinates: {location.latitude}, {location.longitude}")

# Get directions
route = gmaps.get_directions(
    origin="New York, NY",
    destination="Washington, DC"
)
print(f"Distance: {route.distance}")
print(f"Duration: {route.duration}")
```

### Advanced Features

```python
# Batch geocoding
addresses = [
    "1600 Amphitheatre Parkway, Mountain View, CA",
    "1 Infinite Loop, Cupertino, CA",
    "1 Microsoft Way, Redmond, WA"
]
locations = gmaps.batch_geocode(addresses)

# Find nearby places
nearby_restaurants = gmaps.find_nearby(
    location=(37.7749, -122.4194),
    place_type="restaurant",
    radius=1000
)

# Calculate distance matrix
origins = ["San Francisco, CA", "Los Angeles, CA"]
destinations = ["Las Vegas, NV", "Phoenix, AZ"]
matrix = gmaps.distance_matrix(origins, destinations)
```

## 🛠️ Configuration

Create a `.env` file in the project root:

```env
GOOGLE_MAPS_API_KEY=your_api_key_here
DEFAULT_LANGUAGE=en
DEFAULT_REGION=US
CACHE_ENABLED=true
CACHE_TTL=3600
```

## 📁 Project Structure

```
GMap-Buddy/
├── adk-ui/                  # ADK UI components
├── gmap-buddy/              # Core GMap-Buddy implementation
├── my_sample_agent/         # Sample agent implementation
├── src/
│   ├── __init__.py
│   ├── gmap_buddy.py
│   ├── utils/
│   │   ├── validators.py
│   │   ├── formatters.py
│   │   └── cache.py
│   └── models/
│       ├── location.py
│       ├── route.py
│       └── place.py
├── tests/
│   ├── test_geocoding.py
│   ├── test_routing.py
│   └── test_places.py
├── examples/
│   ├── basic_usage.py
│   ├── batch_processing.py
│   └── visualization.py
├── docs/
│   ├── installation.md
│   ├── api_reference.md
│   └── examples.md
├── requirements.txt
├── setup.py
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test file
pytest tests/test_geocoding.py
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

For detailed API documentation, please refer to our [API Reference](docs/api_reference.md).

### Core Methods

- `search_place(query)` - Search for a place by name or address
- `geocode(address)` - Convert address to coordinates
- `reverse_geocode(lat, lng)` - Convert coordinates to address
- `get_directions(origin, destination)` - Get route between two points
- `find_nearby(location, place_type, radius)` - Find nearby places
- `get_place_details(place_id)` - Get detailed information about a place

## 🔧 Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your API key is valid and has the necessary APIs enabled
   - Check if you've exceeded your quota limits

2. **Installation Problems**
   - Make sure you're using Python 3.8+
   - Try upgrading pip: `pip install --upgrade pip`

3. **Import Errors**
   - Verify all dependencies are installed: `pip install -r requirements.txt`

## 📊 Performance

- Implements intelligent caching to reduce API calls
- Batch processing support for handling multiple requests efficiently
- Asynchronous operations for improved performance (coming soon)

## 🗺️ Roadmap

- [ ] Add support for Google Maps JavaScript API
- [ ] Implement real-time traffic data integration
- [ ] Add support for custom map styling
- [ ] Create CLI tool for quick operations
- [ ] Add support for more languages
- [ ] Implement webhook support for place updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps Platform for providing the APIs
- All contributors who have helped improve this project
- The open-source community for inspiration and support

## 📞 Contact

**Yash Kavaiya** - [@YashKavaiya](https://github.com/Yash-Kavaiya)

Project Link: [https://github.com/Yash-Kavaiya/GMap-Buddy](https://github.com/Yash-Kavaiya/GMap-Buddy)

---

⭐ Star this repository if you find it helpful!

Made with ❤️ by Yash Kavaiya
