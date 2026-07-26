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
} as GameState);

describe('decideNextCommand — explore/read/save', () => {
  it('overrides first when the level unlocks admin and it is still locked', () => {
    const { decision } = decideNextCommand(base(), createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('override protocol ')).toBe(true);
    }
  });

  it('opens an unread wanted file once admin is unlocked', () => {
    const s = base({ flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true }, accessLevel: 5 });
    const mem = { ...createBotMemory(), overrideAttempted: true };
    const { decision } = decideNextCommand(s, mem, 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('open ')).toBe(true);
    }
  });

  it('saves a read wanted file it has not saved yet', () => {
    // dummy never unlocks admin, so no override step interferes.
    const s0 = base();
    const all: string[] = getAllAccessibleFiles(s0);
    const state = base({ filesRead: new Set(all) });
    const { decision } = decideNextCommand(state, createBotMemory(), 'dummy', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('save ')).toBe(true);
    }
  });

  it('dummy never issues an override command', () => {
    let memory = createBotMemory();
    const s = base();
    for (let i = 0; i < 5; i++) {
      const { decision, memory: nm } = decideNextCommand(s, memory, 'dummy', 42);
      memory = nm;
      if (decision.kind === 'command') {
        expect(decision.text.startsWith('override')).toBe(false);
      }
    }
  });
});
