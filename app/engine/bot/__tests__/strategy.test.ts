import { describe, it, expect } from 'vitest';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { getAllAccessibleFiles } from '../../filesystem';
import { isEvidencePath } from '../../evidenceRevelation';
import { OVERRIDE_PASSWORD } from '../../overrideSecret';

const PASSWORD_HINT_FILE = '/internal/override_protocol_memo.txt';

const base = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  tutorialComplete: true,
  seed: 42,
  filesRead: new Set<string>(),
  savedFiles: new Set<string>(),
  ...overrides,
} as GameState);

describe('decideNextCommand — explore/read/save', () => {
  it('discovers the password by reading the override hint before overriding', () => {
    const { decision } = decideNextCommand(base(), createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text).toBe(`open ${PASSWORD_HINT_FILE}`);
    }
  });

  it('overrides only after the hint file has been read', () => {
    const s = base({ filesRead: new Set<string>([PASSWORD_HINT_FILE]) });
    const { decision } = decideNextCommand(s, createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text).toBe(`override protocol ${OVERRIDE_PASSWORD}`);
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

  it('drives the leak sequence once the save target is met, instead of opening more files', () => {
    const s0 = base({ flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true }, accessLevel: 5 });
    const evidence = getAllAccessibleFiles(s0).filter(isEvidencePath);
    // Precondition: there must be MORE than 10 evidence files, so unread wanted
    // files remain after the dossier is full — the exact situation that used to
    // make the bot keep opening files instead of leaking.
    expect(evidence.length).toBeGreaterThan(10);
    const first10 = evidence.slice(0, 10);
    const s = base({
      flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true },
      accessLevel: 5,
      filesRead: new Set<string>(first10),
      savedFiles: new Set<string>(first10),
    });
    const mem = { ...createBotMemory(), overrideAttempted: true };
    const { decision } = decideNextCommand(s, mem, 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('leak')).toBe(true);
      expect(decision.text.startsWith('open')).toBe(false);
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
