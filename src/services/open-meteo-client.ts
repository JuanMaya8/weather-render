import type { City } from '@/domain/types';
import { HttpClient } from './http-client';

const TIMEZONE = 'America/Bogota';

export interface RawForecast {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    surface_pressure: number;
    precipitation: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: (number | null)[];
  };
}

export interface RawAirQuality {
  current: { us_aqi: number | null; pm2_5: number | null; pm10: number | null };
}

export interface RawArchive {
  daily: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
  };
}

export class OpenMeteoClient {
  constructor(private readonly http: HttpClient) {}

  fetchForecast(city: City, init: RequestInit): Promise<RawForecast> {
    const query = this.buildQuery(city, {
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,precipitation,weather_code',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
      forecast_days: '7',
    });
    return this.http.getJson(`https://api.open-meteo.com/v1/forecast?${query}`, init);
  }

  fetchAirQuality(city: City, init: RequestInit): Promise<RawAirQuality> {
    const query = this.buildQuery(city, { current: 'us_aqi,pm2_5,pm10' });
    return this.http.getJson(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${query}`,
      init,
    );
  }

  fetchArchive(city: City, year: number, init: RequestInit): Promise<RawArchive> {
    const query = this.buildQuery(city, {
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    });
    return this.http.getJson(`https://archive-api.open-meteo.com/v1/archive?${query}`, init);
  }

  private buildQuery(city: City, extra: Record<string, string>): string {
    return new URLSearchParams({
      latitude: String(city.latitude),
      longitude: String(city.longitude),
      timezone: TIMEZONE,
      ...extra,
    }).toString();
  }
}
