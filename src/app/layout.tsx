import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather Render Lab',
  description: 'CSR, SSR, SSG and ISR compared with real Open-Meteo data for Colombian cities.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="brand">
          <a href="/">Weather Render Lab</a>
        </header>
        {children}
        <footer className="foot">
          Weather data by{' '}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo.com</a>{' '}
          under CC BY 4.0.
        </footer>
      </body>
    </html>
  );
}
