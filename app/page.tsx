'use client';

import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('./components/HomeContent'), {
  ssr: false,
  loading: () => (
    <main lang="en" className="grid min-h-screen content-center justify-items-center gap-2 bg-black p-6 text-center text-white">
      <p role="status">Loading Varginha Terminal…</p>
      <noscript><p>This game requires JavaScript. Enable it and reload to play.</p></noscript>
    </main>
  ),
});

export default function Home() {
  return <HomeContent />;
}
