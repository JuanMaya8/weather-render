import type { RenderPattern } from '@/domain/types';

export const ISR_REVALIDATE_SECONDS = 60;

// Strategy: each rendering pattern decides how its data requests are cached.
export const fetchStrategies: Record<RenderPattern, RequestInit> = {
  csr: { cache: 'no-store' },
  ssr: { cache: 'no-store' },
  ssg: { cache: 'force-cache' },
  isr: { next: { revalidate: ISR_REVALIDATE_SECONDS } },
};
