import type { MonthlyClimate } from '@/domain/types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ClimateChart({ months }: { months: MonthlyClimate[] }) {
  const maxRain = Math.max(...months.map((month) => month.totalRain), 1);

  return (
    <section>
      <div className="climate">
        {months.map((month) => (
          <div key={month.month} className="climate__col">
            <div className="climate__track">
              <div
                className="climate__bar"
                style={{ height: `${Math.max((month.totalRain / maxRain) * 100, 2)}%` }}
              />
            </div>
            <strong>{MONTH_NAMES[month.month]}</strong>
            <span>{month.avgMax.toFixed(1)}°</span>
            <span className="muted">{month.avgMin.toFixed(1)}°</span>
            <span className="muted">{Math.round(month.totalRain)} mm</span>
          </div>
        ))}
      </div>
      <p className="muted">
        Bars show monthly rainfall. Under each month: average high, average low and total rain.
      </p>
    </section>
  );
}
