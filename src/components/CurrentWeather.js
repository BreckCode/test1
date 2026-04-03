import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTemp, getWindDirection, getTimeString } from '../services/weatherApi';

export default function CurrentWeather({ data, unit }) {
  if (!data) return null;

  const { main, weather, wind, sys, name, visibility, clouds } = data;
  const condition = weather[0];

  return (
    <View style={styles.container}>
      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={20} color="#fff" />
        <Text style={styles.locationText}>
          {name}, {sys.country}
        </Text>
      </View>

      {/* Main temperature */}
      <View style={styles.tempSection}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${condition.icon}@4x.png` }}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperature}>{formatTemp(main.temp, unit)}</Text>
      </View>

      {/* Condition description */}
      <Text style={styles.description}>
        {condition.description.charAt(0).toUpperCase() + condition.description.slice(1)}
      </Text>

      {/* Feels like + min/max */}
      <Text style={styles.feelsLike}>
        Feels like {formatTemp(main.feels_like, unit)}  |  H: {formatTemp(main.temp_max, unit)}  L:{' '}
        {formatTemp(main.temp_min, unit)}
      </Text>

      {/* Detail cards */}
      <View style={styles.detailsGrid}>
        <DetailCard icon="water-outline" label="Humidity" value={`${main.humidity}%`} />
        <DetailCard
          icon="speedometer-outline"
          label="Wind"
          value={`${Math.round(wind.speed)} m/s ${getWindDirection(wind.deg)}`}
        />
        <DetailCard icon="eye-outline" label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} />
        <DetailCard icon="barometer-outline" label="Pressure" value={`${main.pressure} hPa`} />
        <DetailCard icon="sunny-outline" label="Sunrise" value={getTimeString(sys.sunrise)} />
        <DetailCard icon="moon-outline" label="Sunset" value={getTimeString(sys.sunset)} />
      </View>
    </View>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <View style={styles.detailCard}>
      <Ionicons name={icon} size={22} color="rgba(255,255,255,0.8)" />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -10,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '200',
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  detailCard: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
});
