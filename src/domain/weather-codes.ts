// WMO weather interpretation codes used by Open-Meteo.
export interface SkyDescription {
  label: string;
  icon: string;
}

export function describeWeather(code: number): SkyDescription {
  if (code === 0) return { label: 'Clear sky', icon: '☀️' };
  if (code <= 2) return { label: 'Partly cloudy', icon: '⛅' };
  if (code === 3) return { label: 'Overcast', icon: '☁️' };
  if (code === 45 || code === 48) return { label: 'Fog', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: '🌦️' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { label: 'Rain', icon: '🌧️' };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { label: 'Snow', icon: '🌨️' };
  }
  if (code >= 95) return { label: 'Thunderstorm', icon: '⛈️' };
  return { label: 'Unknown', icon: '🌡️' };
}

export function describeAirQuality(usAqi: number): string {
  if (usAqi <= 50) return 'Good';
  if (usAqi <= 100) return 'Moderate';
  if (usAqi <= 150) return 'Unhealthy for sensitive groups';
  if (usAqi <= 200) return 'Unhealthy';
  return 'Very unhealthy';
}
