import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [unit, setUnit] = useState('C');

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon),
      ]);
      setCurrentWeather(weather);
      setForecast(forecastData);
      setLocation({ lat, lon });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLocationWeather = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fall back to default location (San Francisco)
        await fetchWeather(37.7749, -122.4194);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await fetchWeather(loc.coords.latitude, loc.coords.longitude);
    } catch {
      // Fall back to default
      await fetchWeather(37.7749, -122.4194);
    }
  }, [fetchWeather]);

  const selectCity = useCallback(
    async (lat, lon) => {
      await fetchWeather(lat, lon);
    },
    [fetchWeather]
  );

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const refresh = useCallback(() => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    } else {
      loadLocationWeather();
    }
  }, [location, fetchWeather, loadLocationWeather]);

  useEffect(() => {
    loadLocationWeather();
  }, [loadLocationWeather]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    toggleUnit,
    refresh,
    selectCity,
  };
}
