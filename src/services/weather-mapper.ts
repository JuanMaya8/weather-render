import type { MonthlyClimate, WeatherSnapshot } from '@/domain/types';
import type { RawAirQuality, RawArchive, RawForecast } from './open-meteo-client';

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Adapter: raw Open-Meteo payloads -> domain models.
export class WeatherMapper {
  static toSnapshot(forecast: RawForecast, air: RawAirQuality | null): WeatherSnapshot {
    const { current, daily } = forecast;
    return {
      current: {
        time: current.time,
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        pressure: current.surface_pressure,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
      },
      air: {
        usAqi: air?.current.us_aqi ?? null,
        pm25: air?.current.pm2_5 ?? null,
        pm10: air?.current.pm10 ?? null,
      },
      daily: daily.time.map((date, index) => ({
        date,
        weatherCode: daily.weather_code[index],
        max: daily.temperature_2m_max[index],
        min: daily.temperature_2m_min[index],
        rain: daily.precipitation_sum[index],
        rainProbability: daily.precipitation_probability_max[index] ?? null,
      })),
    };
  }

  static toMonthlyClimate(archive: RawArchive): MonthlyClimate[] {
    const { time, temperature_2m_max: max, temperature_2m_min: min, precipitation_sum: rain } =
      archive.daily;
    const buckets = Array.from({ length: 12 }, () => ({
      max: [] as number[],
      min: [] as number[],
      rain: 0,
    }));

    time.forEach((date, index) => {
      const bucket = buckets[Number(date.slice(5, 7)) - 1];
      const dayMax = max[index];
      const dayMin = min[index];
      const dayRain = rain[index];
      if (dayMax !== null) bucket.max.push(dayMax);
      if (dayMin !== null) bucket.min.push(dayMin);
      if (dayRain !== null) bucket.rain += dayRain;
    });

    return buckets.map((bucket, month) => ({
      month,
      avgMax: average(bucket.max),
      avgMin: average(bucket.min),
      totalRain: bucket.rain,
    }));
  }
}
