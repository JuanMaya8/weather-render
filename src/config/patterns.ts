import type { RenderPattern } from '@/domain/types';

export interface PatternInfo {
  id: RenderPattern;
  name: string;
  feature: string;
  rendersOn: string;
  freshness: string;
  summary: string;
  steps: [string, string, string];
  tradeoffs: { good: boolean; text: string }[];
  compare: {
    firstByte: string;
    seo: string;
    cost: string;
    freshness: string;
    complexity: string;
  };
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
    steps: ['Empty shell', 'Browser fetch', 'Render'],
    tradeoffs: [
      { good: true, text: 'No rendering work on the server' },
      { good: false, text: 'More JavaScript for the browser' },
      { good: false, text: 'Skeleton until the data arrives' },
    ],
    compare: {
      firstByte: 'Fast (small shell)',
      seo: 'Needs JavaScript to see content',
      cost: 'Lowest',
      freshness: 'Live in the browser',
      complexity: 'Low',
    },
  },
  {
    id: 'ssr',
    name: 'Server-Side Rendering',
    feature: 'Current weather and 7-day forecast',
    rendersOn: 'The server, on every request',
    freshness: 'Fresh on every request, nothing is cached',
    summary:
      'The server calls Open-Meteo for each request and sends finished HTML to the browser.',
    steps: ['Request', 'Server fetch and render', 'Full HTML'],
    tradeoffs: [
      { good: true, text: 'Always fresh data' },
      { good: true, text: 'Content is already in the HTML' },
      { good: false, text: 'Server work on every request' },
    ],
    compare: {
      firstByte: 'Slower (work per request)',
      seo: 'Content in the HTML',
      cost: 'Highest',
      freshness: 'Fresh on every request',
      complexity: 'Medium',
    },
  },
  {
    id: 'ssg',
    name: 'Static Site Generation',
    feature: 'Monthly climate of 2025',
    rendersOn: 'The server, once at build time',
    freshness: 'Frozen until the next deploy',
    summary:
      'Last year never changes, so the page is built once and served as a plain file.',
    steps: ['Build', 'Static file on CDN', 'Instant delivery'],
    tradeoffs: [
      { good: true, text: 'Fastest delivery' },
      { good: true, text: 'Almost no server cost' },
      { good: false, text: 'Data frozen until the next deploy' },
    ],
    compare: {
      firstByte: 'Fastest',
      seo: 'Content in the HTML',
      cost: 'Minimal',
      freshness: 'Frozen until deploy',
      complexity: 'Low',
    },
  },
  {
    id: 'isr',
    name: 'Incremental Static Regeneration',
    feature: 'Current weather and 7-day forecast',
    rendersOn: 'The server, at build time and then in the background',
    freshness: 'Rebuilt at most once every 60 seconds',
    summary:
      'Served as a static file. Once it is older than 60 seconds, Next.js rebuilds it in the background.',
    steps: ['Serve cached page', 'Background rebuild', 'Swap in new page'],
    tradeoffs: [
      { good: true, text: 'Static speed' },
      { good: true, text: 'Refreshes itself without a deploy' },
      { good: false, text: 'A visitor may see a page about a minute old' },
    ],
    compare: {
      firstByte: 'Fastest',
      seo: 'Content in the HTML',
      cost: 'Low',
      freshness: 'Up to about 60 s old',
      complexity: 'Medium',
    },
  },
];

export function getPattern(id: RenderPattern): PatternInfo {
  const pattern = patterns.find((item) => item.id === id);
  if (!pattern) throw new Error(`Unknown rendering pattern: ${id}`);
  return pattern;
}