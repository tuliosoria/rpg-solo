import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEndingMusic } from '../useEndingMusic';
import { OPTIONS_STORAGE_KEY } from '../../../hooks/useOptions';

/**
 * useEndingMusic must respect the player's audio settings. The bug it fixes:
 * ending screens used to construct a bare `new Audio()` at a hardcoded volume,
 * ignoring both the music toggle and master volume. These tests lock in that
 * the hook reads stored options before playing.
 */
describe('useEndingMusic', () => {
  let playSpy: ReturnType<typeof vi.fn>;
  let pauseSpy: ReturnType<typeof vi.fn>;

  function setOptions(partial: Record<string, unknown>) {
    window.localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(partial));
  }

  beforeEach(() => {
    window.localStorage.clear();
    playSpy = vi.fn().mockResolvedValue(undefined);
    pauseSpy = vi.fn();
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: playSpy,
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: pauseSpy,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('plays at master-scaled volume when music is enabled', () => {
    setOptions({ musicEnabled: true, masterVolume: 50 });
    const { result } = renderHook(() => useEndingMusic('/audio/music/ending-game.mp3', { baseVolume: 0.5 }));
    expect(result.current).toBeUndefined(); // hook returns nothing
    expect(playSpy).toHaveBeenCalled();
  });

  it('does NOT play when music is disabled', () => {
    setOptions({ musicEnabled: false, masterVolume: 100 });
    renderHook(() => useEndingMusic('/audio/music/ending-game.mp3', { baseVolume: 0.5 }));
    expect(playSpy).not.toHaveBeenCalled();
    expect(pauseSpy).toHaveBeenCalled();
  });

  it('pauses and tears down the audio on unmount', () => {
    setOptions({ musicEnabled: true, masterVolume: 100 });
    const { unmount } = renderHook(() => useEndingMusic('/audio/music/ending-game.mp3'));
    pauseSpy.mockClear();
    unmount();
    expect(pauseSpy).toHaveBeenCalled();
  });
});
