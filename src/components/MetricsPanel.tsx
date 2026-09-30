'use client';

import { useEffect, useState } from 'react';
import type { RenderPattern } from '@/domain/types';

interface Metrics {
  ttfb?: number;
  fcp?: number;
  lcp?: number;
}

const THRESHOLDS = {
  ttfb: { good: 800, poor: 1800 },
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
};

function rate(value: number, limits: { good: number; poor: number }): string {
  if (value <= limits.good) return 'good';
  return value <= limits.poor ? 'needs-work' : 'poor';
}

export default function MetricsPanel({ pattern }: { pattern: RenderPattern }) {
  const [metrics, setMetrics] = useState<Metrics>({});

  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation) {
      setMetrics((current) => ({ ...current, ttfb: navigation.responseStart }));
    }

    const observers: PerformanceObserver[] = [];

    const watch = (type: string, onEntry: (entry: PerformanceEntry) => void) => {
      try {
        const observer = new PerformanceObserver((list) => list.getEntries().forEach(onEntry));
        observer.observe({ type, buffered: true });
        observers.push(observer);
      } catch {
        // This browser does not support the entry type.
      }
    };

    watch('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        setMetrics((current) => ({ ...current, fcp: entry.startTime }));
      }
    });
    watch('largest-contentful-paint', (entry) => {
      setMetrics((current) => ({ ...current, lcp: entry.startTime }));
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

    const rows: [keyof typeof THRESHOLDS, string, number | undefined, string][] = [
    ['ttfb', 'TTFB', metrics.ttfb, 'Time to first byte'],
    ['fcp', 'FCP', metrics.fcp, 'First contentful paint'],
    ['lcp', 'LCP', metrics.lcp, 'Largest contentful paint'],
  ];

  return (
    <section className="metrics" aria-label="Performance metrics">
      <h2>Your {pattern.toUpperCase()} metrics</h2>
      <div className="metrics__grid">
        {rows.map(([key, name, value, hint]) => (
          <div
            key={name}
            className="metric"
            data-rating={value === undefined ? undefined : rate(value, THRESHOLDS[key])}
          >
            <strong>{value === undefined ? 'Waiting' : `${Math.round(value)} ms`}</strong>
            <span>{name} <small>{hint}</small></span>
            <span className="meter">
              <i
                style={{
                  width: `${value === undefined ? 0 : Math.min((value / THRESHOLDS[key].poor) * 100, 100)}%`,
                }}
              />
            </span>
            <small>Good under {THRESHOLDS[key].good} ms</small>
          </div>
        ))}
      </div>
      <p className="muted">
        Measured in your browser. Use npm run build and npm start, because dev mode is not
        representative. LCP keeps updating while the page finishes loading.
      </p>
    </section>
  );
}