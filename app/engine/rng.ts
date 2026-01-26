// Seeded RNG using mulberry32 algorithm for deterministic randomness

/**
 * Creates a seeded random number generator using the mulberry32 algorithm.
 * Returns values between 0 (inclusive) and 1 (exclusive).
 */
export function createSeededRng(seed: number): () => number {
  let state = seed;
  return function (): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a random seed for initializing an RNG.
 * This is the ONLY place where true Math.random() should be used.
 */
export function generateSeed(): number {
  // Use crypto.getRandomValues if available for better entropy
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 2147483647;
  }
  // Fallback to Math.random for environments without crypto
  return Math.floor(Math.random() * 2147483647);
}

/**
 * Get a seeded random integer between min (inclusive) and max (exclusive).
 */
export function seededRandomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min)) + min;
}

/**
 * Pick a random element from an array.
 */
export function seededRandomPick<T>(rng: () => number, arr: T[]): T {
  return arr[seededRandomInt(rng, 0, arr.length)];
}

/**
 * Shuffle array using Fisher-Yates algorithm.
 * Returns a new shuffled array without modifying the original.
 */
export function seededShuffle<T>(rng: () => number, arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = seededRandomInt(rng, 0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Check if a random event should occur based on probability (0-1).
 */
export function seededChance(rng: () => number, probability: number): boolean {
  return rng() < probability;
}

/**
 * Get a random float between min and max.
 */
export function seededRandomFloat(rng: () => number, min: number, max: number): number {
  return rng() * (max - min) + min;
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL UI RNG - For non-deterministic UI effects that don't affect gameplay
// ═══════════════════════════════════════════════════════════════════════════

// Session-based RNG for UI effects (initialized once per page load)
let uiRngInstance: (() => number) | null = null;

/**
 * Get the global UI RNG instance. Creates one if it doesn't exist.
 * This is used for visual effects that don't need to be deterministic
 * across saves, but should still use seeded randomness for consistency.
 */
export function getUIRng(): () => number {
  if (!uiRngInstance) {
    uiRngInstance = createSeededRng(generateSeed());
  }
  return uiRngInstance;
}

/**
 * Reset the UI RNG with a new seed. Useful for testing.
 */
export function resetUIRng(seed?: number): void {
  uiRngInstance = createSeededRng(seed ?? generateSeed());
}

// Convenience functions that use the global UI RNG
export function uiRandomInt(min: number, max: number): number {
  return seededRandomInt(getUIRng(), min, max);
}

export function uiRandomPick<T>(arr: T[]): T {
  return seededRandomPick(getUIRng(), arr);
}

export function uiChance(probability: number): boolean {
  return seededChance(getUIRng(), probability);
}

export function uiRandomFloat(min: number, max: number): number {
  return seededRandomFloat(getUIRng(), min, max);
}

/**
 * Get a random value from the UI RNG (0-1).
 */
export function uiRandom(): number {
  return getUIRng()();
}
