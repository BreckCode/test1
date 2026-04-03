const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Users must provide their own OpenWeatherMap API key
// Sign up free at https://openweathermap.org/api
const API_KEY = 'YOUR_API_KEY_HERE';

function isApiKeySet() {
  return API_KEY !== 'YOUR_API_KEY_HERE' && API_KEY.length > 0;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Weather API error (${response.status}): ${errorBody}`);
  }
  return response.json();
}

export async function getCurrentWeather(lat, lon) {
  if (!isApiKeySet()) {
    return getMockCurrentWeather();
  }
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJson(url);
}

export async function getForecast(lat, lon) {
  if (!isApiKeySet()) {
    return getMockForecast();
  }
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJson(url);
}

export async function searchCities(query) {
  if (!isApiKeySet()) {
    return getMockCities(query);
  }
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  return fetchJson(url);
}

export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

export function formatTemp(temp, unit = 'C') {
  if (unit === 'F') {
    return `${Math.round(temp * 9 / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getDayName(timestamp) {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getTimeString(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── Mock data for demo mode (no API key) ────────────────────────────

function getMockCurrentWeather() {
  return {
    name: 'San Francisco',
    sys: { country: 'US', sunrise: Math.floor(Date.now() / 1000) - 21600, sunset: Math.floor(Date.now() / 1000) + 21600 },
    main: { temp: 18, feels_like: 16, temp_min: 14, temp_max: 22, humidity: 72, pressure: 1013 },
    weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
    wind: { speed: 5.2, deg: 240 },
    clouds: { all: 40 },
    visibility: 10000,
    coord: { lat: 37.7749, lon: -122.4194 },
    dt: Math.floor(Date.now() / 1000),
  };
}

function getMockForecast() {
  const now = Math.floor(Date.now() / 1000);
  const conditions = [
    { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
    { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
    { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
    { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
  ];

  const list = [];
  for (let i = 0; i < 40; i++) {
    const dayIndex = Math.floor(i / 8);
    const baseTemp = 16 + dayIndex * 1.5;
    const hourOffset = (i % 8) * 3;
    const tempVariation = hourOffset >= 9 && hourOffset <= 15 ? 4 : -2;

    list.push({
      dt: now + i * 10800,
      main: {
        temp: baseTemp + tempVariation + Math.random() * 3,
        feels_like: baseTemp + tempVariation - 1,
        temp_min: baseTemp - 2,
        temp_max: baseTemp + 5,
        humidity: 60 + Math.floor(Math.random() * 25),
        pressure: 1010 + Math.floor(Math.random() * 10),
      },
      weather: [conditions[dayIndex % conditions.length]],
      wind: { speed: 3 + Math.random() * 6, deg: Math.floor(Math.random() * 360) },
      pop: Math.random() * 0.5,
      dt_txt: new Date((now + i * 10800) * 1000).toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  return { list, city: { name: 'San Francisco', country: 'US' } };
}

function getMockCities(query) {
  const cities = [
    { name: 'New York', country: 'US', state: 'New York', lat: 40.7128, lon: -74.006 },
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', country: 'AU', state: 'New South Wales', lat: -33.8688, lon: 151.2093 },
    { name: 'Los Angeles', country: 'US', state: 'California', lat: 34.0522, lon: -118.2437 },
    { name: 'Berlin', country: 'DE', lat: 52.52, lon: 13.405 },
    { name: 'Mumbai', country: 'IN', state: 'Maharashtra', lat: 19.076, lon: 72.8777 },
  ];

  const lowerQuery = query.toLowerCase();
  return cities.filter((c) => c.name.toLowerCase().includes(lowerQuery)).slice(0, 5);
}
