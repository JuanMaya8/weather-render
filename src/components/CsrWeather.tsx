'use client';

import { useEffect, useState } from 'react';
import type { City, WeatherSnapshot } from '@/domain/types';
import { formatTime } from '@/lib/format';
import { createWeatherService } from '@/services/weather-service';
import WeatherDashboard from './WeatherDashboard';

type ViewState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; snapshot: WeatherSnapshot; updatedAt: string };

const REFRESH_INTERVAL_MS = 60_000;

export default function CsrWeather({ city }: { city: City }) {
  const [state, setState] = useState<ViewState>({ status: 'loading' });

  useEffect(() => {
    const service = createWeatherService('csr');
    let active = true;

    const load = async () => {
      try {
        const snapshot = await service.getSnapshot(city);
        if (active) setState({ status: 'ready', snapshot, updatedAt: formatTime(new Date()) });
      } catch {
        if (active) {
          setState((previous) => (previous.status === 'ready' ? previous : { status: 'error' }));
        }
      }
    };

    load();
    const timer = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [city]);

  if (state.status === 'loading') {
    return <div className="skeleton" aria-busy="true">Loading weather in your browser</div>;
  }
  if (state.status === 'error') {
    return <p className="notice">Open-Meteo could not be reached. Check your connection and reload.</p>;
  }

  return (
    <>
      <p className="muted">Fetched in your browser at {state.updatedAt}. It refreshes every 60 seconds.</p>
      <WeatherDashboard snapshot={state.snapshot} />
    </>
  );
}
