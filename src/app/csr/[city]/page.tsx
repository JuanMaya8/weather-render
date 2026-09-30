import { notFound } from 'next/navigation';
import CsrWeather from '@/components/CsrWeather';
import PageFrame from '@/components/PageFrame';
import { findCity } from '@/config/cities';

export default async function CsrPage({ params }: { params: Promise<{ city: string }> }) {
  const city = findCity((await params).city);
  if (!city) notFound();

  // The data is fetched inside the browser by the client component.
  return (
    <PageFrame pattern="csr" city={city}>
      <CsrWeather city={city} />
    </PageFrame>
  );
}
