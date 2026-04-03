import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../hooks/useWeather';
import { getWeatherGradient } from '../utils/gradients';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';

export default function HomeScreen() {
  const { currentWeather, forecast, loading, error, unit, toggleUnit, refresh, selectCity } =
    useWeather();

  const weatherId = currentWeather?.weather?.[0]?.id;
  const weatherIcon = currentWeather?.weather?.[0]?.icon;
  const gradient = getWeatherGradient(weatherId, weatherIcon);

  if (loading && !currentWeather) {
    return (
      <LinearGradient colors={['#4A90D9', '#357ABD', '#2E6BA6']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Fetching weather...</Text>
      </LinearGradient>
    );
  }

  if (error && !currentWeather) {
    return (
      <LinearGradient colors={['#4A90D9', '#357ABD', '#2E6BA6']} style={styles.loadingContainer}>
        <Ionicons name="cloud-offline-outline" size={64} color="rgba(255,255,255,0.7)" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={refresh} style={styles.headerButton}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weather</Text>
        <TouchableOpacity onPress={toggleUnit} style={styles.headerButton}>
          <Text style={styles.unitToggle}>{unit === 'C' ? '°F' : '°C'}</Text>
        </TouchableOpacity>
      </View>

      <SearchBar onSelectCity={selectCity} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#fff" />
        }
      >
        <CurrentWeather data={currentWeather} unit={unit} />
        <HourlyForecast data={forecast} unit={unit} />
        <DailyForecast data={forecast} unit={unit} />

        {/* Demo mode notice */}
        <View style={styles.demoNotice}>
          <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.4)" />
          <Text style={styles.demoText}>
            Using demo data. Add your OpenWeatherMap API key in weatherApi.js for live data.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  unitToggle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 30,
  },
  demoText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginLeft: 6,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
