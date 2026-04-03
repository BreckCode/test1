import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { formatTemp } from '../services/weatherApi';

export default function HourlyForecast({ data, unit }) {
  if (!data?.list) return null;

  // Show next 24 hours (8 items at 3-hour intervals)
  const hourlyItems = data.list.slice(0, 8);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {hourlyItems.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const hour = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          const condition = item.weather[0];

          return (
            <View key={item.dt} style={styles.hourItem}>
              <Text style={styles.hourText}>{index === 0 ? 'Now' : hour}</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${condition.icon}@2x.png` }}
                style={styles.icon}
              />
              <Text style={styles.tempText}>{formatTemp(item.main.temp, unit)}</Text>
              {item.pop > 0.1 && (
                <Text style={styles.popText}>{Math.round(item.pop * 100)}%</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 20,
  },
  hourItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 10,
    minWidth: 68,
  },
  hourText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  icon: {
    width: 44,
    height: 44,
    marginVertical: 4,
  },
  tempText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  popText: {
    fontSize: 11,
    color: '#74b9ff',
    marginTop: 2,
  },
});
