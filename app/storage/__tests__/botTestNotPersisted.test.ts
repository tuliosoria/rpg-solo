/**
 * The autoplay harness must not survive a save/load cycle.
 *
 * `bot-test` ships in production (see `BOT_ENABLED`), and the autosave fires on
 * state change — so a run that was underway got written to disk with
 * `active: true`. Reloading that save handed the session straight back to the
 * bot, which then played the player's game for them with no visible cause.
 * `GameState.botTest` was already documented as "never persisted"; nothing
 * enforced it.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

vi.mock('../../lib/steamBridge', () => ({
  isCloudAvailable: vi.fn(async () => false),
  cloudSave: vi.fn(async () => ({ success: true })),
  cloudLoad: vi.fn(async () => ({ success: false, data: null })),
  cloudDelete: vi.fn(async () => ({ success: true })),
  cloudList: vi.fn(async () => ({ success: true, files: [] })),
}));

import { autoSave, loadAutoSave, saveGame, loadGame } from '../saves';

function runningBotState(): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 12345,
    rngState: 12345,
    filesRead: new Set<string>(['/internal/override_protocol_memo.txt']),
    savedFiles: new Set<string>(),
    botTest: { active: true, level: 'pro', seed: 999, maxTurns: 400, delayMs: 3000 },
  } as GameState;
}

describe('botTest is session-only', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('is dropped from an autosave', () => {
    autoSave(runningBotState());
    const loaded = loadAutoSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.botTest).toBeUndefined();
    // The rest of the session must still survive.
    expect(loaded?.filesRead.has('/internal/override_protocol_memo.txt')).toBe(true);
  });

  it('is dropped from a manual save', () => {
    const slot = saveGame(runningBotState(), 'bot-run');
    expect(slot).not.toBeNull();
    expect(loadGame(slot!.id)?.botTest).toBeUndefined();
  });

  it('is stripped on load, so saves written by older builds are inert too', () => {
    // Simulate a save file produced before botTest was excluded on write.
    const slot = saveGame(runningBotState(), 'legacy');
    const key = `terminal1996:save:${slot!.id}`;
    const raw = window.localStorage.getItem(key);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    parsed.state.botTest = { active: true, level: 'novice', seed: 5, maxTurns: 400, delayMs: 3000 };
    window.localStorage.setItem(key, JSON.stringify(parsed));

    expect(loadGame(slot!.id)?.botTest).toBeUndefined();
  });
});
