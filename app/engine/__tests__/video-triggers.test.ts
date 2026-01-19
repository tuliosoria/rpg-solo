import { describe, it, expect, beforeEach } from 'vitest';
import type { GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../types';
import { executeCommand } from '../commands';

describe('Video Trigger Logic', () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      imagesShownThisRun: new Set(),
    };
  });

  it('tracks shown videos in imagesShownThisRun set', () => {
    const result = executeCommand('open /storage/quarantine/surveillance_recovery.vid', initialState);

    expect(result.stateChanges.imagesShownThisRun instanceof Set).toBe(true);
  });

  it('does not set imagesShownThisRun for non-video commands', () => {
    const result = executeCommand('help', initialState);

    expect(result.stateChanges.imagesShownThisRun).toBeUndefined();
  });
});
