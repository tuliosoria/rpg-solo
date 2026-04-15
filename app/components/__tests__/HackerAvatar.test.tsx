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

  it('resets temporary expressions back to neutral after the timeout', () => {
    const onExpressionTimeout = vi.fn();
    const { rerender } = render(
      <FloatingUIProvider>
        <HackerAvatar expression="neutral" detectionLevel={0} sessionStability={100} />
      </FloatingUIProvider>
    );

    expect(screen.getByAltText('Hacker avatar')).toHaveAttribute('src', '/images/avatar/neutral.jpg');

    rerender(
      <FloatingUIProvider>
        <HackerAvatar
          expression="scared"
          detectionLevel={0}
          sessionStability={100}
          onExpressionTimeout={onExpressionTimeout}
        />
      </FloatingUIProvider>
    );

    expect(screen.getByAltText('Hacker avatar')).toHaveAttribute('src', '/images/avatar/scared.jpg');

    act(() => {
      vi.advanceTimersByTime(5150);
    });

    expect(screen.getByAltText('Hacker avatar')).toHaveAttribute('src', '/images/avatar/neutral.jpg');
    expect(onExpressionTimeout).toHaveBeenCalledTimes(1);
  });
});
