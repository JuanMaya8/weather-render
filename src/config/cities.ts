import type { City } from '@/domain/types';

export const cities: City[] = [
  { slug: 'pasto', name: 'Pasto', latitude: 1.2136, longitude: -77.2811 },
  { slug: 'bogota', name: 'Bogotá', latitude: 4.711, longitude: -74.0721 },
  { slug: 'medellin', name: 'Medellín', latitude: 6.2442, longitude: -75.5812 },
  { slug: 'cali', name: 'Cali', latitude: 3.4516, longitude: -76.532 },
  { slug: 'barranquilla', name: 'Barranquilla', latitude: 10.9685, longitude: -74.7813 },
  { slug: 'cartagena', name: 'Cartagena', latitude: 10.391, longitude: -75.4794 },
  { slug: 'bucaramanga', name: 'Bucaramanga', latitude: 7.1193, longitude: -73.1227 },
  { slug: 'santa-marta', name: 'Santa Marta', latitude: 11.2408, longitude: -74.199 },
];

export const DEFAULT_CITY = cities[0];

// Full calendar year used by the SSG page (historical data never changes).
export const CLIMATE_YEAR = 2025;

export function findCity(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
