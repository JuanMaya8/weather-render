import { DEFAULT_CITY } from '@/config/cities';
import { patterns } from '@/config/patterns';

export default function HomePage() {
  return (
    <main className="home">
      <h1>One weather app, four ways to render it</h1>
      <p className="lead">
        Pick a pattern to load the same case study, real Colombian weather from Open-Meteo, and
        compare when each page is built, where it runs and how fast it paints.
      </p>
      <div className="cards">
        {patterns.map((pattern) => (
          <a
            key={pattern.id}
            href={`/${pattern.id}/${DEFAULT_CITY.slug}`}
            className="card"
            data-pattern={pattern.id}
          >
            <h2>{pattern.id.toUpperCase()}</h2>
            <strong>{pattern.name}</strong>
            <span>{pattern.summary}</span>
            <span className="muted">{pattern.freshness}</span>
          </a>
        ))}
      </div>
    </main>
  );
}
