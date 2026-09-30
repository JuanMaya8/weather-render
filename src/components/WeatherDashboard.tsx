import type { WeatherSnapshot } from '@/domain/types';
import { describeAirQuality, describeWeather } from '@/domain/weather-codes';

function formatDay(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
  });
}

export default function WeatherDashboard({ snapshot }: { snapshot: WeatherSnapshot }) {
  const { current, air, daily } = snapshot;
  const sky = describeWeather(current.weatherCode);

  const details: [string, string][] = [
    ['Feels like', `${current.feelsLike.toFixed(1)} °C`],
    ['Humidity', `${current.humidity}%`],
    ['Wind', `${current.windSpeed.toFixed(1)} km/h`],
    ['Pressure', `${Math.round(current.pressure)} hPa`],
    ['Rain right now', `${current.precipitation} mm`],
    [
      'Air quality',
      air.usAqi === null ? 'Not available' : `AQI ${air.usAqi}, ${describeAirQuality(air.usAqi)}`,
    ],
  ];

  return (
    <section>
      <div className="hero">
        <span className="hero__icon" aria-hidden="true">{sky.icon}</span>
        <div>
          <p className="hero__temp">{current.temperature.toFixed(1)} °C</p>
          <p>{sky.label}</p>
          <p className="muted">Observed {current.time.replace('T', ' at ')} local time</p>
        </div>
      </div>

      <dl className="details">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="forecast">
        {daily.map((day) => (
          <li key={day.date}>
            <span>{formatDay(day.date)}</span>
            <span aria-hidden="true">{describeWeather(day.weatherCode).icon}</span>
            <span className="muted">{day.rainProbability ?? 0}% rain, {day.rain} mm</span>
            <strong>{Math.round(day.max)}° / {Math.round(day.min)}°</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
