import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { CLIMATE_YEAR, findCity } from '@/config/cities';
import { formatTime } from '@/lib/format';
import { createWeatherService } from '@/services/weather-service';
import ClimateChart from './ClimateChart';
import PageFrame from './PageFrame';
import WeatherDashboard from './WeatherDashboard';

interface ServerViewProps {
  pattern: 'ssr' | 'ssg' | 'isr';
  slug: string;
}

// Shared by the three patterns that render on the server. What changes between them
// is the route configuration (see the page files) and the fetch strategy.
export default async function ServerView({ pattern, slug }: ServerViewProps) {
  const city = findCity(slug);
  if (!city) notFound();

  const service = createWeatherService(pattern);
  let body: ReactNode;

  try {
    body =
      pattern === 'ssg' ? (
        <ClimateChart months={await service.getClimate(city, CLIMATE_YEAR)} />
      ) : (
        <WeatherDashboard snapshot={await service.getSnapshot(city)} />
      );
  } catch {
    body = <p className="notice">Open-Meteo could not be reached. Try again in a moment.</p>;
  }

  return (
    <PageFrame pattern={pattern} city={city} renderedAt={formatTime(new Date())}>
      {body}
    </PageFrame>
  );
}
