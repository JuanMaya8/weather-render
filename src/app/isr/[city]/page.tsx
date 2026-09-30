import ServerView from '@/components/ServerView';
import { cities } from '@/config/cities';

// Static pages that Next.js rebuilds in the background after 60 seconds.
// Keep this value in sync with ISR_REVALIDATE_SECONDS (route config must be a literal).
export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map(({ slug }) => ({ city: slug }));
}

export default async function IsrPage({ params }: { params: Promise<{ city: string }> }) {
  return <ServerView pattern="isr" slug={(await params).city} />;
}
