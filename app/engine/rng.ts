// Seeded RNG using mulberry32 algorithm for deterministic randomness

export function createSeededRng(seed: number): () => number {
  let state = seed;
  return function(): number {
    state |= 0;
    state = state + 0x6D2B79F5 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

// Get a seeded random int between min (inclusive) and max (exclusive)
export function seededRandomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min)) + min;
}

// Pick a random element from array
export function seededRandomPick<T>(rng: () => number, arr: T[]): T {
  return arr[seededRandomInt(rng, 0, arr.length)];
}

// Shuffle array in place using Fisher-Yates
export function seededShuffle<T>(rng: () => number, arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = seededRandomInt(rng, 0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
