# Weather Mobile App

A React Native (Expo) weather app with real-time weather data, hourly and 5-day forecasts, city search, and dynamic weather-themed backgrounds.

## Features

- **Current Weather** - Temperature, humidity, wind, pressure, visibility, sunrise/sunset
- **Hourly Forecast** - 24-hour forecast with 3-hour intervals
- **5-Day Forecast** - Daily high/low with visual temperature bars
- **City Search** - Search and select any city worldwide
- **GPS Location** - Auto-detect your location on launch
- **Dynamic Backgrounds** - Gradient backgrounds that change based on weather conditions and time of day
- **Unit Toggle** - Switch between Celsius and Fahrenheit
- **Pull to Refresh** - Swipe down to refresh weather data
- **Demo Mode** - Works out of the box with mock data (no API key required to preview)

## Screenshots

The app displays a clean, modern weather interface with:
- Large temperature display with weather icon
- 6 detail cards (humidity, wind, visibility, pressure, sunrise, sunset)
- Horizontally scrolling hourly forecast
- 5-day forecast with temperature range bars

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on devices

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with the Expo Go app

### API Key Setup (Optional)

The app works in demo mode with mock data. For live weather data:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the project root:

```
EXPO_PUBLIC_WEATHER_API_KEY=your_actual_api_key
```

The free tier includes 1,000 API calls/day, which is plenty for personal use.

## Project Structure

```
├── App.js                          # App entry point
├── src/
│   ├── components/
│   │   ├── CurrentWeather.js       # Main weather display
│   │   ├── DailyForecast.js        # 5-day forecast
│   │   ├── HourlyForecast.js       # Hourly forecast scroll
│   │   └── SearchBar.js            # City search with autocomplete
│   ├── hooks/
│   │   └── useWeather.js           # Weather data management hook
│   ├── screens/
│   │   └── HomeScreen.js           # Main screen layout
│   ├── services/
│   │   └── weatherApi.js           # API layer + mock data
│   └── utils/
│       └── gradients.js            # Weather-based gradient colors
├── app.json                        # Expo configuration
└── package.json
```

## Tech Stack

- **React Native** with **Expo** SDK 50
- **OpenWeatherMap API** for weather data
- **expo-location** for GPS
- **expo-linear-gradient** for dynamic backgrounds
- **@expo/vector-icons** (Ionicons) for icons
