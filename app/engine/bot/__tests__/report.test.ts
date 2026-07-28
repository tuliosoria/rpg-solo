import { describe, it, expect } from 'vitest';
import { buildRunSummary } from '../report';
import { BotRunLogEntry } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';

const cfg = { active: false, level: 'pro' as const, seed: 7, maxTurns: 400, delayMs: 900 };

describe('buildRunSummary', () => {
  it('summarizes turns, saves, outcome, and lists anomalies', () => {
    const log: BotRunLogEntry[] = [
      { turn: 1, command: 'open /a.txt', detectionBefore: 0, detectionAfter: 1, filesReadBefore: 0, savedBefore: 0, filesReadAfter: 1, savedAfter: 0 },
      { turn: 2, command: 'save a.txt', detectionBefore: 1, detectionAfter: 1, filesReadBefore: 1, savedBefore: 0, filesReadAfter: 1, savedAfter: 1, anomaly: 'command returned error' },
    ];
    const finalState: GameState = { ...DEFAULT_GAME_STATE, savedFiles: new Set(['/a.txt']), gameWon: true } as GameState;
    const entries = buildRunSummary(log, cfg, finalState);
    const text = entries.map(e => e.content).join('\n');
    expect(text).toContain('BOT-TEST RUN SUMMARY');
    expect(text).toContain('pro');
    expect(text).toContain('Turns: 2');
    expect(text).toContain('ANOMALIES (1)');
    expect(text).toContain('command returned error');
  });
});
