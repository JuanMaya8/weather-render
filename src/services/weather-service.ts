import type { City, MonthlyClimate, RenderPattern, WeatherSnapshot } from '@/domain/types';
import { fetchStrategies } from './fetch-strategies';
import { HttpClient } from './http-client';
import { OpenMeteoClient } from './open-meteo-client';
import { WeatherMapper } from './weather-mapper';

// Facade: the UI only talks to this class, never to raw HTTP.
export class WeatherService {
  constructor(
    private readonly client: OpenMeteoClient,
    private readonly requestInit: RequestInit,
  ) {}

  async getSnapshot(city: City): Promise<WeatherSnapshot> {
    const [forecast, air] = await Promise.all([
      this.client.fetchForecast(city, this.requestInit),
      // Air quality is a nice extra: if it fails, the rest of the page still renders.
      this.client.fetchAirQuality(city, this.requestInit).catch(() => null),
    ]);
    return WeatherMapper.toSnapshot(forecast, air);
  }

  async getClimate(city: City, year: number): Promise<MonthlyClimate[]> {
    const archive = await this.client.fetchArchive(city, year, this.requestInit);
    return WeatherMapper.toMonthlyClimate(archive);
  }
}

// Factory: builds a service wired with the fetch strategy of the given pattern.
export function createWeatherService(pattern: RenderPattern): WeatherService {
  return new WeatherService(new OpenMeteoClient(new HttpClient()), fetchStrategies[pattern]);
}
