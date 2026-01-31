import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateSeed } from '../rng';

describe('RNG utilities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('avoids zero seed when crypto returns zero', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint32Array) => {
        array[0] = 0;
        return array;
      },
    });

    const seed = generateSeed();
    expect(seed).toBe(1);
  });

  it('avoids zero seed when Math.random is zero', () => {
    vi.stubGlobal('crypto', undefined);
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const seed = generateSeed();
    expect(seed).toBe(1);
  });
});
