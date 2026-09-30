import type { Metadata } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { DEFAULT_CITY } from '@/config/cities';
import { patterns } from '@/config/patterns';
import './globals.css';

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Weather Render Lab',
  description: 'CSR, SSR, SSG and ISR compared with real Open-Meteo data for Colombian cities.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <header className="topbar">
          <div className="topbar__inner">
            <a href="/" className="brand">Weather Render Lab</a>
            <nav className="topnav" aria-label="Main">
              <a href="/">Overview</a>
              {patterns.map((pattern) => (
                <a key={pattern.id} href={`/${pattern.id}/${DEFAULT_CITY.slug}`}>
                  {pattern.id.toUpperCase()} pattern
                </a>
              ))}
            </nav>
            <span className="topbar__source">Data: Open-Meteo</span>
          </div>
        </header>
        {children}
        <footer className="foot">
          Weather data by{' '}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo.com</a>{' '}
          under CC BY 4.0. City elevations are approximate.
        </footer>
      </body>
    </html>
  );
}