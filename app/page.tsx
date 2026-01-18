'use client';

import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('./components/HomeContent'), {
  ssr: false,
  loading: () => <div style={{ background: 'black', width: '100vw', height: '100vh' }} />
});

export default function Home() {
  return <HomeContent />;
}

