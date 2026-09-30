import type { RenderPattern } from '@/domain/types';

export interface PatternInfo {
  id: RenderPattern;
  name: string;
  feature: string;
  rendersOn: string;
  freshness: string;
  summary: string;
}

export const patterns: PatternInfo[] = [
  {
    id: 'csr',
    name: 'Client-Side Rendering',
    feature: 'Current weather and 7-day forecast',
    rendersOn: 'Your browser',
    freshness: 'Loaded on every visit, refreshed every 60 seconds',
    summary:
      'The server sends an empty shell. Your browser downloads the JavaScript, calls Open-Meteo directly and paints the result.',
  },
  {
    id: 'ssr',
    name: 'Server-Side Rendering',
    feature: 'Current weather and 7-day forecast',
    rendersOn: 'The server, on every request',
    freshness: 'Fresh on every request, nothing is cached',
    summary:
      'The server calls Open-Meteo for each request and sends finished HTML to the browser.',
  },
  {
    id: 'ssg',
    name: 'Static Site Generation',
    feature: 'Monthly climate of 2025',
    rendersOn: 'The server, once at build time',
    freshness: 'Frozen until the next deploy',
    summary:
      'Last year never changes, so the page is built once and served as a plain file.',
  },
  {
    id: 'isr',
    name: 'Incremental Static Regeneration',
    feature: 'Current weather and 7-day forecast',
    rendersOn: 'The server, at build time and then in the background',
    freshness: 'Rebuilt at most once every 60 seconds',
    summary:
      'Served as a static file. Once it is older than 60 seconds, Next.js rebuilds it in the background.',
  },
];

export function getPattern(id: RenderPattern): PatternInfo {
  const pattern = patterns.find((item) => item.id === id);
  if (!pattern) throw new Error(`Unknown rendering pattern: ${id}`);
  return pattern;
}
