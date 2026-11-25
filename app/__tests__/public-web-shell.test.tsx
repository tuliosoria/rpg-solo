import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from '../layout';
import Home from '../page';

vi.mock('next/dynamic', () => ({
  default: (_: unknown, options: { loading: () => React.ReactNode }) => options.loading,
}));

describe('public first-load shell', () => {
  it('exports the default English document language before JavaScript', () => {
    expect(renderToStaticMarkup(<RootLayout><main /></RootLayout>)).toContain('<html lang="en"');
  });

  it('shows an accessible loading label and a JavaScript-disabled explanation', () => {
    const markup = renderToStaticMarkup(<Home />);
    expect(markup).toContain('role="status"');
    expect(markup).toContain('Loading Varginha Terminal');
    expect(markup).toMatch(/<noscript>[\s\S]*?requires JavaScript/);
  });

  it('sets canonical and social URLs to the live game, not the parent project', () => {
    expect(metadata.alternates?.canonical).toBe('https://game.terminalufo.com/');
    expect(metadata.openGraph).toMatchObject({ url: 'https://game.terminalufo.com/', type: 'website' });
    expect(metadata.twitter).toMatchObject({ card: 'summary' });
  });
});
