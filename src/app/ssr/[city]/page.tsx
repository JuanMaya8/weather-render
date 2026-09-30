import ServerView from '@/components/ServerView';

// Render on every request, never cache the page.
export const dynamic = 'force-dynamic';

export default async function SsrPage({ params }: { params: Promise<{ city: string }> }) {
  return <ServerView pattern="ssr" slug={(await params).city} />;
}
