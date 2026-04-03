// Background gradients based on weather condition and time of day
export function getWeatherGradient(weatherId, icon) {
  const isNight = icon?.endsWith('n');

  if (isNight) {
    return ['#0f2027', '#203a43', '#2c5364'];
  }

  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) {
    // Thunderstorm
    return ['#373B44', '#4286f4', '#373B44'];
  }
  if (weatherId >= 300 && weatherId < 400) {
    // Drizzle
    return ['#606c88', '#3f4c6b'];
  }
  if (weatherId >= 500 && weatherId < 600) {
    // Rain
    return ['#4b6cb7', '#182848'];
  }
  if (weatherId >= 600 && weatherId < 700) {
    // Snow
    return ['#E6DADA', '#274046'];
  }
  if (weatherId >= 700 && weatherId < 800) {
    // Atmosphere (fog, mist, etc.)
    return ['#757F9A', '#D7DDE8'];
  }
  if (weatherId === 800) {
    // Clear
    return ['#2980B9', '#6DD5FA', '#FFFFFF'];
  }
  if (weatherId > 800) {
    // Cloudy
    return ['#bdc3c7', '#2c3e50'];
  }

  return ['#4A90D9', '#357ABD', '#2E6BA6'];
}

export function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm-outline';
  if (weatherId >= 300 && weatherId < 400) return 'rainy-outline';
  if (weatherId >= 500 && weatherId < 600) return 'rainy-outline';
  if (weatherId >= 600 && weatherId < 700) return 'snow-outline';
  if (weatherId >= 700 && weatherId < 800) return 'cloud-outline';
  if (weatherId === 800) return 'sunny-outline';
  if (weatherId > 800) return 'cloudy-outline';
  return 'partly-sunny-outline';
}
