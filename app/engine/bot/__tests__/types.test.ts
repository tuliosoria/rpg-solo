import { describe, it, expect } from 'vitest';
import { createBotMemory, DEFAULT_BOT_DELAY_MS } from '../types';

describe('createBotMemory', () => {
  it('starts a fresh run with zeroed counters', () => {
    const m = createBotMemory();
    expect(m.turnsTaken).toBe(0);
    expect(m.lastDecision).toBeNull();
    expect(m.noProgressStreak).toBe(0);
    expect(m.overrideAttempted).toBe(false);
    expect(m.lastProgressSignature).toBe('');
  });

  it('uses a 3-second delay between actions so a watcher can follow along', () => {
    expect(DEFAULT_BOT_DELAY_MS).toBe(3000);
  });
});

