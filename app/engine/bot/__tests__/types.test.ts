import { describe, it, expect } from 'vitest';
import { createBotMemory } from '../types';

describe('createBotMemory', () => {
  it('starts a fresh run with zeroed counters', () => {
    const m = createBotMemory();
    expect(m.turnsTaken).toBe(0);
    expect(m.lastDecision).toBeNull();
    expect(m.noProgressStreak).toBe(0);
    expect(m.overrideAttempted).toBe(false);
    expect(m.lastProgressSignature).toBe('');
  });
});
