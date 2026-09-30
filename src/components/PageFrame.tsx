import type { ReactNode } from 'react';
import { cities } from '@/config/cities';
import { getPattern, patterns } from '@/config/patterns';
import type { City, RenderPattern } from '@/domain/types';
import MetricsPanel from './MetricsPanel';

interface PageFrameProps {
  pattern: RenderPattern;
  city: City;
  renderedAt?: string;
  children: ReactNode;
}

// Plain <a> tags on purpose: a full page load gives real per-pattern metrics,
// while <Link> would swap the page on the client and hide the difference.
export default function PageFrame({ pattern, city, renderedAt, children }: PageFrameProps) {
  const info = getPattern(pattern);

  return (
    <main className="page" data-pattern={pattern}>
      <nav className="tabs" aria-label="Rendering pattern">
        {patterns.map((item) => (
          <a
            key={item.id}
            href={`/${item.id}/${city.slug}`}
            className={item.id === pattern ? 'tab tab--active' : 'tab'}
          >
            {item.id.toUpperCase()}
          </a>
        ))}
      </nav>

      <header className="intro">
        <h1>{info.name}</h1>
        <p>{info.summary}</p>
        <ul className="facts">
          <li><b>Showing</b>{info.feature}</li>
          <li><b>Renders on</b>{info.rendersOn}</li>
          <li><b>Freshness</b>{info.freshness}</li>
          <li><b>HTML generated</b>{renderedAt ?? 'In your browser, see the timestamp below'}</li>
        </ul>
      </header>

      <nav className="cities" aria-label="City">
        {cities.map((item) => (
          <a
            key={item.slug}
            href={`/${pattern}/${item.slug}`}
            className={item.slug === city.slug ? 'city city--active' : 'city'}
          >
            {item.name}
            <small>{item.elevation} m</small>
          </a>
        ))}
      </nav>

      <section className="profile">
        <h2>{city.name}</h2>
        <p>
          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}° at {city.elevation} m,{' '}
          {city.zone} zone
        </p>
      </section>

      {children}
      <MetricsPanel pattern={pattern} />
    </main>
  );
}