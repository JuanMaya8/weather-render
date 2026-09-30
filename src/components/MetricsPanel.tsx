'use client';

import { useEffect, useState } from 'react';
import type { RenderPattern } from '@/domain/types';

interface Metrics {
  ttfb?: number;
  fcp?: number;
  lcp?: number;
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

  const rows: [string, number | undefined, string][] = [
    ['TTFB', metrics.ttfb, 'Time to first byte'],
    ['FCP', metrics.fcp, 'First contentful paint'],
    ['LCP', metrics.lcp, 'Largest contentful paint'],
  ];

  return (
    <section className="metrics" aria-label="Performance metrics">
      <h2>Your {pattern.toUpperCase()} metrics</h2>
      <div className="metrics__grid">
        {rows.map(([name, value, hint]) => (
          <div key={name} className="metric">
            <strong>{value === undefined ? 'Waiting' : `${Math.round(value)} ms`}</strong>
            <span>{name}</span>
            <small>{hint}</small>
          </div>
        ))}
      </div>
      <p className="muted">
        Measure with npm run build and npm start, because dev mode is not representative. LCP keeps
        updating while the page finishes loading.
      </p>
    </section>
  );
}
