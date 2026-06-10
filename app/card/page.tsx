import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { decodeConfig } from '@/lib/codec';
import CardView from './card-view';

type Props = {
  searchParams: Promise<{ data?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { data } = await searchParams;
  const config = data ? decodeConfig(data) : null;

  // Resolve active host and protocol to dynamically construct metadataBase
  const headersList = await headers();
  const host = headersList.get('host') || 'yescard.vercel.app';
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const siteUrl = `${proto}://${host}`;

  if (!config) {
    return {
      metadataBase: new URL(siteUrl),
      title: 'YesCard — Interactive Invitations',
      description: 'Create a fun invitation where your recipient can only say YES!',
    };
  }

  const name = config.senderName || 'Someone';
  return {
    metadataBase: new URL(siteUrl),
    title: `YesCard from ${name}`,
    description: `${name} sent you a special invitation. Can you say YES?`,
    openGraph: {
      title: `YesCard from ${name}`,
      description: `${name} sent you a special invitation. Can you say YES?`,
      images: [{ url: `/api/og?data=${data}`, width: 1200, height: 630, alt: `YesCard from ${name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `YesCard from ${name}`,
      description: `${name} sent you a special invitation. Can you say YES?`,
      images: [`/api/og?data=${data}`],
    },
  };
}

export default function CardPage() {
  return <CardView />;
}
