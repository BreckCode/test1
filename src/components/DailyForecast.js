import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { formatTemp, getDayName } from '../services/weatherApi';

export default function DailyForecast({ data, unit }) {
  if (!data?.list) return null;

  // Group forecast by day and compute daily min/max
  const dailyMap = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[date]) {
      dailyMap[date] = {
        dt: item.dt,
        temps: [],
        weather: item.weather[0],
        pop: 0,
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].pop = Math.max(dailyMap[date].pop, item.pop || 0);
    // Use midday weather icon if available
    const hour = new Date(item.dt * 1000).getHours();
    if (hour >= 11 && hour <= 14) {
      dailyMap[date].weather = item.weather[0];
    }
  });

  const dailyForecasts = Object.values(dailyMap).slice(0, 5);

  // Find global min/max for bar scaling
  const allTemps = dailyForecasts.flatMap((d) => d.temps);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      {dailyForecasts.map((day) => {
        const dayMin = Math.min(...day.temps);
        const dayMax = Math.max(...day.temps);
        const leftPct = ((dayMin - globalMin) / range) * 100;
        const widthPct = ((dayMax - dayMin) / range) * 100;

        return (
          <View key={day.dt} style={styles.dayRow}>
            <Text style={styles.dayName}>{getDayName(day.dt)}</Text>

            <View style={styles.iconAndPop}>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png` }}
                style={styles.icon}
              />
              {day.pop > 0.2 && <Text style={styles.popText}>{Math.round(day.pop * 100)}%</Text>}
            </View>

            <Text style={styles.tempLow}>{formatTemp(dayMin, unit)}</Text>

            {/* Temperature range bar */}
            <View style={styles.barContainer}>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 8)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.tempHigh}>{formatTemp(dayMax, unit)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dayName: {
    width: 60,
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  iconAndPop: {
    width: 55,
    alignItems: 'center',
  },
  icon: {
    width: 34,
    height: 34,
  },
  popText: {
    fontSize: 10,
    color: '#74b9ff',
    marginTop: -4,
  },
  tempLow: {
    width: 44,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  barBackground: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#ffa726',
  },
  tempHigh: {
    width: 44,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'left',
  },
});
