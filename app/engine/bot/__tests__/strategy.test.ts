import { describe, it, expect } from 'vitest';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { getAllAccessibleFiles } from '../../filesystem';

const base = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  tutorialComplete: true,
  seed: 42,
  filesRead: new Set<string>(),
  savedFiles: new Set<string>(),
  ...overrides,
});

describe('decideNextCommand — explore/read/save', () => {
  it('opens an unread accessible file', () => {
    const { decision } = decideNextCommand(base(), createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('open ')).toBe(true);
    }
  });

  it('saves a read evidence file it has not saved yet', () => {
    // Pre-read every accessible file so the only remaining work is saving.
    const s = base();
    const all: string[] = getAllAccessibleFiles(s);
    const read = new Set(all);
    const state = base({ filesRead: read });
    const { decision } = decideNextCommand(state, createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('save ') || decision.text === 'leak').toBe(true);
    }
  });
});
