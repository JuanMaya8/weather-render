import type { MonthlyClimate } from '@/domain/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SLOT = 60;
const BASE = 160;
const PLOT = 140;

export default function ClimateChart({ months }: { months: MonthlyClimate[] }) {
  const maxRain = Math.max(...months.map((month) => month.totalRain), 1);
  const highs = months.map((month) => month.avgMax);
  const lows = months.map((month) => month.avgMin);
  const tMin = Math.min(...lows) - 1;
  const tMax = Math.max(...highs) + 1;

  const yTemp = (temp: number) => BASE - ((temp - tMin) / (tMax - tMin)) * PLOT;
  const linePoints = (values: number[]) =>
    values.map((value, i) => `${i * SLOT + SLOT / 2},${yTemp(value).toFixed(1)}`).join(' ');

  const annualRain = months.reduce((sum, month) => sum + month.totalRain, 0);
  const wettest = months.reduce((best, month) => (month.totalRain > best.totalRain ? month : best));
  const warmest = months.reduce((best, month) => (month.avgMax > best.avgMax ? month : best));
  const coolest = months.reduce((best, month) => (month.avgMin < best.avgMin ? month : best));

  const stats: [string, string][] = [
    ['Annual rainfall', `${Math.round(annualRain)} mm`],
    ['Wettest month', `${MONTHS[wettest.month]} (${Math.round(wettest.totalRain)} mm)`],
    ['Warmest average high', `${warmest.avgMax.toFixed(1)} °C in ${MONTHS[warmest.month]}`],
    ['Coolest average low', `${coolest.avgMin.toFixed(1)} °C in ${MONTHS[coolest.month]}`],
  ];

  return (
    <section>
      <div className="stats">
        {stats.map(([label, value]) => (
          <div key={label} className="stat">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <svg
        className="climate-svg"
        viewBox="0 0 720 250"
        role="img"
        aria-label="Monthly rainfall bars with average high and low temperature lines"
      >
        {months.map((month, i) => {
          const height = (month.totalRain / maxRain) * PLOT;
          const center = i * SLOT + SLOT / 2;
          return (
            <g key={month.month}>
              <rect className="climate-bar" x={i * SLOT + 15} y={BASE - height} width={30} height={height} />
              <text x={center} y={182} textAnchor="middle">{MONTHS[month.month]}</text>
              <text x={center} y={204} textAnchor="middle">{month.avgMax.toFixed(1)}°</text>
              <text x={center} y={220} textAnchor="middle">{month.avgMin.toFixed(1)}°</text>
              <text x={center} y={236} textAnchor="middle">{Math.round(month.totalRain)} mm</text>
            </g>
          );
        })}
        <polyline className="line-high" fill="none" points={linePoints(highs)} />
        <polyline className="line-low" fill="none" points={linePoints(lows)} />
      </svg>

      <p className="muted">
        Bars: monthly rainfall. Red line: average high. Blue line: average low. Data: Open-Meteo
        historical archive, calendar year 2025.
      </p>
    </section>
  );
}