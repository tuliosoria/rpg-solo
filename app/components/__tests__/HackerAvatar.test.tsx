import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import HackerAvatar from '../HackerAvatar';
import { FloatingUIProvider } from '../FloatingUI';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority: _priority,
    ...props
  }: {
    src: string;
    alt: string;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('HackerAvatar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and hides the evidence found indicator when triggered', () => {
    const { rerender } = render(
      <FloatingUIProvider>
        <HackerAvatar expression="neutral" detectionLevel={0} sessionStability={100} />
      </FloatingUIProvider>
    );

    expect(screen.queryByText('Evidence Found')).not.toBeInTheDocument();

    rerender(
      <FloatingUIProvider>
        <HackerAvatar
          expression="neutral"
          detectionLevel={0}
          sessionStability={100}
          evidenceFoundIndicatorKey={1}
        />
      </FloatingUIProvider>
    );

    expect(screen.getByText('Evidence Found')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.queryByText('Evidence Found')).not.toBeInTheDocument();
  });
});
