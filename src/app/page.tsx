import { cities, DEFAULT_CITY } from '@/config/cities';
import { patterns } from '@/config/patterns';

const sortedCities = [...cities].sort((a, b) => b.elevation - a.elevation);
const HIGHEST = sortedCities[0].elevation;

export default function HomePage() {
  return (
    <main className="home">
      <section className="masthead">
        <p className="kicker">Case study: real weather in 8 Colombian cities</p>
        <h1>One weather app, four ways to render it</h1>
        <p className="lead">
          Open a pattern to load the same case study with real Open-Meteo data, then compare when
          each page is built, where it runs and how fast it paints.
        </p>
      </section>

      <div className="stations">
        {cities.map((city) => (
          <div key={city.slug} className="station">
            <strong>{city.name}</strong>
            <span>{city.elevation.toLocaleString('en-US')} m</span>
            <span className="muted">{city.zone}</span>
          </div>
        ))}
      </div>

      <section>
        <h2>Pick a rendering pattern</h2>
        <div className="cards">
          {patterns.map((pattern) => (
            <article key={pattern.id} className="card" data-pattern={pattern.id}>
              <span className="tag">{pattern.id.toUpperCase()}</span>
              <h3>{pattern.name}</h3>
              <p>{pattern.summary}</p>
              <p className="pill">{pattern.freshness}</p>
              <ol className="steps">
                {pattern.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <ul className="tradeoffs">
                {pattern.tradeoffs.map((item) => (
                  <li key={item.text} data-good={item.good}>{item.text}</li>
                ))}
              </ul>
              <a className="card__cta" href={`/${pattern.id}/${DEFAULT_CITY.slug}`}>
                Open {pattern.id.toUpperCase()} demo
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Why weather fits this case study</h2>
        <p className="muted">
          Current conditions change all the time, while last year never changes. That mix lets each
          pattern show what it is good at. The cities also span sea level to 2,640 m, so the data
          looks very different from one to the next.
        </p>
        {sortedCities.map((city) => (
          <div key={city.slug} className="elev">
            <span>{city.name}</span>
            <div className="elev__track">
              <i style={{ width: `${Math.max((city.elevation / HIGHEST) * 100, 1)}%` }} />
            </div>
            <span className="mono">{city.elevation} m</span>
          </div>
        ))}
      </section>

      <section>
        <h2>Pattern comparison</h2>
        <p className="muted">General characteristics, not measurements. Your real numbers are in the metrics panel of each page.</p>
        <div className="scroll">
          <table className="compare">
            <thead>
              <tr>
                <th>Pattern</th><th>First byte</th><th>Search engines</th>
                <th>Server cost</th><th>Data freshness</th><th>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern) => (
                <tr key={pattern.id}>
                  <th scope="row">{pattern.id.toUpperCase()}</th>
                  <td>{pattern.compare.firstByte}</td>
                  <td>{pattern.compare.seo}</td>
                  <td>{pattern.compare.cost}</td>
                  <td>{pattern.compare.freshness}</td>
                  <td>{pattern.compare.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}