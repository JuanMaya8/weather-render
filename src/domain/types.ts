export type RenderPattern = 'csr' | 'ssr' | 'ssg' | 'isr';

export interface City {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface CurrentConditions {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  precipitation: number;
  weatherCode: number;
}

export interface AirQuality {
  usAqi: number | null;
  pm25: number | null;
  pm10: number | null;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
  rain: number;
  rainProbability: number | null;
}

export interface WeatherSnapshot {
  current: CurrentConditions;
  air: AirQuality;
  daily: DailyForecast[];
}

export interface MonthlyClimate {
  month: number; // 0 = January
  avgMax: number;
  avgMin: number;
  totalRain: number;
}
