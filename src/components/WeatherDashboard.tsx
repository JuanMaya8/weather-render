import type { WeatherSnapshot } from '@/domain/types';
import { describeAirQuality, describeWeather } from '@/domain/weather-codes';

interface Sensor {
  label: string;
  value: string;
  unit: string;
  note: string;
  meter?: number;
}

function formatDay(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
  });
}

export default function WeatherDashboard({ snapshot }: { snapshot: WeatherSnapshot }) {
  const { current, air, daily } = snapshot;
  const sky = describeWeather(current.weatherCode);
  const weekMin = Math.min(...daily.map((day) => day.min));
  const weekMax = Math.max(...daily.map((day) => day.max));
  const span = Math.max(weekMax - weekMin, 1);

  const sensors: Sensor[] = [
    { label: 'Feels like', value: current.feelsLike.toFixed(1), unit: '°C', note: 'Apparent temperature' },
    { label: 'Humidity', value: String(current.humidity), unit: '%', note: 'Relative humidity', meter: current.humidity },
    { label: 'Wind', value: current.windSpeed.toFixed(1), unit: 'km/h', note: 'At 10 m height' },
    { label: 'Pressure', value: String(Math.round(current.pressure)), unit: 'hPa', note: 'At surface level' },
    { label: 'Rain now', value: String(current.precipitation), unit: 'mm', note: 'Current reading' },
    {
      label: 'Air quality',
      value: air.usAqi === null ? 'n/a' : String(air.usAqi),
      unit: 'AQI',
      note: air.usAqi === null ? 'Not available' : describeAirQuality(air.usAqi),
      meter: air.usAqi === null ? undefined : Math.min(air.usAqi / 2, 100),
    },
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

      <dl className="sensors">
        {sensors.map((sensor) => (
          <div key={sensor.label} className="sensor">
            <dt>{sensor.label}</dt>
            <dd><strong>{sensor.value}</strong><small>{sensor.unit}</small></dd>
            <dd className="muted">{sensor.note}</dd>
            {sensor.meter !== undefined && (
              <dd className="meter"><i style={{ width: `${sensor.meter}%` }} /></dd>
            )}
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
            <span className="range">
              <i
                style={{
                  left: `${((day.min - weekMin) / span) * 100}%`,
                  width: `${Math.max(((day.max - day.min) / span) * 100, 4)}%`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}