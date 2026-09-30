import ServerView from '@/components/ServerView';
import { cities } from '@/config/cities';

// Build every city once at build time and serve plain files.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map(({ slug }) => ({ city: slug }));
}

export default async function SsgPage({ params }: { params: Promise<{ city: string }> }) {
  return <ServerView pattern="ssg" slug={(await params).city} />;
}
